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
    steps: [
      {
        id: 'step-4-1',
        title: '6th Rank Defense',
        instruction: 'Keep your rook on the 6th rank to prevent the enemy king from advancing.',
        buttonText: 'Hold the Rank',
        fen: '8/8/8/4k3/8/2r5/4K3/R7 b - - 0 1',
        requiredMove: 'Rc6',
        arrows: [{ from: 'c3', to: 'c6', color: 'green' }],
        highlightSquares: ['c6'],
        isInteractive: true,
        explanation: 'The 6th rank shield prevents the king from supporting the pawn forward.'
      }
    ]
  },
  {
    id: 'endgame-5',
    title: 'Rook Behind the Pawn',
    category: 'endgame',
    status: 'locked',
    xp: 80, // MOCK
    description: 'Tarrasch’s immortal rule: place your rook behind passed pawns, whether attacking or defending.',
    steps: [
      {
        id: 'step-5-1',
        title: 'Occupy the File Behind',
        instruction: 'Move your rook behind your passed pawn on a5.',
        buttonText: 'Follow Tarrasch',
        fen: '8/8/8/P7/8/8/4K3/4R2k w - - 0 1',
        requiredMove: 'Ra1',
        arrows: [{ from: 'e1', to: 'a1', color: 'green' }],
        highlightSquares: ['a1'],
        isInteractive: true,
        explanation: 'Now the pawn is protected and the rook gains mobility as the pawn advances!'
      }
    ]
  },
  {
    id: 'endgame-6',
    title: 'Cutting Off the King',
    category: 'endgame',
    status: 'locked',
    xp: 90, // MOCK
    description: 'Using file and rank cuts to isolate the enemy monarch from the critical passed pawn.',
    steps: [
      {
        id: 'step-6-1',
        title: 'File Barrier',
        instruction: 'Cut the black king off along the d-file.',
        buttonText: 'Cut Off',
        fen: '8/8/4k3/8/3P4/8/4K3/2R5 w - - 0 1',
        requiredMove: 'Rd1',
        arrows: [{ from: 'c1', to: 'd1', color: 'green' }],
        highlightSquares: ['d1'],
        isInteractive: true,
        explanation: 'The king cannot cross the d-file to reach the d-pawn.'
      }
    ]
  },
  {
    id: 'endgame-7',
    title: 'The Active Rook',
    category: 'endgame',
    status: 'locked',
    xp: 90, // MOCK
    description: 'Activity is worth a pawn! Keep your rook creating threats instead of passive defense.',
    steps: [
      {
        id: 'step-7-1',
        title: 'Active Check',
        instruction: 'Deliver a check from behind to disrupt the opponent.',
        buttonText: 'Check!',
        fen: '8/8/8/8/3k4/8/4K3/R7 w - - 0 1',
        requiredMove: 'Ra4+',
        arrows: [{ from: 'a1', to: 'a4', color: 'green' }],
        highlightSquares: ['a4'],
        isInteractive: true,
        explanation: 'Active checking from the flank keeps the defender tied down.'
      }
    ]
  },
  {
    id: 'endgame-8',
    title: 'Rook Endgame Test',
    category: 'endgame',
    status: 'locked',
    xp: 150, // MOCK
    description: 'Put all your rook endgame techniques to the test against master-level positions.',
    steps: [
      {
        id: 'step-8-1',
        title: 'Master Challenge',
        instruction: 'Spot the winning deflection maneuver.',
        buttonText: 'Deliver Mate',
        fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
        requiredMove: 'Re8#',
        arrows: [{ from: 'e1', to: 'e8', color: 'green' }],
        highlightSquares: ['e8'],
        isInteractive: true,
        explanation: 'Outstanding! You have mastered the fundamentals of rook endgames.'
      }
    ]
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
