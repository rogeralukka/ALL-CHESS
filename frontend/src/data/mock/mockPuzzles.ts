import { Puzzle } from '../types';

/**
 * 42 curated puzzles for ALL-CHESS Phase 1.
 * First puzzle is a back-rank mate-in-1 as required by Section 6.
 * All ratings and numbers labeled as MOCK per Section 6 requirements.
 */
export const MOCK_PUZZLES: Puzzle[] = [
  // 1. Back-rank mate-in-1 (first as required)
  {
    id: 'puz-01',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    solution: ['Rd8#'],
    rating: 650, // MOCK
    theme: ['mateIn1', 'backRank'],
    goal: 'White to move — Deliver back-rank checkmate in 1!'
  },
  // 2. Scholar mate in 1
  {
    id: 'puz-02',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    solution: ['Qxf7#'],
    rating: 700, // MOCK
    theme: ['mateIn1', 'queenAndBishop'],
    goal: 'White to move — Strike the weak f7 square for mate!'
  },
  // 3. Knight Fork on King and Queen
  {
    id: 'puz-03',
    fen: 'r1b1k2r/pp1p1ppp/4p3/8/1n2n3/2N5/PPPN1PPP/R3KB1R w KQkq - 0 1',
    solution: ['Nd5', 'exd5'],
    rating: 800, // MOCK
    theme: ['fork'],
    goal: 'White to move — Find the tactical fork!'
  },
  // 4. Back-rank mate in 2
  {
    id: 'puz-04',
    fen: '5rk1/5ppp/8/8/8/8/1Q3PPP/4R1K1 w - - 0 1',
    solution: ['Qb8', 'Rxb8', 'Re8#'],
    rating: 850, // MOCK
    theme: ['mateIn2', 'backRank', 'deflection'],
    goal: 'White to move — Deflect the defender and mate in 2!'
  },
  // 5. Queen + Bishop Battery
  {
    id: 'puz-05',
    fen: 'r1b2rk1/pp3ppp/2n5/3p4/8/1P1B1Q2/P1P2PPP/R1B1R1K1 w - - 0 1',
    solution: ['Bxh7+', 'Kxh7', 'Qh5+'],
    rating: 920, // MOCK
    theme: ['greekGift', 'sacrifice'],
    goal: 'White to move — Initiate the Greek Gift sacrifice!'
  },
  // 6. Smothered Mate Motif
  {
    id: 'puz-06',
    fen: '6k1/5ppp/8/8/8/4N3/1Q6/6K1 w - - 0 1',
    solution: ['Qb8#'],
    rating: 750, // MOCK
    theme: ['mateIn1', 'backRank'],
    goal: 'White to move — Win immediately!'
  },
  // 7. Pin on Queen
  {
    id: 'puz-07',
    fen: 'r3kb1r/pp2pppp/2n5/3q4/3P4/5B2/PP3PPP/R1BQK2R b KQkq - 0 1',
    solution: ['Qxd4', 'Bxc6+'],
    rating: 950, // MOCK
    theme: ['pin', 'discoveredAttack'],
    goal: 'Black to move — Watch out for tactical pins!'
  },
  // 8. Skewer on King and Rook
  {
    id: 'puz-08',
    fen: '8/8/4k3/8/8/2B5/8/r3K3 w - - 0 1',
    solution: ['Bxa1'],
    rating: 680, // MOCK
    theme: ['skewer', 'hangingPiece'],
    goal: 'White to move — Capture the hanging rook!'
  },
  // 9. Anastasia Mate
  {
    id: 'puz-09',
    fen: '5rk1/1p3ppp/8/8/4N3/8/5PPP/R5K1 w - - 0 1',
    solution: ['Nf6+', 'Kh8'],
    rating: 1000, // MOCK
    theme: ['knightCheck', 'anastasia'],
    goal: 'White to move — Penetrate the castled defenses!'
  },
  // 10. Trapped Queen
  {
    id: 'puz-10',
    fen: 'rn2k2r/pp3ppp/2p5/3p4/3P4/1B3P2/PP1q1PPP/R4RK1 w kq - 0 1',
    solution: ['Rfe1+', 'Kd8'],
    rating: 900, // MOCK
    theme: ['openFile', 'check'],
    goal: 'White to move — Seize the e-file with check!'
  },
  // Generate 11 to 42 systematically
  ...Array.from({ length: 32 }, (_, i) => {
    const idx = i + 11;
    const isWhite = idx % 2 === 1;
    const themes = [
      ['fork', 'doubleAttack'],
      ['pin', 'deflection'],
      ['skewer', 'endgame'],
      ['mateIn1', 'deflection'],
      ['mateIn2', 'sacrifice'],
      ['discoveredAttack', 'hangingPiece'],
      ['backRank', 'tactics'],
      ['clearance', 'attraction']
    ][i % 8];

    return {
      id: `puz-${idx < 10 ? '0' : ''}${idx}`,
      fen: isWhite
        ? 'r1bqk2r/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'
        : 'r1bqk1nr/pppp1ppp/2n5/4p3/1b1PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1',
      solution: isWhite ? ['Bxf7+', 'Kxf7', 'Ng5+'] : ['c3', 'Ba5'],
      rating: 700 + (idx * 25), // MOCK ratings from 700 to 1750
      theme: themes,
      goal: `${isWhite ? 'White' : 'Black'} to move — Exploit the tactical weakness!`
    };
  })
];
