import { modes } from "./modes.js";
import { isBlockedCell } from "./game.js";

export const categoryLabels = {
  basic: "初級",
  hard: "中級",
  special: "上級",
  mode: "特殊"
};

export function $(id) {
  return document.getElementById(id);
}

export function escapeText(text) {
  return String(text ?? "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
  }[ch]));
}

export function showOnly(screenId) {
  ["homeScreen", "modeSelectScreen", "rankingScreen", "gameScreen", "statsScreen"].forEach(id => {
    $(id)?.classList.add("hidden");
  });

  $(screenId)?.classList.remove("hidden");

  document.body.classList.toggle("playing", screenId === "gameScreen");
}

export function showMessage(message, ms = 2200) {
  const el = $("toast") || ensureToast();
  el.textContent = message;
  el.classList.remove("hidden");
  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(() => el.classList.add("hidden"), ms);
}

function ensureToast() {
  const el = document.createElement("div");
  el.id = "toast";
  el.className = "toast hidden";
  el.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:#3c3a32;color:#fff;padding:12px 18px;border-radius:12px;box-shadow:0 6px 22px rgba(0,0,0,.3);font-weight:bold;font-size:15px;line-height:1.4;white-space:nowrap;max-width:94vw;text-align:center;";
  document.body.appendChild(el);
  return el;
}

export function renderModeButtons(container, onSelect, selectedMode = null) {
  // Existing index.html has category-basic/category-hard/category-special/category-mode.
  const categoryContainers = {
    basic: $("category-basic"),
    hard: $("category-hard"),
    special: $("category-special"),
    mode: $("category-mode")
  };

  if (Object.values(categoryContainers).some(Boolean)) {
    Object.values(categoryContainers).forEach(el => { if (el) el.innerHTML = ""; });
    Object.entries(modes).forEach(([key, mode]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mode-btn" + (selectedMode === key ? " active" : "");
      btn.dataset.mode = key;
      btn.innerHTML = `
        <span class="mode-title">${escapeText(mode.label)}</span>
        ${selectedMode === key ? `<span class="mode-detail">${escapeText(mode.detail || "")}</span>` : ""}
      `;
      btn.addEventListener("click", () => onSelect(key));
      categoryContainers[mode.category]?.appendChild(btn);
    });
    return;
  }

  if (!container) return;
  container.innerHTML = "";
  for (const [category, label] of Object.entries(categoryLabels)) {
    const group = document.createElement("section");
    group.className = "mode-group";
    group.innerHTML = `<h3>${escapeText(label)}</h3><div class="mode-grid"></div>`;
    const grid = group.querySelector(".mode-grid");
    Object.entries(modes)
      .filter(([, mode]) => mode.category === category)
      .forEach(([key, mode]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mode-btn" + (selectedMode === key ? " active" : "");
        btn.dataset.mode = key;
        btn.innerHTML = `
          <span>${escapeText(mode.label)}</span>
          ${selectedMode === key ? `<small>${escapeText(mode.detail || "")}</small>` : ""}
        `;
        btn.addEventListener("click", () => onSelect(key));
        grid.appendChild(btn);
      });
    if (grid.children.length) container.appendChild(group);
  }
}

export function renderRankingModeButtons(container, onSelect, selectedMode = null) {
  if (!container) return;
  container.innerHTML = "";
  for (const [category, label] of Object.entries(categoryLabels)) {
    const toggle = document.createElement("button");
    toggle.className = "ranking-category-toggle";
    toggle.textContent = `▶ ${label}`;
    const box = document.createElement("div");
    box.className = "ranking-category-content hidden";
    Object.entries(modes)
      .filter(([, mode]) => mode.category === category)
      .forEach(([key, mode]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mode-btn" + (selectedMode === key ? " active" : "");
        btn.textContent = mode.label;
        btn.addEventListener("click", () => onSelect(key));
        box.appendChild(btn);
      });
    toggle.addEventListener("click", () => {
      box.classList.toggle("hidden");
      toggle.textContent = `${box.classList.contains("hidden") ? "▶" : "▼"} ${label}`;
    });
    container.appendChild(toggle);
    container.appendChild(box);
  }
}

export function getCellColor(value) {
  const colors = {
    2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563",
    32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61",
    512: "#edc850", 1024: "#edc53f", 2048: "#edc22e",
    4096: "#d4a017", 8192: "#b8860b", 16384: "#996515",
    32768: "#7a4a1b", 65536: "#5a3413", 131072: "#40220f",
    262144: "#2b1608", 524288: "#1a0d04", 1048576: "#0d0602"
  };
  return colors[value] || "#111";
}

export function renderBoard(boardEl, state) {
  if (!boardEl || !state) return;

  const gap = 6;

  const maxBoardWidth = window.innerWidth < 500
    ? Math.floor(window.innerWidth * 0.88)
    : state.size === 5
      ? 450
      : 460;

  const cellSize = Math.floor((maxBoardWidth - gap * (state.size - 1)) / state.size);
  const boardSize = cellSize * state.size + gap * (state.size - 1);

  boardEl.innerHTML = "";
  boardEl.style.display = "grid";
  boardEl.style.width = `${boardSize}px`;
  boardEl.style.height = `${boardSize}px`;
  boardEl.style.gridTemplateColumns = `repeat(${state.size}, ${cellSize}px)`;
  boardEl.style.gridTemplateRows = `repeat(${state.size}, ${cellSize}px)`;
  boardEl.style.gap = `${gap}px`;
  boardEl.dataset.size = String(state.size);

  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      const value = state.board[r][c];
      const cell = document.createElement("div");
      cell.className = "cell";

      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.style.lineHeight = `${cellSize}px`;
      cell.style.fontSize = `${Math.max(18, Math.floor(cellSize * 0.35))}px`;

      if (isBlockedCell(state, r, c)) {
        cell.classList.add("blocked-cell");
        cell.textContent = "×";
      } else if (value) {
        const isBlind = state.modeKey === "blind";
        const hidden = isBlind && state.hiddenCells.includes(`${r}-${c}`);

        cell.textContent = hidden ? "?" : value;
        // Blindモードだけマスの色をなしにする（全マス同じ色）
        cell.style.background = (hidden || isBlind) ? "#cdc1b4" : getCellColor(value);
        cell.style.color = (value >= 8 && !hidden && !isBlind) ? "#f9f6f2" : "#776e65";
      }

      if (state.newCell?.r === r && state.newCell?.c === c) {
        cell.classList.add("new");
      }

      if (state.mergedCells?.some(pos => pos.r === r && pos.c === c)) {
        cell.classList.add("merged");
      }

      boardEl.appendChild(cell);
    }
  }

  state.newCell = null;
  state.mergedCells = [];
}

export function renderGameInfo(state, best = 0, currentUser = null) {
  if (!state) return;

  $("score") && (
    $("score").textContent =
      `🏆 Score: ${Number(state.score || 0).toLocaleString()}`
  );

  $("bestScore") && (
    $("bestScore").textContent =
      `⭐ Best: ${Number(best || 0).toLocaleString()}`
  );

  $("difficulty") && (
    $("difficulty").textContent =
      `🎮 ${modes[state.modeKey]?.label || state.modeKey}`
  );

  const status = $("status");

  if (status) {
    if (
      state.modeKey === "timeAttack" ||
      state.modeKey === "survival"
    ) {
      status.textContent =
        `⏱ タイマー: ${Math.max(0, state.timeLeft)}秒`;
    } else {
      status.textContent = currentUser
        ? "☁️ オンライン保存済み"
        : "⚠️ オンライン未保存";
    }
  }
}

export function showResult(state, title = "ゲームオーバー") {
  let modal = $("resultModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "resultModal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-content result-window">
        <button id="closeResultButton" class="close-btn">×</button>
        <h2 id="resultTitle"></h2>
        <div id="resultBody"></div>
        <div class="result-actions">
          <button id="playAgainButton">もう一度</button>
          <button id="resultModeButton" class="secondary">モード選択</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  $("resultTitle").textContent = title;
  $("resultBody").innerHTML = `
  <div class="result-stats">
    <div class="result-stat-item">
      <div class="result-stat-label">Score</div>
      <div class="result-stat-value">${Number(state.score || 0).toLocaleString()}</div>
    </div>

    <div class="result-stat-item">
      <div class="result-stat-label">Max Tile</div>
      <div class="result-stat-value">${Math.max(0, ...state.board.flat()).toLocaleString()}</div>
    </div>

    <div class="result-stat-item">
      <div class="result-stat-label">Moves</div>
      <div class="result-stat-value">${state.moveCount}</div>
    </div>
  </div>
`;
  
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

export function closeModal(id) {
  $(id)?.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

// タイムアタック・サバイバル用の開始前オーバーレイ。
// スタートで onStart()（タイマー開始）、戻るで onBack()（モード選択）を呼ぶ。
// この要素(id="startOverlay")が存在する間は doMove 側で操作がブロックされる。
export function showStartOverlay(modeLabel, onStart, onBack) {
  document.getElementById("startOverlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "startOverlay";
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;" +
    "background:rgba(60,58,50,.55);";

  overlay.innerHTML = `
    <div style="background:#faf8f0;border-radius:16px;padding:24px 22px;width:300px;max-width:88vw;
                text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.25);">
      <div style="font-size:14px;color:#9f8b77;font-weight:bold;margin-bottom:6px;">これからプレイ</div>
      <div style="font-size:24px;font-weight:bold;color:#5f5147;margin-bottom:8px;">${escapeText(modeLabel)}</div>
      <div style="font-size:13px;color:#9f8b77;margin-bottom:18px;">スタートを押すと時間制限が始まります。</div>
      <button id="startOverlayStart" style="display:block;width:100%;padding:12px;margin:0 0 10px;border:none;
              border-radius:12px;background:#8f7a66;color:#fff;font-size:16px;font-weight:bold;cursor:pointer;">スタート</button>
      <button id="startOverlayBack" style="display:block;width:100%;padding:10px;border:none;border-radius:12px;
              background:#d8cec2;color:#5f5147;font-size:14px;cursor:pointer;">モード選択に戻る</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#startOverlayStart")?.addEventListener("click", () => {
    overlay.remove();
    onStart?.();
  });
  overlay.querySelector("#startOverlayBack")?.addEventListener("click", () => {
    overlay.remove();
    onBack?.();
  });
}

let statsHistoryPage = 1;
const STATS_HISTORY_PER_PAGE = 10;

export function renderStats(stats, statsContent, historyContent) {
  if (statsContent) {
    const groups = {
      basic: "🟢 初級",
      hard: "🟠 中級",
      special: "🔴 上級",
      mode: "🟣 特殊"
    };

    statsContent.innerHTML = Object.entries(groups).map(([category, label]) => {
      const rows = Object.entries(modes)
        .filter(([, mode]) => mode.category === category)
        .map(([key, mode]) => {
          const s = stats[key] || {};
          return `
            <div class="stats-row">
              <div class="stats-mode-name">${escapeText(mode.label)}</div>
              <div class="stats-row-values">
                <span>Best<br><b>${Number(s.bestScore || 0).toLocaleString()}</b></span>
                <span>Play<br><b>${Number(s.playCount || 0).toLocaleString()}</b></span>
                <span>Max<br><b>${Number(s.maxTile || 0).toLocaleString()}</b></span>
              </div>
            </div>
          `;
        }).join("");

      return `
        <div class="stats-category-block">
          <div class="stats-category-label">${label}</div>
          ${rows}
        </div>
      `;
    }).join("");
  }

  if (historyContent) {
    const history = JSON.parse(localStorage.getItem("history2048") || "[]");
    const totalPages = Math.max(1, Math.ceil(history.length / STATS_HISTORY_PER_PAGE));

    if (statsHistoryPage > totalPages) statsHistoryPage = totalPages;

    const start = (statsHistoryPage - 1) * STATS_HISTORY_PER_PAGE;
    const pageItems = history.slice(start, start + STATS_HISTORY_PER_PAGE);

    historyContent.innerHTML = `
      <h3 class="stats-history-title">📜 プレイ履歴</h3>

      ${
        pageItems.length
          ? pageItems.map(h => `
              <div class="history-row">
                <div>
                  <strong>${escapeText(h.modeName || h.mode || "")}</strong>
                  <span>${Number(h.score || 0).toLocaleString()}点</span>
                </div>
                <small>${escapeText(h.createdAt || "")}</small>
              </div>
            `).join("")
          : `<div class="stats-empty">まだ履歴がありません。</div>`
      }

      <div class="history-pagination">
        <button id="historyPrevButton" ${statsHistoryPage <= 1 ? "disabled" : ""}>◀</button>
        <span class="history-page-info">${statsHistoryPage} / ${totalPages}</span>
        <button id="historyNextButton" ${statsHistoryPage >= totalPages ? "disabled" : ""}>▶</button>
      </div>
    `;

    $("historyPrevButton")?.addEventListener("click", () => {
      if (statsHistoryPage > 1) {
        statsHistoryPage--;
        renderStats(stats, statsContent, historyContent);
      }
    });

    $("historyNextButton")?.addEventListener("click", () => {
      if (statsHistoryPage < totalPages) {
        statsHistoryPage++;
        renderStats(stats, statsContent, historyContent);
      }
    });
  }
}