import { API_BASE } from "./config.js";
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from "./firebase.js";
import { escapeText } from "./ui.js";
import { getMaxTile, getPlayTime } from "./game.js";
import { modes } from "./modes.js";

export async function loadBestScore(uid, mode) {
  if (!uid) return loadLocalBest(mode);
  try {
    const snap = await getDoc(doc(db, "scores2048", `${uid}_${mode}`));
    return Math.max(loadLocalBest(mode), snap.exists() ? Number(snap.data().score || 0) : 0);
  } catch (error) {
    console.warn("ベストスコア取得失敗", error);
    return loadLocalBest(mode);
  }
}

export function loadLocalBest(mode) {
  const stats = JSON.parse(localStorage.getItem("stats2048") || "{}");
  return Number(stats[mode]?.bestScore || 0);
}

export async function saveScore({ user, playerData, state }) {
  saveLocalRanking(state, playerData?.game_name || playerData?.gameName || "ゲスト");
  if (!user?.uid || !playerData?.game_name) {
    savePendingScore({ state, playerName: playerData?.game_name || "ゲスト" });
    return;
  }

  // ランキング本体（Firestore）を先に確実に保存する
  try {
    await updateFirestoreBest(user, playerData, state);
  } catch (error) {
    console.warn("Firestore保存失敗", error);
    savePendingScore({ state, playerName: playerData?.game_name || "ゲスト" });
  }

  // サーバー送信は任意。失敗してもランキングには影響させない
  if (navigator.onLine) {
    postScoreToServer(user, playerData, state).catch(() => {});
  }
}

async function postScoreToServer(user, playerData, state) {
  await fetch(`${API_BASE}/save-score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: user.uid,
      name: playerData.game_name || "ゲスト",
      score: state.score,
      mode: state.modeKey,
      playTime: getPlayTime(state),
      moveCount: state.moveCount,
      maxTile: getMaxTile(state),
      moves: state.moves
    })
  });
}

async function updateFirestoreBest(user, playerData, state) {
  const ref = doc(db, "scores2048", `${user.uid}_${state.modeKey}`);
  const existing = await getDoc(ref);
  if (!existing.exists() || state.score > Number(existing.data().score || 0)) {
    await setDoc(ref, {
      uid: user.uid,
      game_name: playerData.game_name || "ゲスト",
      mode: state.modeKey,
      score: state.score,
      max_tile: getMaxTile(state),
      move_count: state.moveCount,
      play_time: getPlayTime(state),
      updated_at: new Date().toISOString()
    }, { merge: true });
  }
}

function saveLocalRanking(state, playerName) {
  const key = `ranking2048_${state.modeKey}`;
  const list = JSON.parse(localStorage.getItem(key) || "[]");
  list.push({
    name: playerName,
    score: state.score,
    mode: state.modeKey,
    maxTile: getMaxTile(state),
    moveCount: state.moveCount,
    createdAt: new Date().toLocaleString("ja-JP")
  });
  list.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
}

function savePendingScore({ state, playerName }) {
  const pending = JSON.parse(localStorage.getItem("pendingScores2048") || "[]");
  pending.push({
    playerName,
    score: state.score,
    mode: state.modeKey,
    maxTile: getMaxTile(state),
    moveCount: state.moveCount,
    playTime: getPlayTime(state),
    moves: state.moves,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem("pendingScores2048", JSON.stringify(pending.slice(-50)));
}

export async function syncPendingScores(user, playerData) {
  if (!user?.uid || !playerData?.game_name || !navigator.onLine) return;
  const pending = JSON.parse(localStorage.getItem("pendingScores2048") || "[]");
  if (!pending.length) return;
  const remaining = [];
  for (const item of pending) {
    try {
      const fakeState = {
        score: item.score,
        modeKey: item.mode,
        moveCount: item.moveCount,
        moves: item.moves || [],
        board: [[item.maxTile || 0]],
        startedAt: Date.now() - (item.playTime || 0) * 1000
      };
      await postScoreToServer(user, playerData, fakeState);
      await updateFirestoreBest(user, playerData, fakeState);
    } catch (error) {
      remaining.push(item);
    }
  }
  localStorage.setItem("pendingScores2048", JSON.stringify(remaining));
}

export function listenModeRanking(mode, container, titleEl) {
  if (!container) return () => {};
  if (titleEl) titleEl.textContent = `${modes[mode]?.label || mode} ランキング`;
  const q = query(collection(db, "scores2048"), where("mode", "==", mode), orderBy("score", "desc"), limit(20));
  return onSnapshot(q, snap => {
    const rows = [];
    snap.forEach(doc => rows.push(doc.data()));
    renderRanking(container, rows);
  }, error => {
    console.warn("ランキング取得失敗", error);
    renderLocalRanking(mode, container);
  });
}

export async function loadOverallRanking(container) {
  if (!container) return;

  try {
    const q = query(collection(db, "scores2048"), orderBy("score", "desc"));
    const snap = await getDocs(q);

    const modeKeys = Object.keys(modes);
    const players = {};

    snap.forEach(doc => {
      const data = doc.data();
      const uid = data.uid;
      const mode = data.mode;

      if (!uid || !mode) return;

      if (!players[uid]) {
        players[uid] = {
          uid,
          game_name: data.game_name || "ゲスト",
          modes: {},
          totalPoint: 0
        };
      }

      players[uid].modes[mode] = Number(data.score || 0);
    });

    const modeRanks = {};

    modeKeys.forEach(mode => {
      const ranked = Object.values(players)
        .filter(player => player.modes[mode] !== undefined)
        .sort((a, b) => b.modes[mode] - a.modes[mode]);

      modeRanks[mode] = ranked;

      ranked.forEach((player, index) => {
        const rank = index + 1;

        let point = 0;
        if (rank === 1) point = 7;
        else if (rank === 2) point = 5;
        else if (rank === 3) point = 3;

        player.totalPoint += point;
      });
    });

    const overallRows = Object.values(players)
      .filter(player => modeKeys.every(mode => player.modes[mode] !== undefined))
      .sort((a, b) => b.totalPoint - a.totalPoint)
      .map(player => ({
        game_name: player.game_name,
        score: player.totalPoint
      }));

    container.innerHTML = overallRows.map((row, index) => `
      <div class="ranking-row">
        <span class="rank">${index + 1}</span>
        <span class="name">${escapeText(row.game_name || "ゲスト")}</span>
      </div>
    `).join("");

  } catch (error) {
    console.error("総合ランキング取得失敗", error);
    container.innerHTML = `<div class="empty">総合ランキングを読み込めませんでした。</div>`;
  }
}

export function renderLocalRanking(mode, container) {
  const rows = JSON.parse(localStorage.getItem(`ranking2048_${mode}`) || "[]");
  renderRanking(container, rows);
}

export function renderRanking(container, rows, showMode = false) {
  if (!rows.length) {
    container.innerHTML = `<div class="empty">まだランキングがありません。</div>`;
    return;
  }
  container.innerHTML = rows.map((row, index) => `
    <div class="ranking-row">
      <span class="rank">${index + 1}</span>
      <span class="name">${escapeText(row.game_name || row.name || "ゲスト")}</span>
      ${showMode ? `<span class="mode">${escapeText(row.mode || "")}</span>` : ""}
      <strong>${Number(row.score || 0).toLocaleString()}</strong>
    </div>
  `).join("");
}

export async function searchFriendByName(name, myUid) {
  const nameId = String(name || "").trim().toLowerCase().replace(/\s+/g, "_");
  if (!nameId) throw new Error("ニックネームを入力してください。");
  const nameSnap = await getDoc(doc(db, "userNames2048", nameId));
  if (!nameSnap.exists()) throw new Error("そのユーザーは見つかりませんでした。");
  const friend = nameSnap.data();
  const friendSnap = await getDocs(query(collection(db, "scores2048"), where("uid", "==", friend.uid)));
  const friendScores = {};
  friendSnap.forEach(d => friendScores[d.data().mode] = d.data().score || 0);

  const myScores = {};
  if (myUid) {
    const mySnap = await getDocs(query(collection(db, "scores2048"), where("uid", "==", myUid)));
    mySnap.forEach(d => myScores[d.data().mode] = d.data().score || 0);
  }
  return { friend, friendScores, myScores };
}
