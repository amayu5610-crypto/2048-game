import { maintenanceMode, adminBypass, latestVersion } from "./config.js";
import { modes } from "./modes.js";
import {
  auth,
  onAuthStateChanged,
  loginWithGoogle,
  logoutFirebase,
  handleRedirectLogin,
  ensurePlayer,
  saveNickname,
  savePlayerProgress,
  loadPlayerProgress
} from "./firebase.js";
import { startGame as createStartedGame, move, getMaxTile } from "./game.js";
import {
  $,
  showOnly,
  showMessage,
  renderModeButtons,
  renderRankingModeButtons,
  renderBoard,
  renderGameInfo,
  showResult,
  showStartOverlay,
  closeModal,
  escapeText,
  renderStats
} from "./ui.js";
import {
  loadBestScore,
  saveScore,
  syncPendingScores,
  listenModeRanking,
  loadOverallRanking,
  searchFriendByName
} from "./ranking.js";
import {
  checkAchievements,
  checkAchievementsInGame,
  renderAchievements,
  showAchievementNotification,
  updateLocalStats,
} from "./achievements.js";
import { renderUpdateHistory, showUpdateHistoryModal } from "./updates.js";

let currentUser = null;
let playerData = null;
let state = null;
let selectedMode = "null";
let unsubscribeRanking = null;
let timerId = null;
let isSaving = false;
let historyPage = 1;


const HISTORY_PER_PAGE = 10;

if (maintenanceMode && !adminBypass) {
  document.body.innerHTML = `
    <main class="maintenance">
      <h1>🔧 メンテナンス中</h1>
      <p>現在アップデート中です。しばらくしてから開いてください。</p>
    </main>`;
  throw new Error("Maintenance mode");
}

window.addEventListener("DOMContentLoaded", init);

async function init() {
  $("version") && ($("version").textContent = `v${latestVersion}`);
  bindUI();
  bindCategoryToggles();
  await handleRedirectLogin();
  watchAuth();
  openHome();

  // inline onclickが残っている古いHTMLでも落ちないように公開
  window.startGame = () => startSelectedMode(selectedMode || "normal");
  window.backToModeSelect = openModeSelect;
}

function bindUI() {
  $("settingsToggleButton")?.addEventListener("click", () => {
    $("settingsModal")?.classList.remove("hidden");
    document.body.classList.add("modal-open");
  });
  $("closeSettingsButton")?.addEventListener("click", () => {
    $("settingsModal")?.classList.add("hidden");
    document.body.classList.remove("modal-open");
  });
  $("accountInfoButton")?.addEventListener("click", () => $("accountPanel")?.classList.toggle("hidden"));
  $("updateHistoryButton")?.addEventListener("click", showUpdateHistoryModal);

  $("loginButton")?.addEventListener("click", async () => {
    try { await loginWithGoogle(); } catch (e) { console.error(e); showMessage("ログインに失敗しました。"); }
  });
  $("logoutButton")?.addEventListener("click", async () => {
    await logoutFirebase();
    location.reload();
  });
  $("saveNicknameButton")?.addEventListener("click", saveNicknameFromInput);
  $("nicknameInput")?.addEventListener("keydown", e => { if (e.key === "Enter") saveNicknameFromInput(); });

  $("goModeButton")?.addEventListener("click", openModeSelect);
  $("goRankingButton")?.addEventListener("click", openRanking);
  $("goStatsButton")?.addEventListener("click", openStats);
  $("goAchievementsButton")?.addEventListener("click", openAchievements);
  $("closeAchievementsButton")?.addEventListener("click", () => closeModal("achievementsModal"));

  $("backHomeFromModeButton")?.addEventListener("click", openHome);
  $("backHomeFromRankingButton")?.addEventListener("click", openHome);
  $("backHomeFromStatsButton")?.addEventListener("click", openHome);

  $("restartButton")?.addEventListener("click", () => startSelectedMode(selectedMode));
  $("restartInlineButton")?.addEventListener("click", () => startSelectedMode(selectedMode));
  $("backToModesButton")?.addEventListener("click", openModeSelect);
  $("backToModesInlineButton")?.addEventListener("click", openModeSelect);

  $("playAgainButton")?.addEventListener("click", () => { closeModal("resultModal"); startSelectedMode(selectedMode); });
  $("closeResultButton")?.addEventListener("click", () => closeModal("resultModal"));

  $("showModeRankingMenuButton")?.addEventListener("click", () => {
    $("rankingModeMenu")?.classList.toggle("hidden");
    renderRankingModeButtons($("rankingModeMenu"), key => {
      selectedMode = key;
      $("rankingModal")?.classList.remove("hidden");
      document.body.classList.add("modal-open");
      restartRankingListener(key, true);
    }, selectedMode);
  });

  $("showOverallRankingButton")?.addEventListener("click", async () => {
    $("rankingModal")?.classList.remove("hidden");
    document.body.classList.add("modal-open");
    $("standaloneRankingTitle") && ($("standaloneRankingTitle").textContent = "総合ランキング");
    await loadOverallRanking($("standaloneRankingList"));
  });

  $("rankingModal")?.addEventListener("click", e => {
    if (e.target === $("rankingModal")) closeModal("rankingModal");
  });

  $("showFriendCompareButton")?.addEventListener("click", () => {
    $("friendCompareModal")?.classList.remove("hidden");
    document.body.classList.add("modal-open");
    $("friendSearchInput") && ($("friendSearchInput").value = "");
    $("friendCompareResult") && ($("friendCompareResult").innerHTML = "");
    $("friendCompareHeaderPlaceholder") && ($("friendCompareHeaderPlaceholder").innerHTML = "");
    $("friendSearchInput")?.focus();
  });
  $("closeFriendCompareButton")?.addEventListener("click", () => closeModal("friendCompareModal"));
  $("friendSearchBtn")?.addEventListener("click", searchFriend);
  $("friendSearchInput")?.addEventListener("keydown", e => { if (e.key === "Enter") searchFriend(); });

  document.addEventListener("keydown", handleKey);
  bindSwipe($("board"));
}

function bindCategoryToggles() {
  document.querySelectorAll(".category-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      const box = $(`category-${category}`);
      if (!box) return;
      box.classList.toggle("hidden");
      const label = button.textContent.replace(/^▶\s*|^▼\s*/g, "");
      button.textContent = `${box.classList.contains("hidden") ? "▶" : "▼"} ${label}`;
    });
  });
}

function watchAuth() {
  onAuthStateChanged(auth, async user => {
    currentUser = user || null;
    const loggedIn = Boolean(currentUser);

    $("loginButton")?.classList.toggle("hidden", loggedIn);
    $("logoutButton")?.classList.toggle("hidden", !loggedIn);
    $("nicknamePanel")?.classList.toggle("hidden", !loggedIn);

    if (loggedIn) {
      try {
        console.log("ensurePlayer start");
        playerData = await ensurePlayer(currentUser);
        console.log("ensurePlayer OK", playerData);

        if ($("loginStatus")) {
          $("loginStatus").textContent =
            `ログイン中: ${currentUser.email || "Googleユーザー"}`;
        }

        if ($("nicknameInput")) {
          $("nicknameInput").value = playerData?.game_name || "";
        }

        console.log("syncPendingScores start");
        await syncPendingScores(currentUser, playerData);
        console.log("syncPendingScores OK");

        // ログイン時に Firebase のアチーブメントをローカルとマージ
        try {
          const progress = await loadPlayerProgress(currentUser);
          if (progress?.achievements?.length) {
            const local = JSON.parse(localStorage.getItem("achievements2048") || "[]");
            const merged = [...new Set([...local, ...progress.achievements])];
            localStorage.setItem("achievements2048", JSON.stringify(merged));
            console.log("achievements synced:", merged.length, "件");
          }
        } catch (e) {
          console.warn("アチーブメント同期失敗（続行）", e);
        }

      } catch (e) {
        console.error("ログイン後処理エラー", e);
        showMessage("ユーザーデータの読み込みに失敗しました。");
      }
    } else {
      playerData = null;
      if ($("loginStatus")) $("loginStatus").textContent = "未ログイン";
    }

    try {
      console.log("① ensurePlayer開始");
      playerData = await ensurePlayer(currentUser);
      console.log("① ensurePlayer成功");

      console.log("② syncPendingScores開始");
      await syncPendingScores(currentUser, playerData);
      console.log("② syncPendingScores成功");

      } catch (e) {
        console.error("エラー発生", e);
      }
  });
}

async function saveNicknameFromInput() {
  try {
    const name = await saveNickname(currentUser, $("nicknameInput")?.value || "");
    playerData = await ensurePlayer(currentUser);
    showMessage(`ニックネームを「${name}」にしました。`);
  } catch (error) {
    showMessage(error.message || "ニックネーム保存に失敗しました。");
  }
}

function openHome() {
  document.body.classList.remove("playing");
  stopTimer();
  showOnly("homeScreen");
}

function openModeSelect() {
  document.body.classList.remove("playing");
  stopTimer();
  showOnly("modeSelectScreen");

  const onModeTap = key => {
    if (selectedMode === key) {
      startSelectedMode(key);
      return;
    }

    selectedMode = key;

    renderModeButtons(
      null,
      onModeTap,
      selectedMode
    );

    $("rankingTitle") &&
      ($("rankingTitle").textContent = `${modes[key].label} ランキング`);

    restartRankingListener(key);
  };

  renderModeButtons(
    null,
    onModeTap,
    selectedMode
  );

  restartRankingListener(selectedMode);
}

function openRanking() {
  document.body.classList.remove("playing");
  stopTimer();
  showOnly("rankingScreen");
  renderRankingModeButtons($("rankingModeMenu"), key => {
    selectedMode = key;
    $("rankingModal")?.classList.remove("hidden");
    document.body.classList.add("modal-open");
    restartRankingListener(key, true);
  }, selectedMode);
}

async function openStats() {
  document.body.classList.remove("playing");
  stopTimer();
  showOnly("statsScreen");

  const statsContent = $("statsContent");
  const historyContent = $("historyContent");

  if (!statsContent || !historyContent) {
    console.error("statsContent または historyContent が見つかりません");
    return;
  }

  let stats = JSON.parse(localStorage.getItem("stats2048") || "{}");

  if (currentUser) {
    try {
      const progress = await loadPlayerProgress(currentUser);

      if (progress?.stats) {
        stats = progress.stats;
      }

      if (progress?.history) {
        localStorage.setItem("history2048", JSON.stringify(progress.history));
      }

      // Firebase のアチーブメントをローカルとマージ（どちらかで解除済みなら解除済み扱い）
      if (progress?.achievements?.length) {
        const local = JSON.parse(localStorage.getItem("achievements2048") || "[]");
        const merged = [...new Set([...local, ...progress.achievements])];
        localStorage.setItem("achievements2048", JSON.stringify(merged));
      }

      // ランキング側 scores2048 の最高スコアを My Scores に反映
      for (const key of Object.keys(modes)) {
        const bestFromRanking = await loadBestScore(currentUser.uid, key);

        if (!stats[key]) {
          stats[key] = {
            bestScore: 0,
            playCount: 0,
            maxTile: 0,
            bestTime: null
          };
        }

        stats[key].bestScore = Math.max(
          Number(stats[key].bestScore || 0),
          Number(bestFromRanking || 0)
        );
      }

      localStorage.setItem("stats2048", JSON.stringify(stats));

    } catch (error) {
      console.error("My Scores同期読み込み失敗", error);
    }
  }

  renderStats(stats, statsContent, historyContent);
}

function openAchievements() {
  renderAchievements($("achievementsContent"));
  $("achievementsModal")?.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

async function startSelectedMode(modeKey = "normal") {
  selectedMode = modeKey;
  stopTimer();

  state = createStartedGame(modeKey);

  const best = await loadBestScore(currentUser?.uid, modeKey);
  state.best = best;

  showOnly("gameScreen");
  document.body.classList.add("playing");

  render();

  // タイムアタック・サバイバルは開始前にオーバーレイを出す
  if (modeKey === "timeAttack" || modeKey === "survival") {
    const modeLabel = modes[modeKey]?.label || modeKey;
    showStartOverlay(
      modeLabel,
      () => startTimerIfNeeded(),   // Start → タイマー開始
      () => openModeSelect()        // Back → モード選択に戻る
    );
  } else {
    startTimerIfNeeded();
  }
}

function render() {
  if (!state) return;
  renderBoard($("board"), state);

  renderGameInfo(
    state,
    Math.max(state.best || 0, state.score),
    currentUser
  );
}

function handleKey(e) {
  if (!state || $("gameScreen")?.classList.contains("hidden")) return;
  const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
  const direction = map[e.key];
  if (!direction) return;
  e.preventDefault();
  doMove(direction);
}

function doMove(direction) {
  if (!state || state.gameOver) return;
  if (document.getElementById("startOverlay")) return; // オーバーレイ表示中は無効
  const moved = move(state, direction);
  if (!moved) return;
  state.best = Math.max(state.best || 0, state.score);
  render();

  if (getMaxTile(state) >= 2048 && !state.won) {
    state.won = true;
    showMessage("🎉 2048達成！続けてプレイできます。");
  }

  // ゲーム中のその場アチーブ判定（スコア・タイル系のみ、保存はゲームオーバー時）
  const ingameNewly = checkAchievementsInGame(state.modeKey, state.score, state.board);
  ingameNewly.forEach(item => showAchievementNotification(item));

  if (state.gameOver) finishGame("ゲームオーバー");
}

function bindSwipe(el) {
  if (!el) return;
  let sx = 0, sy = 0;

  el.addEventListener("touchstart", e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });

  // ★追加: 盤面上でのタッチ移動時はページスクロールを止める
  el.addEventListener("touchmove", e => {
    e.preventDefault();
  }, { passive: false });

  el.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "right" : "left");
    else doMove(dy > 0 ? "down" : "up");
  }, { passive: true });
}

function startTimerIfNeeded() {
  if (!state || !(state.modeKey === "timeAttack" || state.modeKey === "survival")) return;
  timerId = setInterval(() => {
    state.timeLeft -= 1;
    render();
    if (state.timeLeft <= 0) finishGame("タイムアップ");
  }, 1000);
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

async function finishGame(title) {
  if (!state || isSaving) return;

  isSaving = true;
  stopTimer();
  state.gameOver = true;

  render();
  showResult(state, title);

  document.getElementById("playAgainButton")?.addEventListener("click", () => {
    closeModal("resultModal");
    startSelectedMode(selectedMode);
  }, { once: true });

  document.getElementById("resultModeButton")?.addEventListener("click", () => {
    closeModal("resultModal");
    openModeSelect();
  }, { once: true });

  document.getElementById("closeResultButton")?.addEventListener("click", () => {
    closeModal("resultModal");
  }, { once: true });

  const stats = updateLocalStats(state);
  const newly = checkAchievements(stats);

  newly.forEach(item =>
    showAchievementNotification(item)
  );

  console.log("保存時 currentUser:", currentUser);
  console.log("保存時 stats:", stats);

  try {
    await saveScore({ user: currentUser, playerData, state });
    await savePlayerProgress(currentUser, stats);
  } catch (e) {
    console.error("保存エラー", e);
  } finally {
    isSaving = false;
  }
}

function restartRankingListener(modeKey, standalone = false) {
  if (unsubscribeRanking) unsubscribeRanking();
  const list = standalone ? $("standaloneRankingList") : $("rankingList");
  const title = standalone ? $("standaloneRankingTitle") : $("rankingTitle");
  if (title) title.textContent = `${modes[modeKey]?.label || modeKey} ランキング`;
  unsubscribeRanking = listenModeRanking(modeKey, list, title);
}

async function searchFriend() {
  const input = $("friendSearchInput");
  const result = $("friendCompareResult");

  if (!input || !result) return;

  result.innerHTML = `<div class="empty">検索中...</div>`;

  try {
    const data = await searchFriendByName(input.value, currentUser?.uid);

    const modesToShow = Object.keys(modes)
      .filter(key => data.friendScores[key] || data.myScores[key]);

    if (!modesToShow.length) {
      result.innerHTML = `<div class="empty">比較できるスコアがありません。</div>`;
      return;
    }

    const myName =
      playerData?.game_name ||
      currentUser?.displayName ||
      "プレイヤー";

    const friendName =
      data.friend.game_name || "友達";

    $("friendCompareHeaderPlaceholder") &&
      ($("friendCompareHeaderPlaceholder").innerHTML = `
        <div class="friend-compare-header">
          <span>${escapeText(myName)}</span>
          <span>VS</span>
          <span>${escapeText(friendName)}</span>
        </div>
      `);

    result.innerHTML = modesToShow.map(key => {
      const mine = data.myScores[key] || 0;
      const friend = data.friendScores[key] || 0;

      const mineWin = mine > friend;
      const friendWin = friend > mine;

      return `
        <div class="friend-compare-row">
          <span class="friend-score ${mineWin ? "friend-score-win" : ""}">
            ${Number(mine).toLocaleString()}
          </span>

          <span class="friend-compare-mode">
            ${escapeText(modes[key].label)}
          </span>

          <span class="friend-score ${friendWin ? "friend-score-win" : ""}">
            ${Number(friend).toLocaleString()}
          </span>
        </div>
      `;
    }).join("");

  } catch (error) {
    result.innerHTML =
      `<div class="empty">${escapeText(error.message || "検索に失敗しました。")}</div>`;
  }
}
