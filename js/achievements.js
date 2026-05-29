// ===== アチーブメント定義 =====
// check(stats) が true を返すと解放
// progress(stats) があるアチーブは進捗バーを表示
// stats の構造:
//   stats[modeKey] = { bestScore, playCount, maxTile, bestTime }

// ===== ヘルパー関数 =====
export function getTotalPlayCount(stats) {
  return Object.entries(stats).reduce((sum, [key, val]) => {
    if (key.startsWith("__")) return sum;
    return sum + (val?.playCount || 0);
  }, 0);
}

export function getBestScoreAcrossAllModes(stats) {
  return Object.entries(stats).reduce((max, [key, val]) => {
    if (key.startsWith("__")) return max;
    return Math.max(max, val?.bestScore || 0);
  }, 0);
}

export function getMaxTileAcrossAllModes(stats) {
  return Object.entries(stats).reduce((max, [key, val]) => {
    if (key.startsWith("__")) return max;
    return Math.max(max, val?.maxTile || 0);
  }, 0);
}

export function getAllModesPlayed(stats) {
  const allModes = [
    "normal","hard","extreme","insane","nightmare","hell",
    "chaos","void","abyss","timeAttack","survival","chaosShift",
    "maze","blind","split","shuffle"
  ];
  return allModes.every(m => (stats[m]?.playCount || 0) > 0);
}

// ===== アチーブメント一覧 =====
export const achievements = [

  // ===== 🎮 プレイ回数 =====
  {
    id: "play_1",
    label: "はじめの一歩",
    desc: "初めてプレイする",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 1,
  },
  {
    id: "play_10",
    label: "常連プレイヤー",
    desc: "累計10回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 10,
    progress: (stats) => ({ current: Math.min(getTotalPlayCount(stats), 10), max: 10 }),
  },
  {
    id: "play_50",
    label: "ベテラン",
    desc: "累計50回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 50,
    progress: (stats) => ({ current: Math.min(getTotalPlayCount(stats), 50), max: 50 }),
  },
  {
    id: "play_100",
    label: "廃人",
    desc: "累計100回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 100,
    progress: (stats) => ({ current: Math.min(getTotalPlayCount(stats), 100), max: 100 }),
  },
  {
    id: "play_500",
    label: "伝説",
    desc: "累計500回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 500,
    progress: (stats) => ({ current: Math.min(getTotalPlayCount(stats), 500), max: 500 }),
  },
  {
    id: "play_1000",
    label: "神域",
    desc: "累計1000回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 1000,
    progress: (stats) => ({ current: Math.min(getTotalPlayCount(stats), 1000), max: 1000 }),
  },
  {
    id: "play_2000",
    label: "執念",
    desc: "累計2000回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 2000,
    progress: (stats) => ({ current: Math.min(getTotalPlayCount(stats), 2000), max: 2000 }),
  },
  {
    id: "play_5000",
    label: "狂信者",
    desc: "累計5000回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => getTotalPlayCount(stats) >= 5000,
    progress: (stats) => ({ current: Math.min(getTotalPlayCount(stats), 5000), max: 5000 }),
  },

  {
    id: "play_5modes",
    label: "モード探検家",
    desc: "5種類以上のモードをプレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => Object.keys(stats).filter(k => !k.startsWith("__") && (stats[k]?.playCount || 0) > 0).length >= 5,
    progress: (stats) => ({ current: Math.min(Object.keys(stats).filter(k => !k.startsWith("__") && (stats[k]?.playCount || 0) > 0).length, 5), max: 5 }),
  },
  {
    id: "play_10modes",
    label: "10モード挑戦",
    desc: "10種類以上のモードをプレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => Object.keys(stats).filter(k => !k.startsWith("__") && (stats[k]?.playCount || 0) > 0).length >= 10,
    progress: (stats) => ({ current: Math.min(Object.keys(stats).filter(k => !k.startsWith("__") && (stats[k]?.playCount || 0) > 0).length, 10), max: 10 }),
  },
  {
    id: "normal_play_100",
    label: "Normal愛好家（上級）",
    desc: "Normalを100回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => (stats.normal?.playCount || 0) >= 100,
    progress: (stats) => ({ current: Math.min(stats.normal?.playCount || 0, 100), max: 100 }),
  },
  {
    id: "abyss_play_30",
    label: "深淵狂",
    desc: "Abyssを30回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => (stats.abyss?.playCount || 0) >= 30,
    progress: (stats) => ({ current: Math.min(stats.abyss?.playCount || 0, 30), max: 30 }),
  },
  {
    id: "survival_play_50",
    label: "Survival中毒",
    desc: "Survivalを50回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => (stats.survival?.playCount || 0) >= 50,
    progress: (stats) => ({ current: Math.min(stats.survival?.playCount || 0, 50), max: 50 }),
  },
  {
    id: "timeattack_play_20",
    label: "TimeAttack常連",
    desc: "TimeAttackを20回プレイ",
    icon: "🎮",
    category: "play",
    check: (stats) => (stats.timeAttack?.playCount || 0) >= 20,
    progress: (stats) => ({ current: Math.min(stats.timeAttack?.playCount || 0, 20), max: 20 }),
  },

  // ===== 🏆 スコア =====
  {
    id: "score_first",
    label: "スコアデビュー",
    desc: "初めてスコアを記録する",
    icon: "🏆",
    category: "score",
    check: (stats) => getBestScoreAcrossAllModes(stats) >= 1,
  },
  {
    id: "score_10000",
    label: "1万点の壁",
    desc: "任意のモードで10,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => getBestScoreAcrossAllModes(stats) >= 10000,
    progress: (stats) => ({ current: Math.min(getBestScoreAcrossAllModes(stats), 10000), max: 10000 }),
  },
  {
    id: "score_50000",
    label: "5万点の壁",
    desc: "任意のモードで50,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => getBestScoreAcrossAllModes(stats) >= 50000,
    progress: (stats) => ({ current: Math.min(getBestScoreAcrossAllModes(stats), 50000), max: 50000 }),
  },
  {
    id: "score_100000",
    label: "10万点プレイヤー",
    desc: "任意のモードで100,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => getBestScoreAcrossAllModes(stats) >= 100000,
    progress: (stats) => ({ current: Math.min(getBestScoreAcrossAllModes(stats), 100000), max: 100000 }),
  },
  {
    id: "score_200000",
    label: "20万点プレイヤー",
    desc: "任意のモードで200,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => getBestScoreAcrossAllModes(stats) >= 200000,
    progress: (stats) => ({ current: Math.min(getBestScoreAcrossAllModes(stats), 200000), max: 200000 }),
  },
  {
    id: "score_normal_50000",
    label: "Normalマスター",
    desc: "Normalで50,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.normal?.bestScore || 0) >= 50000,
    progress: (stats) => ({ current: Math.min(stats.normal?.bestScore || 0, 50000), max: 50000 }),
  },
  {
    id: "score_hard_20000",
    label: "Hard上級者",
    desc: "Hardで20,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.hard?.bestScore || 0) >= 20000,
    progress: (stats) => ({ current: Math.min(stats.hard?.bestScore || 0, 20000), max: 20000 }),
  },
  {
    id: "score_extreme_30000",
    label: "Extreme上級者",
    desc: "Extremeで30,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.extreme?.bestScore || 0) >= 30000,
    progress: (stats) => ({ current: Math.min(stats.extreme?.bestScore || 0, 30000), max: 30000 }),
  },
  {
    id: "score_normal_10000",
    label: "Normal上級者",
    desc: "Normalで10,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.normal?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.normal?.bestScore || 0, 10000), max: 10000 }),
  },

  {
    id: "score_normal_1000",
    label: "Normal入門",
    desc: "Normalで1,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.normal?.bestScore || 0) >= 1000,
    progress: (stats) => ({ current: Math.min(stats.normal?.bestScore || 0, 1000), max: 1000 }),
  },
  {
    id: "score_normal_5000",
    label: "Normal中級",
    desc: "Normalで5,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.normal?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.normal?.bestScore || 0, 5000), max: 5000 }),
  },
  {
    id: "score_hard_1000",
    label: "Hard入門",
    desc: "Hardで1,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.hard?.bestScore || 0) >= 1000,
    progress: (stats) => ({ current: Math.min(stats.hard?.bestScore || 0, 1000), max: 1000 }),
  },
  {
    id: "score_hard_5000",
    label: "Hard中級",
    desc: "Hardで5,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.hard?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.hard?.bestScore || 0, 5000), max: 5000 }),
  },
  {
    id: "score_extreme_1000",
    label: "Extreme入門",
    desc: "Extremeで1,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.extreme?.bestScore || 0) >= 1000,
    progress: (stats) => ({ current: Math.min(stats.extreme?.bestScore || 0, 1000), max: 1000 }),
  },
  {
    id: "score_extreme_10000",
    label: "Extreme中級",
    desc: "Extremeで10,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.extreme?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.extreme?.bestScore || 0, 10000), max: 10000 }),
  },
  {
    id: "score_all_modes",
    label: "全モード参加",
    desc: "全モードでベストスコアが1点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => {
      const allModes = ["normal","hard","extreme","insane","nightmare","hell","chaos","void","abyss","timeAttack","survival","chaosShift","maze","blind","split","shuffle"];
      return allModes.every(m => (stats[m]?.bestScore || 0) >= 1);
    },
  },
  {
    id: "score_mid_triple",
    label: "中級制覇",
    desc: "Insane・Hard・Extreme全て5,000点以上",
    icon: "🏆",
    category: "score",
    check: (stats) => (stats.insane?.bestScore || 0) >= 5000 && (stats.hard?.bestScore || 0) >= 5000 && (stats.extreme?.bestScore || 0) >= 5000,
  },

  // ===== 🎯 タイル =====
  {
    id: "tile_128",
    label: "128への道",
    desc: "128タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 128,
  },
  {
    id: "tile_256",
    label: "256への道",
    desc: "256タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 256,
  },
  {
    id: "tile_512",
    label: "512への道",
    desc: "512タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 512,
  },
  {
    id: "tile_1024",
    label: "1024への道",
    desc: "1024タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 1024,
  },
  {
    id: "tile_2048",
    label: "2048達成",
    desc: "2048タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 2048,
  },
  {
    id: "tile_4096",
    label: "4096の壁",
    desc: "4096タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 4096,
  },
  {
    id: "tile_8192",
    label: "8192の頂点",
    desc: "8192タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 8192,
  },
  {
    id: "tile_16384",
    label: "16384の神域",
    desc: "16384タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 16384,
  },
  {
    id: "tile_32768",
    label: "32768の伝説",
    desc: "32768タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 32768,
  },
  {
    id: "tile_65536",
    label: "65536の怪物",
    desc: "65536タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 65536,
  },
  {
    id: "tile_131072",
    label: "131072の狂気",
    desc: "131072タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 131072,
  },
  {
    id: "tile_262144",
    label: "262144の超越",
    desc: "262144タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 262144,
  },
  {
    id: "tile_524288",
    label: "524288の神",
    desc: "524288タイルを作る",
    icon: "🎯",
    category: "tile",
    check: (stats) => getMaxTileAcrossAllModes(stats) >= 524288,
  },

  // ===== 🗺️ モード制覇 =====
  {
    id: "mode_basic",
    label: "初級卒業",
    desc: "Normal・Hard・Extremeを全てプレイ",
    icon: "🗺️",
    category: "mode",
    check: (stats) => ["normal","hard","extreme"].every(m => (stats[m]?.playCount || 0) > 0),
  },
  {
    id: "mode_hard",
    label: "中級挑戦者",
    desc: "Insane・Nightmare・Hellを全てプレイ",
    icon: "🗺️",
    category: "mode",
    check: (stats) => ["insane","nightmare","hell"].every(m => (stats[m]?.playCount || 0) > 0),
  },
  {
    id: "mode_special",
    label: "上級者",
    desc: "Chaos・Void・Abyssを全てプレイ",
    icon: "🗺️",
    category: "mode",
    check: (stats) => ["chaos","void","abyss"].every(m => (stats[m]?.playCount || 0) > 0),
  },
  {
    id: "mode_extra",
    label: "特殊モード制覇",
    desc: "全特殊モードをプレイ",
    icon: "🗺️",
    category: "mode",
    check: (stats) => ["timeAttack","survival","chaosShift","maze","blind","split","shuffle"].every(m => (stats[m]?.playCount || 0) > 0),
  },
  {
    id: "mode_all",
    label: "全モード制覇",
    desc: "全てのモードをプレイ",
    icon: "🗺️",
    category: "mode",
    check: (stats) => getAllModesPlayed(stats),
  },

  // ===== ⏱️ タイム系 =====
  {
    id: "timeattack_2000",
    label: "タイムアタッカー",
    desc: "TimeAttackで2,000点以上",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.timeAttack?.bestScore || 0) >= 2000,
    progress: (stats) => ({ current: Math.min(stats.timeAttack?.bestScore || 0, 2000), max: 2000 }),
  },
  {
    id: "timeattack_5000",
    label: "タイムマスター",
    desc: "TimeAttackで5,000点以上",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.timeAttack?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.timeAttack?.bestScore || 0, 5000), max: 5000 }),
  },
  {
    id: "timeattack_10000",
    label: "タイム神",
    desc: "TimeAttackで10,000点以上",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.timeAttack?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.timeAttack?.bestScore || 0, 10000), max: 10000 }),
  },
  {
    id: "survival_60",
    label: "サバイバー",
    desc: "Survivalで60秒以上生存",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.survival?.bestTime || 0) >= 60,
    progress: (stats) => ({ current: Math.min(stats.survival?.bestTime || 0, 60), max: 60 }),
  },
  {
    id: "survival_120",
    label: "不死身",
    desc: "Survivalで120秒以上生存",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.survival?.bestTime || 0) >= 120,
    progress: (stats) => ({ current: Math.min(stats.survival?.bestTime || 0, 120), max: 120 }),
  },
  {
    id: "survival_180",
    label: "永遠のサバイバー",
    desc: "Survivalで180秒以上生存",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.survival?.bestTime || 0) >= 180,
    progress: (stats) => ({ current: Math.min(stats.survival?.bestTime || 0, 180), max: 180 }),
  },
  {
    id: "survival_300",
    label: "不滅",
    desc: "Survivalで300秒以上生存",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.survival?.bestTime || 0) >= 300,
    progress: (stats) => ({ current: Math.min(stats.survival?.bestTime || 0, 300), max: 300 }),
  },
  {
    id: "survival_play_20",
    label: "生存の達人",
    desc: "Survivalを20回プレイ",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.survival?.playCount || 0) >= 20,
    progress: (stats) => ({ current: Math.min(stats.survival?.playCount || 0, 20), max: 20 }),
  },

  {
    id: "timeattack_500",
    label: "TimeAttack入門",
    desc: "TimeAttackで500点以上",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.timeAttack?.bestScore || 0) >= 500,
    progress: (stats) => ({ current: Math.min(stats.timeAttack?.bestScore || 0, 500), max: 500 }),
  },
  {
    id: "timeattack_1000",
    label: "TimeAttack中級",
    desc: "TimeAttackで1,000点以上",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.timeAttack?.bestScore || 0) >= 1000,
    progress: (stats) => ({ current: Math.min(stats.timeAttack?.bestScore || 0, 1000), max: 1000 }),
  },
  {
    id: "survival_30",
    label: "生き残れ",
    desc: "Survivalで30秒以上生存",
    icon: "⚡",
    category: "timemode",
    check: (stats) => (stats.survival?.bestTime || 0) >= 30,
    progress: (stats) => ({ current: Math.min(stats.survival?.bestTime || 0, 30), max: 30 }),
  },
  // ===== 💀 高難易度 =====
  {
    id: "insane_15000",
    label: "狂気の挑戦者",
    desc: "Insaneで15,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.insane?.bestScore || 0) >= 15000,
    progress: (stats) => ({ current: Math.min(stats.insane?.bestScore || 0, 15000), max: 15000 }),
  },
  {
    id: "insane_50000",
    label: "狂気の神",
    desc: "Insaneで50,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.insane?.bestScore || 0) >= 50000,
    progress: (stats) => ({ current: Math.min(stats.insane?.bestScore || 0, 50000), max: 50000 }),
  },
  {
    id: "nightmare_20000",
    label: "悪夢の住人",
    desc: "Nightmareで20,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.nightmare?.bestScore || 0) >= 20000,
    progress: (stats) => ({ current: Math.min(stats.nightmare?.bestScore || 0, 20000), max: 20000 }),
  },
  {
    id: "nightmare_50000",
    label: "悪夢の神",
    desc: "Nightmareで50,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.nightmare?.bestScore || 0) >= 50000,
    progress: (stats) => ({ current: Math.min(stats.nightmare?.bestScore || 0, 50000), max: 50000 }),
  },
  {
    id: "hell_15000",
    label: "地獄の住人",
    desc: "Hellで15,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.hell?.bestScore || 0) >= 15000,
    progress: (stats) => ({ current: Math.min(stats.hell?.bestScore || 0, 15000), max: 15000 }),
  },
  {
    id: "hell_50000",
    label: "地獄の神",
    desc: "Hellで50,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.hell?.bestScore || 0) >= 50000,
    progress: (stats) => ({ current: Math.min(stats.hell?.bestScore || 0, 50000), max: 50000 }),
  },

  {
    id: "insane_3000",
    label: "Insane入門",
    desc: "Insaneで3,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.insane?.bestScore || 0) >= 3000,
    progress: (stats) => ({ current: Math.min(stats.insane?.bestScore || 0, 3000), max: 3000 }),
  },
  {
    id: "insane_8000",
    label: "Insane中級",
    desc: "Insaneで8,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.insane?.bestScore || 0) >= 8000,
    progress: (stats) => ({ current: Math.min(stats.insane?.bestScore || 0, 8000), max: 8000 }),
  },
     {
    id: "insane_30000",
    label: "Insane上級",
    desc: "Insaneで30,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.insane?.bestScore || 0) >= 30000,
    progress: (stats) => ({ current: Math.min(stats.insane?.bestScore || 0, 30000), max: 30000 }),
  },
  {
    id: "nightmare_5000",
    label: "Nightmare入門",
    desc: "Nightmareで5,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.nightmare?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.nightmare?.bestScore || 0, 5000), max: 5000 }),
  },
  {
    id: "nightmare_10000",
    label: "Nightmare中級",
    desc: "Nightmareで10,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.nightmare?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.nightmare?.bestScore || 0, 10000), max: 10000 }),
  },
    {
    id: "nightmare_30000",
    label: "Nightmare上級",
    desc: "Nightmareで30,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.nightmare?.bestScore || 0) >= 30000,
    progress: (stats) => ({ current: Math.min(stats.nightmare?.bestScore || 0, 30000), max: 30000 }),
  },
  {
    id: "hell_3000",
    label: "Hell入門",
    desc: "Hellで3,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.hell?.bestScore || 0) >= 3000,
    progress: (stats) => ({ current: Math.min(stats.hell?.bestScore || 0, 3000), max: 3000 }),
  },
  {
    id: "hell_8000",
    label: "Hell中級",
    desc: "Hellで8,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.hell?.bestScore || 0) >= 8000,
    progress: (stats) => ({ current: Math.min(stats.hell?.bestScore || 0, 8000), max: 8000 }),
  },
  {
    id: "hell_30000",
    label: "Hell上級",
    desc: "Hellで30,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.hell?.bestScore || 0) >= 30000,
    progress: (stats) => ({ current: Math.min(stats.hell?.bestScore || 0, 30000), max: 30000 }),
  },
  {
    id: "hardmode_triple",
    label: "高難易度三冠",
    desc: "Insane・Nightmare・Hell全て10,000点以上",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.insane?.bestScore || 0) >= 10000 && (stats.nightmare?.bestScore || 0) >= 10000 && (stats.hell?.bestScore || 0) >= 10000,
  },
  {
    id: "insane_play_10",
    label: "狂気の常連",
    desc: "Insaneを10回プレイ",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.insane?.playCount || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.insane?.playCount || 0, 10), max: 10 }),
  },
  {
    id: "nightmare_play_10",
    label: "悪夢の常連",
    desc: "Nightmareを10回プレイ",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.nightmare?.playCount || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.nightmare?.playCount || 0, 10), max: 10 }),
  },
  {
    id: "hell_play_10",
    label: "地獄の常連",
    desc: "Hellを10回プレイ",
    icon: "⚡",
    category: "hardmode",
    check: (stats) => (stats.hell?.playCount || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.hell?.playCount || 0, 10), max: 10 }),
  },

  // ===== 🌀 上級モード =====
  {
    id: "chaos_10000",
    label: "カオスの申し子",
    desc: "Chaosで10,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.chaos?.bestScore || 0, 10000), max: 10000 }),
  },
  {
    id: "chaos_30000",
    label: "カオスの支配者",
    desc: "Chaosで30,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 30000,
    progress: (stats) => ({ current: Math.min(stats.chaos?.bestScore || 0, 30000), max: 30000 }),
  },
  {
    id: "chaos_50000",
    label: "カオスの神",
    desc: "Chaosで50,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 50000,
    progress: (stats) => ({ current: Math.min(stats.chaos?.bestScore || 0, 50000), max: 50000 }),
  },
  {
    id: "chaos_100000",
    label: "カオスの覇者",
    desc: "Chaosで100,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 100000,
    progress: (stats) => ({ current: Math.min(stats.chaos?.bestScore || 0, 100000), max: 100000 }),
  },
  {
    id: "void_20000",
    label: "虚無の探求者",
    desc: "Voidで20,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.void?.bestScore || 0) >= 20000,
    progress: (stats) => ({ current: Math.min(stats.void?.bestScore || 0, 20000), max: 20000 }),
  },
  {
    id: "void_50000",
    label: "虚無の神",
    desc: "Voidで50,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.void?.bestScore || 0) >= 50000,
    progress: (stats) => ({ current: Math.min(stats.void?.bestScore || 0, 50000), max: 50000 }),
  },
  {
    id: "void_100000",
    label: "虚無の覇者",
    desc: "Voidで100,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.void?.bestScore || 0) >= 100000,
    progress: (stats) => ({ current: Math.min(stats.void?.bestScore || 0, 100000), max: 100000 }),
  },
  {
    id: "abyss_5000",
    label: "深淵の挑戦者",
    desc: "Abyssで5,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.abyss?.bestScore || 0, 5000), max: 5000 }),
  },
  {
    id: "abyss_20000",
    label: "深淵の覇者",
    desc: "Abyssで20,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.bestScore || 0) >= 20000,
    progress: (stats) => ({ current: Math.min(stats.abyss?.bestScore || 0, 20000), max: 20000 }),
  },
  {
    id: "abyss_50000",
    label: "深淵の神",
    desc: "Abyssで50,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.bestScore || 0) >= 50000,
    progress: (stats) => ({ current: Math.min(stats.abyss?.bestScore || 0, 50000), max: 50000 }),
  },
  {
    id: "abyss_100000",
    label: "深淵の支配者",
    desc: "Abyssで100,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.bestScore || 0) >= 100000,
    progress: (stats) => ({ current: Math.min(stats.abyss?.bestScore || 0, 100000), max: 100000 }),
  },
  {
    id: "abyss_play_10",
    label: "深淵の常連",
    desc: "Abyssを10回プレイ",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.playCount || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.abyss?.playCount || 0, 10), max: 10 }),
  },

  {
    id: "chaos_2000",
    label: "Chaos入門",
    desc: "Chaosで2,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 2000,
    progress: (stats) => ({ current: Math.min(stats.chaos?.bestScore || 0, 2000), max: 2000 }),
  },
  {
    id: "chaos_5000",
    label: "Chaos中級",
    desc: "Chaosで5,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.chaos?.bestScore || 0, 5000), max: 5000 }),
  },
    {
    id: "chaos_20000",
    label: "Chaos上級",
    desc: "Chaosで20,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 20000,
    progress: (stats) => ({ current: Math.min(stats.chaos?.bestScore || 0, 20000), max: 20000 }),
  },
  {
    id: "void_3000",
    label: "Void入門",
    desc: "Voidで3,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.void?.bestScore || 0) >= 3000,
    progress: (stats) => ({ current: Math.min(stats.void?.bestScore || 0, 3000), max: 3000 }),
  },
  {
    id: "void_8000",
    label: "Void中級",
    desc: "Voidで8,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.void?.bestScore || 0) >= 8000,
    progress: (stats) => ({ current: Math.min(stats.void?.bestScore || 0, 8000), max: 8000 }),
  },
    {
    id: "void_15000",
    label: "Void上級",
    desc: "Voidで15,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.void?.bestScore || 0) >= 15000,
    progress: (stats) => ({ current: Math.min(stats.void?.bestScore || 0, 15000), max: 15000 }),
  },
  {
    id: "abyss_1000",
    label: "Abyss入門",
    desc: "Abyssで1,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.bestScore || 0) >= 1000,
    progress: (stats) => ({ current: Math.min(stats.abyss?.bestScore || 0, 1000), max: 1000 }),
  },
  {
    id: "abyss_3000",
    label: "Abyss中級",
    desc: "Abyssで3,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.bestScore || 0) >= 3000,
    progress: (stats) => ({ current: Math.min(stats.abyss?.bestScore || 0, 3000), max: 3000 }),
  },
  {
    id: "abyss_10000",
    label: "Abyss上級",
    desc: "Abyssで10,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.abyss?.bestScore || 0, 10000), max: 10000 }),
  },
  {
    id: "chaosmode_triple",
    label: "上級三冠",
    desc: "Chaos・Void・Abyss全て10,000点以上",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.bestScore || 0) >= 10000 && (stats.void?.bestScore || 0) >= 10000 && (stats.abyss?.bestScore || 0) >= 10000,
  },
  {
    id: "chaos_play_10",
    label: "Chaos常連",
    desc: "Chaosを10回プレイ",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.chaos?.playCount || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.chaos?.playCount || 0, 10), max: 10 }),
  },
  {
    id: "void_play_10",
    label: "Void常連",
    desc: "Voidを10回プレイ",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.void?.playCount || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.void?.playCount || 0, 10), max: 10 }),
  },
  {
    id: "abyss_play_10",
    label: "Abyss常連",
    desc: "Abyssを10回プレイ",
    icon: "⚡",
    category: "chaosmode",
    check: (stats) => (stats.abyss?.playCount || 0) >= 10,
    progress: (stats) => ({ current: Math.min(stats.abyss?.playCount || 0, 10), max: 10 }),
  },

  // ===== 🔀 特殊ルール =====
  {
    id: "maze_3000",
    label: "迷宮の達人",
    desc: "Mazeで3,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.maze?.bestScore || 0) >= 3000,
    progress: (stats) => ({ current: Math.min(stats.maze?.bestScore || 0, 3000), max: 3000 }),
  },
  {
    id: "maze_10000",
    label: "迷宮の支配者",
    desc: "Mazeで10,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.maze?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.maze?.bestScore || 0, 10000), max: 10000 }),
  },
  {
    id: "maze_30000",
    label: "迷宮の神",
    desc: "Mazeで30,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.maze?.bestScore || 0) >= 30000,
    progress: (stats) => ({ current: Math.min(stats.maze?.bestScore || 0, 30000), max: 30000 }),
  },
  {
    id: "blind_2000",
    label: "記憶力勝負",
    desc: "Blindで2,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.blind?.bestScore || 0) >= 2000,
    progress: (stats) => ({ current: Math.min(stats.blind?.bestScore || 0, 2000), max: 2000 }),
  },
  {
    id: "blind_8000",
    label: "記憶の天才",
    desc: "Blindで8,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.blind?.bestScore || 0) >= 8000,
    progress: (stats) => ({ current: Math.min(stats.blind?.bestScore || 0, 8000), max: 8000 }),
  },
  {
    id: "blind_20000",
    label: "記憶の神",
    desc: "Blindで20,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.blind?.bestScore || 0) >= 20000,
    progress: (stats) => ({ current: Math.min(stats.blind?.bestScore || 0, 20000), max: 20000 }),
  },
  {
    id: "split_5000",
    label: "分裂の達人",
    desc: "Splitで5,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.split?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.split?.bestScore || 0, 5000), max: 5000 }),
  },
  {
    id: "split_15000",
    label: "分裂の神",
    desc: "Splitで15,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.split?.bestScore || 0) >= 15000,
    progress: (stats) => ({ current: Math.min(stats.split?.bestScore || 0, 15000), max: 15000 }),
  },
  {
    id: "shuffle_5000",
    label: "シャッフル耐性",
    desc: "Shuffleで5,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.shuffle?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.shuffle?.bestScore || 0, 5000), max: 5000 }),
  },
  {
    id: "shuffle_15000",
    label: "シャッフルの神",
    desc: "Shuffleで15,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.shuffle?.bestScore || 0) >= 15000,
    progress: (stats) => ({ current: Math.min(stats.shuffle?.bestScore || 0, 15000), max: 15000 }),
  },
  {
    id: "chaosshift_10000",
    label: "混沌の支配者",
    desc: "ChaosShiftで10,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.chaosShift?.bestScore || 0) >= 10000,
    progress: (stats) => ({ current: Math.min(stats.chaosShift?.bestScore || 0, 10000), max: 10000 }),
  },
  {
    id: "chaosshift_30000",
    label: "混沌の神",
    desc: "ChaosShiftで30,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.chaosShift?.bestScore || 0) >= 30000,
    progress: (stats) => ({ current: Math.min(stats.chaosShift?.bestScore || 0, 30000), max: 30000 }),
  },
  {
    id: "normal_play_50",
    label: "Normal愛好家",
    desc: "Normalを50回プレイ",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.normal?.playCount || 0) >= 50,
    progress: (stats) => ({ current: Math.min(stats.normal?.playCount || 0, 50), max: 50 }),
  },

  {
    id: "maze_500",
    label: "Maze入門",
    desc: "Mazeで500点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.maze?.bestScore || 0) >= 500,
    progress: (stats) => ({ current: Math.min(stats.maze?.bestScore || 0, 500), max: 500 }),
  },
  {
    id: "maze_1500",
    label: "Maze中級",
    desc: "Mazeで1,500点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.maze?.bestScore || 0) >= 1500,
    progress: (stats) => ({ current: Math.min(stats.maze?.bestScore || 0, 1500), max: 1500 }),
  },
  {
    id: "blind_500",
    label: "Blind入門",
    desc: "Blindで500点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.blind?.bestScore || 0) >= 500,
    progress: (stats) => ({ current: Math.min(stats.blind?.bestScore || 0, 500), max: 500 }),
  },
  {
    id: "blind_1000",
    label: "Blind中級",
    desc: "Blindで1,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.blind?.bestScore || 0) >= 1000,
    progress: (stats) => ({ current: Math.min(stats.blind?.bestScore || 0, 1000), max: 1000 }),
  },
  {
    id: "split_500",
    label: "Split入門",
    desc: "Splitで500点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.split?.bestScore || 0) >= 500,
    progress: (stats) => ({ current: Math.min(stats.split?.bestScore || 0, 500), max: 500 }),
  },
  {
    id: "split_2000",
    label: "Split中級",
    desc: "Splitで2,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.split?.bestScore || 0) >= 2000,
    progress: (stats) => ({ current: Math.min(stats.split?.bestScore || 0, 2000), max: 2000 }),
  },
  {
    id: "shuffle_500",
    label: "Shuffle入門",
    desc: "Shuffleで500点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.shuffle?.bestScore || 0) >= 500,
    progress: (stats) => ({ current: Math.min(stats.shuffle?.bestScore || 0, 500), max: 500 }),
  },
  {
    id: "shuffle_2000",
    label: "Shuffle中級",
    desc: "Shuffleで2,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.shuffle?.bestScore || 0) >= 2000,
    progress: (stats) => ({ current: Math.min(stats.shuffle?.bestScore || 0, 2000), max: 2000 }),
  },
  {
    id: "chaosshift_1000",
    label: "ChaosShift入門",
    desc: "ChaosShiftで1,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.chaosShift?.bestScore || 0) >= 1000,
    progress: (stats) => ({ current: Math.min(stats.chaosShift?.bestScore || 0, 1000), max: 1000 }),
  },
  {
    id: "chaosshift_5000",
    label: "ChaosShift中級",
    desc: "ChaosShiftで5,000点以上",
    icon: "⚡",
    category: "extramode",
    check: (stats) => (stats.chaosShift?.bestScore || 0) >= 5000,
    progress: (stats) => ({ current: Math.min(stats.chaosShift?.bestScore || 0, 5000), max: 5000 }),
  },
  // ===== 🌟 隠しアチーブ =====
  {
    id: "hidden_zero",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "虚無",
    hiddenDesc: "スコア0でゲームオーバー",
    check: (stats) => (stats.__zeroScoreGameOver || 0) >= 1,
  },
  {
    id: "hidden_night",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "夜行性",
    hiddenDesc: "深夜0時〜5時にプレイ",
    check: (stats) => (stats.__nightPlay || false),
  },
  {
    id: "hidden_daily10",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "1日10回",
    hiddenDesc: "1日に10回プレイ",
    check: (stats) => (stats.__dailyMax || 0) >= 10,
  },
  {
    id: "hidden_earlybird",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "早起き",
    hiddenDesc: "朝5時〜7時にプレイ",
    check: (stats) => (stats.__earlyBirdPlay || false),
  },
  {
    id: "hidden_weekend",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "週末戦士",
    hiddenDesc: "土日にプレイ",
    check: (stats) => (stats.__weekendPlay || false),
  },
  {
    id: "hidden_comeback",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "諦めない心",
    hiddenDesc: "同じモードで5回連続ゲームオーバー後も続ける",
    check: (stats) => (stats.__consecutiveLoss || 0) >= 5,
  },

  {
    id: "hidden_lunchtime",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "お昼休み",
    hiddenDesc: "12時〜13時にプレイ",
    check: (stats) => (stats.__lunchPlay || false),
  },
  {
    id: "hidden_christmas",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "メリークリスマス",
    hiddenDesc: "12月25日にプレイ",
    check: (stats) => (stats.__christmasPlay || false),
  },
  {
    id: "hidden_newyear",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "あけましておめでとう",
    hiddenDesc: "1月1日にプレイ",
    check: (stats) => (stats.__newYearPlay || false),
  },
  {
    id: "hidden_halloween",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "トリックオアトリート",
    hiddenDesc: "10月31日にプレイ",
    check: (stats) => (stats.__halloweenPlay || false),
  },
  {
    id: "hidden_valentine",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "バレンタイン",
    hiddenDesc: "2月14日にプレイ",
    check: (stats) => (stats.__valentinePlay || false),
  },
  {
    id: "hidden_3days",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "連休戦士",
    hiddenDesc: "3日連続でプレイ",
    check: (stats) => (stats.__consecutiveDays || 0) >= 3,
  },
  {
    id: "hidden_monthend",
    label: "？？？",
    desc: "？？？",
    icon: "🌟",
    category: "hidden",
    hidden: true,
    hiddenLabel: "月末プレイヤー",
    hiddenDesc: "月の最終日にプレイ",
    check: (stats) => (stats.__monthEndPlay || false),
  },
];

// カテゴリ表示名
export const categoryLabels = {
  play:      "🎮 プレイ回数",
  score:     "🏆 スコア",
  tile:      "🎯 タイル",
  mode:      "🗺️ モード制覇",
  timemode:  "⏱️ タイム系",
  hardmode:  "💀 高難易度",
  chaosmode: "🌀 上級モード",
  extramode: "🔀 特殊ルール",
  hidden:    "🌟 隠しアチーブ",
};

export function updateLocalStats(state) {
  const stats = JSON.parse(localStorage.getItem("stats2048") || "{}");
  if (!state?.modeKey) return stats;

  const key = state.modeKey;
  if (!stats[key]) stats[key] = { bestScore: 0, playCount: 0, maxTile: 0, bestTime: null };

  const maxTile = Math.max(0, ...state.board.flat());
  const playTime = Math.floor((Date.now() - state.startedAt) / 1000);

  stats[key].playCount = Number(stats[key].playCount || 0) + 1;
  stats[key].bestScore = Math.max(Number(stats[key].bestScore || 0), Number(state.score || 0));
  stats[key].maxTile = Math.max(Number(stats[key].maxTile || 0), maxTile);

  if (state.modeKey === "timeAttack") {
    if (!stats[key].bestTime || playTime < stats[key].bestTime) stats[key].bestTime = playTime;
  }

  stats.__totalPlay = getTotalPlayCount(stats);
  stats.__bestScore = getBestScoreAcrossAllModes(stats);
  stats.__maxTile = getMaxTileAcrossAllModes(stats);

  const history = JSON.parse(localStorage.getItem("history2048") || "[]");
  history.unshift({
    mode: state.modeKey,
    modeName: state.modeKey,
    score: state.score,
    maxTile,
    moveCount: state.moveCount,
    createdAt: new Date().toLocaleString("ja-JP" ,{
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }),  
  });
  localStorage.setItem("history2048", JSON.stringify(history.slice(0, 50)));
  localStorage.setItem("stats2048", JSON.stringify(stats));
  return stats;
}

export function checkAchievements(stats) {
  const unlocked = JSON.parse(localStorage.getItem("achievements2048") || "[]");
  const newly = [];
  for (const item of achievements) {
    if (unlocked.includes(item.id)) continue;
    try {
      if (item.check?.(stats)) {
        unlocked.push(item.id);
        newly.push({ ...item, title: item.label });
      }
    } catch (e) {
      console.warn("アチーブメント判定エラー", item.id, e);
    }
  }
  localStorage.setItem("achievements2048", JSON.stringify(unlocked));
  return newly;
}

export function renderAchievements(container) {
  if (!container) return;

  const stats = JSON.parse(localStorage.getItem("stats2048") || "{}");
  const unlocked = new Set(
    JSON.parse(localStorage.getItem("achievements2048") || "[]")
  );

  const labels = {
    play: "🎮 プレイ回数",
    score: "🏆 スコア",
    tile: "🎯 タイル",
    mode: "🗺️ モード制覇",
    timemode: "⚡ タイム系",
    hardmode: "💀 高難易度",
    chaosmode: "🌀 上級モード",
    specialmode: "✨ 特殊モード",
    secret: "🔒 シークレット"
  };

  const grouped = {};

  achievements.forEach(item => {
    const category = item.category || "other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  });

  container.innerHTML = Object.entries(grouped).map(([category, items]) => {
    const doneCount = items.filter(item => {
      try {
        return unlocked.has(item.id) || item.check?.(stats);
      } catch {
        return false;
      }
    }).length;

    return `
      <div class="achievement-category-block">
        <button class="achievement-category-toggle" type="button">
          <span>${categoryLabels[category] || category}</span>
          <span class="achievement-count">${doneCount}/${items.length}</span>
        </button>

        <div class="achievement-category-content hidden">
          ${items.map(item => {
            let done = false;
            let prog = null;

            try {
              done = unlocked.has(item.id) || item.check?.(stats);
              prog = item.progress?.(stats) || null;
            } catch {
              done = false;
              prog = null;
            }

            const current = prog ? Number(prog.current || 0) : 0;
            const max = prog ? Number(prog.max || 0) : 0;
            const percent = prog && max > 0
              ? Math.min(100, Math.round((current / max) * 100))
              : 0;

            return `
              <div class="achievement-row ${done ? "unlocked" : "locked"}">
                <div class="achievement-icon">${item.icon || "🏆"}</div>

                <div class="achievement-info">
                  <div class="achievement-label">${item.label}</div>
                  <div class="achievement-desc">${item.desc}</div>

                  ${prog ? `
                    <div class="achievement-progress-bar">
                      <div
                        class="achievement-progress-fill"
                        style="width:${percent}%"
                      ></div>
                    </div>

                    <div class="achievement-progress-text">
                      ${current.toLocaleString()} / ${max.toLocaleString()}
                    </div>
                  ` : ""}
                </div>

                <div class="achievement-check">
                  ${done ? "✔" : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".achievement-category-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      if (!content) return;
      content.classList.toggle("hidden");
    });
  });
}

/* ===== アチーブメント達成通知 ===== */
export function showAchievementNotification(achievement) {
  const el = document.createElement("div");
  el.className = "achievement-notification ingame";

  el.innerHTML = `
    <div class="achievement-notif-icon">
      ${achievement.icon || "🏆"}
    </div>

    <div>
      <div class="achievement-notif-title">
        アチーブメント解除！
      </div>

      <div class="achievement-notif-label">
        ${achievement.label || achievement.title}
      </div>
    </div>
  `;

  document.body.appendChild(el);

  const notifications = document.querySelectorAll(".achievement-notification.ingame");
  notifications.forEach((item, index) => {
    item.style.top = `${18 + index * 78}px`;
  });

  requestAnimationFrame(() => {
    el.classList.add("achievement-notif-show");
  });

  setTimeout(() => {
    el.classList.remove("achievement-notif-show");

    setTimeout(() => {
      el.remove();

      const remaining = document.querySelectorAll(".achievement-notification.ingame");
      remaining.forEach((item, index) => {
        item.style.top = `${18 + index * 78}px`;
      });
    }, 400);
  }, 3000);
}