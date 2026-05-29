export const updateHistory = [
  {
    version: "1.6.5",
    changes: [
      "My Scores画面追加（モード別自己ベスト・プレイ回数・履歴）",
      "アチーブメント機能追加（79個）",
      "ゲームオーバー時リザルト画面",
      "ベストスコアをゲーム画面に常時表示",
      "他のプレイヤーと比較機能",
      "スマホのズーム防止対応",
      "設定を開いた際の背景固定",
    ]
  },
  {
    version: "1.6.4",
    changes: [
      "📊 自分の成績ページ — モード別自己ベスト・プレイ回数・履歴をページ表示",
      "プレイ履歴のページネーション — 10件ごとに◀▶で切り替え",
      "統計・履歴を複数端末で共有",
      "オフライン対応 — オフライン中のデータをオンライン復帰時に自動同期",
      "リザルト画面 — ゲームオーバー・タイムアップ時にスコア・最大タイル・手数を表示",
      "他のプレイヤーと比較 — ランキング画面からニックネームで検索して比較",
    ]
  },

  {
    version: "1.6.3",
    changes: [
      "プレイ画面のマス幅がずれていたのを調整",
      "Extremeの盤面を4×4に変更及び数字の出現率を調整",
      "Abyssの数字の出現率を調整、難易度を大幅に上げました",
    ]
  },
  
  {
  version: "1.6.2",
    changes: [
      "Blinddモードの追加",
      "Splitモードの追加",
      "ランキングのUI改善",
    ]
  },
{
  version: "1.6.1",
    changes: [
      "ランキング表示中は後ろ画面固定（背景スクロール防止）",
      "モード別ランキングのウィンドサイズ固定＆見やすさ改善",
      "UI細かいバグ修正"
    ]
  },

  {
    version: "1.6.0",
    changes: [
      "設定にアップデート情報を追加",
      "アカウント情報を設定内に整理",
      "ランキング画面とモード選択画面を安定版UIに戻しました"
    ]
  },
  {
    version: "1.5.0",
    changes: [
      "Survivalモード追加",
      "Chaos Shiftモード追加",
      "タイマー表示を改善"
    ]
  },
  {
    version: "1.4.0",
    changes: [
      "ホーム画面追加",
      "ランキング画面追加",
      "カテゴリ式モード選択に変更"
    ]
  }
];

export function renderUpdateHistory(container) {
  if (!container) return;
  container.innerHTML = updateHistory.map(item => `
    <section class="update-card">
      <h3>v${item.version}</h3>
      <ul>${item.changes.map(change => `<li>${change}</li>`).join("")}</ul>
    </section>
  `).join("");
}

export function showUpdateHistoryModal() {
  let modal = document.getElementById("updateHistoryModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "updateHistoryModal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-content update-window">
        <button id="closeUpdateHistoryButton" class="close-btn">×</button>
        <h2>アップデート情報</h2>
        <div id="updateHistoryContent"></div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById("closeUpdateHistoryButton")?.addEventListener("click", () => {
      modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
    });
  }
  renderUpdateHistory(document.getElementById("updateHistoryContent"));
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}