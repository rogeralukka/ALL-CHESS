import { LessonStage } from '../types';

/**
 * Mock Learn roadmap data for ALL-CHESS Phase 1.
 * 8 stages in Endgame path from mockup, plus Openings and Middlegame modules.
 * All numbers labeled as MOCK per Section 6 requirements.
 */

export const MOCK_LEARN_STAGES: LessonStage[] = [
  // --- ENDGAME PATH (From mockup) ---
  {
    id: 'endgame-1',
    title: 'King + Rook vs King',
    category: 'endgame',
    status: 'done',
    xp: 50, // MOCK
    description: 'Master the fundamental technique to box the enemy king into the edge of the board.',
    steps: [
      {
        id: 'step-1-1',
        title: 'Cut off the King',
        instruction: 'Place your rook on the 4th rank to build a fence and prevent the enemy king from advancing.',
        buttonText: "Let's Start!",
        fen: '8/8/8/4k3/8/8/4K3/R7 w - - 0 1',
        requiredMove: 'Ra4',
        arrows: [{ from: 'a1', to: 'a4', color: 'green' }],
        highlightSquares: ['a4'],
        isInteractive: true,
        explanation: 'Great! The rook acts as an impassable wall along the 4th rank.'
      },
      {
        id: 'step-1-2',
        title: 'Bring up the King',
        instruction: 'Your king must work in tandem with the rook to push the enemy king back. Step toward the center.',
        buttonText: 'Continue',
        fen: '8/8/8/4k3/R7/8/4K3/8 w - - 0 2',
        requiredMove: 'Ke3',
        arrows: [{ from: 'e2', to: 'e3', color: 'green' }],
        highlightSquares: ['e3'],
        isInteractive: true,
        explanation: 'Direct opposition! Now the enemy king is forced to retreat.'
      }
    ]
  },
  {
    id: 'endgame-2',
    title: 'Back-Rank Basics',
    category: 'endgame',
    status: 'current',
    xp: 75, // MOCK
    description: 'Learn how to deliver checkmate along the back rank when pawns trap the defending king.',
    steps: [
      {
        id: 'step-2-1',
        title: 'Identify the Weak Rank',
        instruction: 'The black king is trapped behind a wall of pawns on f7, g7, and h7. Deliver checkmate on d8!',
        buttonText: "Let's Play!",
        fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
        requiredMove: 'Rxd8#',
        arrows: [{ from: 'd1', to: 'd8', color: 'green' }],
        highlightSquares: ['d8'],
        isInteractive: true,
        explanation: 'Checkmate! The pawns blocked all king flight squares.'
      }
    ]
  },
  {
    id: 'endgame-3',
    title: 'Lucena Position',
    category: 'endgame',
    status: 'locked',
    xp: 100, // MOCK
    description: 'The golden standard of rook endgames: building a bridge with your rook to queen your pawn.',
    steps: [
      {
        id: 'step-3-1',
        title: 'Rook to the 4th rank',
        instruction: 'Place your rook on the 4th rank to prepare the bridge maneuver.',
        buttonText: 'Start Bridge',
        fen: '1K1k4/1P6/8/8/8/8/r7/5R2 w - - 0 1',
        requiredMove: 'Rf4',
        arrows: [{ from: 'f1', to: 'f4', color: 'green' }],
        highlightSquares: ['f4'],
        isInteractive: true,
        explanation: 'The 4th rank rook is ready to shield the king from lateral checks.'
      }
    ]
  },
  {
    id: 'endgame-4',
    title: 'Philidor Position',
    category: 'endgame',
    status: 'locked',
    xp: 100, // MOCK
    description: 'The premier defensive drawing technique in rook and pawn endgames.',
    steps: []
  },
  {
    id: 'endgame-5',
    title: 'Rook Behind the Pawn',
    category: 'endgame',
    status: 'locked',
    xp: 80, // MOCK
    description: 'Tarrasch’s immortal rule: place your rook behind passed pawns, whether attacking or defending.',
    steps: []
  },
  {
    id: 'endgame-6',
    title: 'Cutting Off the King',
    category: 'endgame',
    status: 'locked',
    xp: 90, // MOCK
    description: 'Using file and rank cuts to isolate the enemy monarch from the critical passed pawn.',
    steps: []
  },
  {
    id: 'endgame-7',
    title: 'The Active Rook',
    category: 'endgame',
    status: 'locked',
    xp: 90, // MOCK
    description: 'Activity is worth a pawn! Keep your rook creating threats instead of passive defense.',
    steps: []
  },
  {
    id: 'endgame-8',
    title: 'Rook Endgame Test',
    category: 'endgame',
    status: 'locked',
    xp: 150, // MOCK
    description: 'Put all your rook endgame techniques to the test against master-level positions.',
    steps: []
  },

  // --- OPENINGS PATH ---
  {
    id: 'opening-1',
    title: 'Italian Game Principles',
    category: 'openings',
    status: 'done',
    xp: 60, // MOCK
    description: 'Controlling e4 and d4 while developing pieces toward the vulnerable f7 square.',
    steps: []
  },
  {
    id: 'opening-2',
    title: 'Caro-Kann Advance Setup',
    category: 'openings',
    status: 'current',
    xp: 80, // MOCK
    description: 'Solidifying your light-square bishop outside the pawn chain.',
    steps: []
  },
  {
    id: 'opening-3',
    title: 'Sicilian Defense Najdorf Basics',
    category: 'openings',
    status: 'locked',
    xp: 100, // MOCK
    description: 'Dynamic asymmetric warfare on the c-file.',
    steps: []
  },

  // --- MIDDLEGAME PATH ---
  {
    id: 'middle-1',
    title: 'Outposts and Weak Squares',
    category: 'middlegame',
    status: 'done',
    xp: 70, // MOCK
    description: 'Planting knights on untouchable holes in the opponent camp.',
    steps: []
  },
  {
    id: 'middle-2',
    title: 'Open Files & Infiltration',
    category: 'middlegame',
    status: 'current',
    xp: 85, // MOCK
    description: 'Doubling rooks on the 7th rank to generate irresistible mating nets.',
    steps: []
  },
  {
    id: 'middle-3',
    title: 'Pawn Breaks in the Center',
    category: 'middlegame',
    status: 'locked',
    xp: 95, // MOCK
    description: 'Timing your central advance to shatter closed positions.',
    steps: []
  }
];
