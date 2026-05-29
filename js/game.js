import { modes } from "./modes.js";

export function createGame(modeKey = "normal") {
  const mode = modes[modeKey] || modes.normal;
  return {
    modeKey,
    size: mode.size,
    board: Array.from({ length: mode.size }, () => Array(mode.size).fill(0)),
    score: 0,
    best: 0,
    moveCount: 0,
    moves: [],
    blockedCells: [],
    hiddenCells: [],
    newCell: null,
    mergedCells: [],
    startedAt: Date.now(),
    timeLeft: mode.timeLimit || 0,
    gameOver: false,
    won: false
  };
}

export function startGame(modeKey = "normal") {
  const state = createGame(modeKey);
  if (state.modeKey === "maze") createBlockedCells(state);
  addRandomTile(state);
  addRandomTile(state);
  return state;
}

export function cloneBoard(board) {
  return board.map(row => [...row]);
}

export function boardsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getMode(state) {
  return modes[state.modeKey] || modes.normal;
}

export function getRandomNumber(state) {
  const mode = getMode(state);
  const tiles = state.modeKey === "chaosShift" ? getChaosShiftTiles(state.moveCount) : mode.tiles;
  const rand = Math.random();
  let sum = 0;
  for (const tile of tiles) {
    sum += tile.rate;
    if (rand <= sum) return tile.value;
  }
  return tiles[tiles.length - 1].value;
}

function getChaosShiftTiles(moveCount) {
  if (moveCount < 20) return [{ value: 2, rate: 0.58 }, { value: 4, rate: 0.24 }, { value: 8, rate: 0.11 }, { value: 16, rate: 0.07 }];
  if (moveCount < 40) return [{ value: 2, rate: 0.15 }, { value: 4, rate: 0.25 }, { value: 8, rate: 0.30 }, { value: 16, rate: 0.20 }, { value: 32, rate: 0.08 }, { value: 64, rate: 0.02 }];
  if (moveCount < 60) return [{ value: 2, rate: 0.05 }, { value: 4, rate: 0.15 }, { value: 8, rate: 0.25 }, { value: 16, rate: 0.25 }, { value: 32, rate: 0.18 }, { value: 64, rate: 0.09 }, { value: 128, rate: 0.03 }];
  return [{ value: 2, rate: 0.02 }, { value: 4, rate: 0.10 }, { value: 8, rate: 0.18 }, { value: 16, rate: 0.24 }, { value: 32, rate: 0.22 }, { value: 64, rate: 0.14 }, { value: 128, rate: 0.06 }, { value: 256, rate: 0.03 }, { value: 512, rate: 0.01 }];
}

export function isBlockedCell(state, r, c) {
  return state.blockedCells.some(cell => cell.r === r && cell.c === c);
}

export function addRandomTile(state) {
  const empty = [];
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.board[r][c] === 0 && !isBlockedCell(state, r, c)) empty.push({ r, c });
    }
  }
  if (!empty.length) return false;
  const cell = empty[Math.floor(Math.random() * empty.length)];
  state.board[cell.r][cell.c] = getRandomNumber(state);
  state.newCell = cell;
  return true;
}

function slideValues(values, state, trackPosition) {
  const filtered = values.filter(v => v !== 0);
  const result = [];
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      state.score += merged;
      if (state.modeKey === "survival") state.timeLeft += getMode(state).timeBonus || 0;
      result.push(merged);
      if (trackPosition) trackPosition(result.length - 1);
      i++;
    } else {
      result.push(filtered[i]);
    }
  }
  while (result.length < values.length) result.push(0);
  return result;
}

function moveLineWithBlocks(values, blocks, state, track) {
  const result = [...values];
  let start = 0;
  while (start < values.length) {
    if (blocks[start]) {
      result[start] = 0;
      start++;
      continue;
    }
    let end = start;
    while (end < values.length && !blocks[end]) end++;
    const segment = values.slice(start, end);
    const moved = slideValues(segment, state, idx => track?.(start + idx));
    for (let i = start; i < end; i++) result[i] = moved[i - start];
    start = end;
  }
  return result;
}

export function move(state, direction) {
  if (state.gameOver) return false;
  const before = cloneBoard(state.board);
  state.mergedCells = [];
  state.newCell = null;

  const saveMerge = (r, c) => state.mergedCells.push({ r, c });

  if (direction === "left" || direction === "right") {
    for (let r = 0; r < state.size; r++) {
      const reverse = direction === "right";
      const values = reverse ? [...state.board[r]].reverse() : [...state.board[r]];
      const blocks = values.map((_, i) => isBlockedCell(state, r, reverse ? state.size - 1 - i : i));
      const moved = state.modeKey === "maze"
        ? moveLineWithBlocks(values, blocks, state, idx => saveMerge(r, reverse ? state.size - 1 - idx : idx))
        : slideValues(values, state, idx => saveMerge(r, reverse ? state.size - 1 - idx : idx));
      state.board[r] = reverse ? moved.reverse() : moved;
    }
  }

  if (direction === "up" || direction === "down") {
    for (let c = 0; c < state.size; c++) {
      const reverse = direction === "down";
      let values = [];
      let blocks = [];
      for (let r = 0; r < state.size; r++) {
        const rr = reverse ? state.size - 1 - r : r;
        values.push(state.board[rr][c]);
        blocks.push(isBlockedCell(state, rr, c));
      }
      const moved = state.modeKey === "maze"
        ? moveLineWithBlocks(values, blocks, state, idx => saveMerge(reverse ? state.size - 1 - idx : idx, c))
        : slideValues(values, state, idx => saveMerge(reverse ? state.size - 1 - idx : idx, c));
      for (let r = 0; r < state.size; r++) {
        const rr = reverse ? state.size - 1 - r : r;
        state.board[rr][c] = moved[r];
      }
    }
  }

  if (boardsEqual(before, state.board)) return false;
  state.moveCount++;
  state.moves.push(direction[0].toUpperCase());

  if (state.modeKey === "maze" && Math.random() < (getMode(state).wallChangeRate || 0)) createBlockedCells(state);
  if (state.modeKey === "shuffle" && state.moveCount % (getMode(state).shuffleInterval || 7) === 0) shuffleBoardTiles(state);
  if (state.modeKey === "split") splitRandomTile(state);
  if (state.modeKey === "blind") createHiddenCells(state);

  addRandomTile(state);
  state.gameOver = isGameOver(state);
  return true;
}

export function createBlockedCells(state) {
  const mode = getMode(state);
  const count = Math.floor(Math.random() * ((mode.blockedMax || 4) - (mode.blockedMin || 2) + 1)) + (mode.blockedMin || 2);
  const candidates = [];
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.board[r][c] === 0) candidates.push({ r, c });
    }
  }
  state.blockedCells = [];
  while (state.blockedCells.length < count && candidates.length) {
    const index = Math.floor(Math.random() * candidates.length);
    state.blockedCells.push(candidates.splice(index, 1)[0]);
  }
}

export function createHiddenCells(state) {
  const rate = getMode(state).hiddenRate || 0.35;
  state.hiddenCells = [];
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.board[r][c] !== 0 && Math.random() < rate) state.hiddenCells.push(`${r}-${c}`);
    }
  }
}

export function shuffleBoardTiles(state) {
  const values = [];
  const cells = [];
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (!isBlockedCell(state, r, c)) {
        cells.push({ r, c });
        if (state.board[r][c] !== 0) values.push(state.board[r][c]);
        state.board[r][c] = 0;
      }
    }
  }
  shuffle(values);
  shuffle(cells);
  values.forEach((value, index) => {
    const cell = cells[index];
    state.board[cell.r][cell.c] = value;
  });
}

export function splitRandomTile(state) {
  const mode = getMode(state);
  if (Math.random() > (mode.splitRate || 0.15)) return;
  const candidates = [];
  const empty = [];
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.board[r][c] >= 4 && !isBlockedCell(state, r, c)) candidates.push({ r, c });
      if (state.board[r][c] === 0 && !isBlockedCell(state, r, c)) empty.push({ r, c });
    }
  }
  if (!candidates.length || !empty.length) return;
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  const spot = empty[Math.floor(Math.random() * empty.length)];
  const half = state.board[target.r][target.c] / 2;
  state.board[target.r][target.c] = half;
  state.board[spot.r][spot.c] = half;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function isGameOver(state) {
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.board[r][c] === 0 && !isBlockedCell(state, r, c)) return false;
      if (c < state.size - 1 && !isBlockedCell(state, r, c) && !isBlockedCell(state, r, c + 1) && state.board[r][c] === state.board[r][c + 1]) return false;
      if (r < state.size - 1 && !isBlockedCell(state, r, c) && !isBlockedCell(state, r + 1, c) && state.board[r][c] === state.board[r + 1][c]) return false;
    }
  }
  return true;
}

export function getMaxTile(state) {
  return Math.max(0, ...state.board.flat());
}

export function getPlayTime(state) {
  return Math.floor((Date.now() - state.startedAt) / 1000);
}
