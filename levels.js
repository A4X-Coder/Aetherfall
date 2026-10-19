/**
 * 30 Handcrafted Level Configurations for Aetherfall
 */
const CRYSTAL_TYPES = {
  SAPPHIRE: 0,
  CITRINE: 1,
  AMETHYST: 2,
  EMERALD: 3,
  RUBY: 4,
  PEARL: 5
};

const AETHER_LEVELS = [
  // Sector I: Awakening (Levels 1 - 5)
  {
    level: 1,
    title: "Celestial Awakening",
    moves: 22,
    targetScore: 1200,
    crystalPool: [0, 1, 2, 3],
    stars: [1200, 2200, 3200],
    objective: { type: 'score', target: 1200, desc: 'Score 1,200 points' }
  },
  {
    level: 2,
    title: "Sapphire Resonance",
    moves: 20,
    targetScore: 1800,
    crystalPool: [0, 1, 2, 3],
    stars: [1800, 2800, 4000],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.SAPPHIRE, target: 16, current: 0, desc: 'Collect 16 Sapphires' }
  },
  {
    level: 3,
    title: "Solar Luminescence",
    moves: 20,
    targetScore: 2200,
    crystalPool: [0, 1, 2, 3, 4],
    stars: [2200, 3400, 4800],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.CITRINE, target: 18, current: 0, desc: 'Collect 18 Citrines' }
  },
  {
    level: 4,
    title: "Violet Harmonics",
    moves: 24,
    targetScore: 2800,
    crystalPool: [0, 1, 2, 3, 4],
    stars: [2800, 4200, 5800],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.AMETHYST, target: 20, current: 0, desc: 'Collect 20 Amethysts' }
  },
  {
    level: 5,
    title: "First Conjunction",
    moves: 25,
    targetScore: 3500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [3500, 5200, 7000],
    objective: { type: 'score', target: 3500, desc: 'Reach 3,500 points' }
  },

  // Sector II: Prismatic Veil (Levels 6 - 10)
  {
    level: 6,
    title: "Emerald Flow",
    moves: 22,
    targetScore: 3200,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [3200, 4800, 6500],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.EMERALD, target: 22, current: 0, desc: 'Collect 22 Emeralds' }
  },
  {
    level: 7,
    title: "Ruby Nebula",
    moves: 20,
    targetScore: 3800,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [3800, 5500, 7500],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.RUBY, target: 20, current: 0, desc: 'Collect 20 Rubies' }
  },
  {
    level: 8,
    title: "Starlight Drift",
    moves: 22,
    targetScore: 4200,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [4200, 6000, 8000],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.PEARL, target: 24, current: 0, desc: 'Collect 24 Pearls' }
  },
  {
    level: 9,
    title: "Astral Cascade",
    moves: 18,
    targetScore: 4800,
    crystalPool: [0, 1, 2, 3, 4],
    stars: [4800, 6800, 9200],
    objective: { type: 'score', target: 4800, desc: 'Score 4,800 in 18 moves' }
  },
  {
    level: 10,
    title: "Equinox Convergence",
    moves: 24,
    targetScore: 5500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [5500, 7800, 10500],
    objective: { type: 'score', target: 5500, desc: 'Score 5,500 points' }
  },

  // Sector III: Stellar Forge (Levels 11 - 15)
  {
    level: 11,
    title: "Twin Frequencies",
    moves: 25,
    targetScore: 5200,
    crystalPool: [0, 1, 2, 3, 4],
    stars: [5200, 7500, 10000],
    objective: { type: 'collect_dual', c1: CRYSTAL_TYPES.SAPPHIRE, t1: 18, c2: CRYSTAL_TYPES.CITRINE, t2: 18, cur1: 0, cur2: 0, desc: 'Collect 18 Sapphires & 18 Citrines' }
  },
  {
    level: 12,
    title: "Prismatic Compression",
    moves: 20,
    targetScore: 6000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [6000, 8500, 11500],
    objective: { type: 'score', target: 6000, desc: 'Score 6,000 points' }
  },
  {
    level: 13,
    title: "Cosmic Crucible",
    moves: 22,
    targetScore: 6400,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [6400, 9000, 12000],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.AMETHYST, target: 28, current: 0, desc: 'Collect 28 Amethysts' }
  },
  {
    level: 14,
    title: "Nova Pulse",
    moves: 19,
    targetScore: 6800,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [6800, 9500, 13000],
    objective: { type: 'score', target: 6800, desc: 'Score 6,800 points' }
  },
  {
    level: 15,
    title: "Solar Eclipse",
    moves: 26,
    targetScore: 7500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [7500, 10500, 14000],
    objective: { type: 'collect_dual', c1: CRYSTAL_TYPES.CITRINE, t1: 22, c2: CRYSTAL_TYPES.PEARL, t2: 22, cur1: 0, cur2: 0, desc: 'Collect 22 Citrines & 22 Pearls' }
  },

  // Sector IV: The Deep Void (Levels 16 - 20)
  {
    level: 16,
    title: "Chrono Horizon",
    moves: 17,
    targetScore: 7200,
    crystalPool: [0, 1, 2, 3, 4],
    stars: [7200, 10000, 13500],
    objective: { type: 'score', target: 7200, desc: 'Fast! Score 7,200 points' }
  },
  {
    level: 17,
    title: "Crystalline Rift",
    moves: 23,
    targetScore: 8000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [8000, 11000, 15000],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.RUBY, target: 30, current: 0, desc: 'Collect 30 Rubies' }
  },
  {
    level: 18,
    title: "Singularity Well",
    moves: 21,
    targetScore: 8500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [8500, 11800, 16000],
    objective: { type: 'score', target: 8500, desc: 'Harmonize 8,500 points' }
  },
  {
    level: 19,
    title: "Aurora Filament",
    moves: 24,
    targetScore: 9000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [9000, 12500, 17000],
    objective: { type: 'collect_dual', c1: CRYSTAL_TYPES.EMERALD, t1: 24, c2: CRYSTAL_TYPES.SAPPHIRE, t2: 24, cur1: 0, cur2: 0, desc: 'Collect 24 Emeralds & 24 Sapphires' }
  },
  {
    level: 20,
    title: "Zenith Core",
    moves: 25,
    targetScore: 10000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [10000, 14000, 19000],
    objective: { type: 'score', target: 10000, desc: 'Unlock Core: 10,000 points' }
  },

  // Sector V: Celestial Ascendance (Levels 21 - 25)
  {
    level: 21,
    title: "Pulsar Dance",
    moves: 22,
    targetScore: 10500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [10500, 14500, 20000],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.AMETHYST, target: 32, current: 0, desc: 'Collect 32 Amethysts' }
  },
  {
    level: 22,
    title: "Orbital Harmonic",
    moves: 20,
    targetScore: 11000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [11000, 15500, 21000],
    objective: { type: 'score', target: 11000, desc: 'Score 11,000 points' }
  },
  {
    level: 23,
    title: "Supercluster",
    moves: 24,
    targetScore: 12000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [12000, 16800, 23000],
    objective: { type: 'collect_dual', c1: CRYSTAL_TYPES.RUBY, t1: 28, c2: CRYSTAL_TYPES.PEARL, t2: 28, cur1: 0, cur2: 0, desc: 'Collect 28 Rubies & 28 Pearls' }
  },
  {
    level: 24,
    title: "Entropy Wave",
    moves: 18,
    targetScore: 12500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [12500, 17500, 24000],
    objective: { type: 'score', target: 12500, desc: 'Survive: 12,500 points' }
  },
  {
    level: 25,
    title: "Radiant Apex",
    moves: 26,
    targetScore: 13500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [13500, 19000, 26000],
    objective: { type: 'score', target: 13500, desc: 'Reach 13,500 points' }
  },

  // Sector VI: Transcendent Harmonization (Levels 26 - 30)
  {
    level: 26,
    title: "Nebula Matrix",
    moves: 23,
    targetScore: 14000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [14000, 19500, 27000],
    objective: { type: 'collect', crystal: CRYSTAL_TYPES.SAPPHIRE, target: 36, current: 0, desc: 'Collect 36 Sapphires' }
  },
  {
    level: 27,
    title: "Prism of Eternity",
    moves: 21,
    targetScore: 15000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [15000, 21000, 29000],
    objective: { type: 'score', target: 15000, desc: 'Score 15,000 points' }
  },
  {
    level: 28,
    title: "Cosmic Symphony",
    moves: 25,
    targetScore: 16500,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [16500, 23000, 32000],
    objective: { type: 'collect_dual', c1: CRYSTAL_TYPES.CITRINE, t1: 30, c2: CRYSTAL_TYPES.AMETHYST, t2: 30, cur1: 0, cur2: 0, desc: 'Collect 30 Citrines & 30 Amethysts' }
  },
  {
    level: 29,
    title: "Aether Fracture",
    moves: 19,
    targetScore: 18000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [18000, 25000, 35000],
    objective: { type: 'score', target: 18000, desc: 'Score 18,000 points' }
  },
  {
    level: 30,
    title: "The Celestial Heart",
    moves: 28,
    targetScore: 22000,
    crystalPool: [0, 1, 2, 3, 4, 5],
    stars: [22000, 30000, 42000],
    objective: { type: 'score', target: 22000, desc: 'The Grand Harmonization: 22,000' }
  }
];

window.AETHER_LEVELS = AETHER_LEVELS;
window.CRYSTAL_TYPES = CRYSTAL_TYPES;