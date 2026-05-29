export const modes = {
normal: {
  label: "Normal",
  detail: "基本ルール / 初心者向け",
  category: "basic",
  size: 4,
  tiles: [{ value: 2, rate: 0.90 }, { value: 4, rate: 0.10 }]
},

hard: {
  label: "Hard",
  detail: "8出現 / 初級上位",
  category: "basic",
  size: 4,
  tiles: [{ value: 2, rate: 0.72 }, { value: 4, rate: 0.23 }, { value: 8, rate: 0.05 }]
},

extreme: {
  label: "Extreme",
  detail: "4×4盤面 / 高圧モード",
  category: "basic",
  size: 4,
  tiles: [{ value: 2, rate: 0.40 }, { value: 4, rate: 0.35 }, { value: 8, rate: 0.25 }]
},

insane: {
  label: "Insane",
  detail: "5×5盤面 / 高数字増加",
  category: "hard",
  size: 5,
  tiles: [{ value: 2, rate: 0.42 }, { value: 4, rate: 0.34 }, { value: 8, rate: 0.18 }, { value: 16, rate: 0.06 }]
},

nightmare: {
  label: "Nightmare",
  detail: "32出現 / 崩れやすい",
  category: "hard",
  size: 5,
  tiles: [{ value: 2, rate: 0.30 }, { value: 4, rate: 0.34 }, { value: 8, rate: 0.22 }, { value: 16, rate: 0.10 }, { value: 32, rate: 0.04 }]
},

hell: {
  label: "Hell",
  detail: "高数字連発 / ミスが重い",
  category: "hard",
  size: 5,
  tiles: [{ value: 2, rate: 0.14 }, { value: 4, rate: 0.30 }, { value: 8, rate: 0.30 }, { value: 16, rate: 0.18 }, { value: 32, rate: 0.08 }]
},

chaos: {
  label: "Chaos",
  detail: "超ランダム / 運要素強め",
  category: "special",
  size: 5,
  tiles: [{ value: 2, rate: 0.03 }, { value: 4, rate: 0.20 }, { value: 8, rate: 0.28 }, { value: 16, rate: 0.24 }, { value: 32, rate: 0.16 }, { value: 64, rate: 0.07 }, { value: 128, rate: 0.02 }]
},

void: {
  label: "Void",
  detail: "整理崩壊 / 最難関",
  category: "special",
  size: 5,
  tiles: [{ value: 2, rate: 0.03 }, { value: 4, rate: 0.20 }, { value: 8, rate: 0.27 }, { value: 16, rate: 0.24 }, { value: 32, rate: 0.16 }, { value: 64, rate: 0.07 }, { value: 128, rate: 0.025 }, { value: 256, rate: 0.005 }]
},

abyss: {
  label: "Abyss",
  detail: "深淵崩壊 / 最狂",
  category: "special",
  size: 5,
  tiles: [{ value: 2, rate: 0.001 }, { value: 4, rate: 0.009 }, { value: 8, rate: 0.04 }, { value: 16, rate: 0.14 }, { value: 32, rate: 0.24 }, { value: 64, rate: 0.25 }, { value: 128, rate: 0.17 }, { value: 256, rate: 0.09 }, { value: 512, rate: 0.04 }, { value: 1024, rate: 0.02 }]
},
  timeAttack: {
    label: "Time Attack",
    detail: "60秒制限 / 急いで合体",
    category: "mode",
    size: 4,
    timeLimit: 60,
    tiles: [{ value: 2, rate: 0.75 }, { value: 4, rate: 0.20 }, { value: 8, rate: 0.05 }]
  },
  survival: {
    label: "Survival",
    detail: "合体で延命 / 生存勝負",
    category: "mode",
    size: 4,
    timeLimit: 20,
    timeBonus: 1,
    tiles: [{ value: 2, rate: 0.80 }, { value: 4, rate: 0.18 }, { value: 8, rate: 0.02 }]
  },
  chaosShift: {
    label: "Chaos Shift",
    detail: "確率変動 / 徐々に崩壊",
    category: "mode",
    size: 5,
    tiles: []
  },
maze: {
    label: "Maze",
    detail: "壁あり / 分断マップ",
    category: "mode",
    size: 5,
    blockedMin: 2,
    blockedMax: 4,
    tiles: [{ value: 2, rate: 0.60 }, { value: 4, rate: 0.30 }, { value: 8, rate: 0.10 }]
},
  blind: {
  label: "Blind",
  detail: "記憶勝負 / 一部非表示",
  category: "mode",
  size: 5,
  tiles: [{ value: 2, rate: 0.55 }, { value: 4, rate: 0.25 }, { value: 8, rate: 0.12 }, { value: 16, rate: 0.06 }, { value: 32, rate: 0.02 }]
},
  split: {
  label: "Split",
  detail: "分裂事故 / 予測不能",
  category: "mode",
  size: 5,
  splitRate: 0.25,
  tiles: [{ value: 2, rate: 0.55 },{ value: 4, rate: 0.25 },{ value: 8, rate: 0.12 },{ value: 16, rate: 0.06 },{ value: 32, rate: 0.02 }]
},
  shuffle: {
  label: "Shuffle",
  detail: "再配置 / 10手ごとに崩れる",
  category: "mode",
  size: 4,
  shuffleInterval: 10,
  tiles: [{ value: 2, rate: 0.55 },{ value: 4, rate: 0.25 },{ value: 8, rate: 0.12 },{ value: 16, rate: 0.06 },{ value: 32, rate: 0.02 }]
},
};