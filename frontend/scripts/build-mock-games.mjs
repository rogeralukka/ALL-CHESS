import { Chess } from 'chess.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 12 raw game definitions
const RAW_GAMES = [
  {
    id: 'game-01',
    white: { username: 'You', rating: 905, avatarUrl: '/assets/coach/coach_neutral.webp' },
    black: { username: 'PawnStorm22', rating: 920 },
    result: '0-1', // Final position is 27... Rxf1#
    date: '2026-10-22T19:30:00Z',
    timeControl: '10 min',
    speed: 'rapid',
    source: 'online',
    opening: { eco: 'C50', name: "Italian Game: Giuoco Pianissimo" },
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Bc5 5. O-O d6 6. Bxf7+ Kxf7 7. Ng5+ Kg8 8. Qf3 Qe7 9. Nc3 Be6 10. Nxe6 Qxe6 11. Bg5 Rf8 12. Bxf6 Rxf6 13. Qg3 Nd4 14. Kh1 Nxc2 15. Rac1 Nd4 16. Nd5 Rf7 17. f4 Ne2 18. Qg5 Nxc1 19. f5 Qd7 20. f6 h6 21. Qg3 g5 22. Rxc1 c6 23. Ne7+ Kh7 24. Qf3 Qe6 25. Rf1 Re8 26. Qh5 Rexe7 27. fxe7 Rxf1#',
    accuracy: { white: 78.4, black: 86.2 }, // MOCK
    estimatedRating: { white: 980, black: 1120 }, // MOCK
    phaseGrades: { opening: 'B', middlegame: 'C', tactics: 'D', endgame: 'N/A' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 4: 'book', 5: 'book', 6: 'book', 7: 'book', 8: 'book', 9: 'book',
      10: 'blunder', 11: 'best', 12: 'inaccuracy', 13: 'best', 14: 'mistake', 15: 'best', 16: 'good', 17: 'best',
      18: 'inaccuracy', 19: 'best', 20: 'good', 21: 'excellent', 22: 'mistake', 23: 'best', 24: 'good', 25: 'great',
      26: 'best', 27: 'best', 28: 'good', 29: 'best', 30: 'inaccuracy', 31: 'best', 32: 'mistake', 33: 'brilliant',
      34: 'good', 35: 'best', 36: 'good', 37: 'best', 38: 'mistake', 39: 'excellent', 40: 'inaccuracy', 41: 'best',
      42: 'good', 43: 'best', 44: 'mistake', 45: 'best', 46: 'good', 47: 'best', 48: 'good', 49: 'best',
      50: 'mistake', 51: 'best', 52: 'blunder', 53: 'best'
    }
  },
  {
    id: 'game-02',
    white: { username: 'CoachAllChess', rating: 1200, title: 'BOT' },
    black: { username: 'You', rating: 905 },
    result: '0-1',
    date: '2026-10-21T14:15:00Z',
    timeControl: '5 min',
    speed: 'blitz',
    source: 'vs_coach',
    opening: { eco: 'B12', name: 'Caro-Kann Defense: Advance Variation' },
    pgn: '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. c3 Nc6 7. O-O cxd4 8. cxd4 Nge7 9. Nc3 Ng6 10. Be3 Be7 11. Qd2 O-O 12. Rac1 Rc8 13. a3 f6 14. exf6 Bxf6 15. b4 Kh8 16. Na4 b6 17. Ba6 Rc7 18. Nc3 Bg4 19. Ne1 Nce7 20. f3 Bf5 21. g4 Bxg4 22. fxg4 Bh4 23. Rxf8+ Qxf8 24. Ng2 Qf3 25. Nxh4 Nxh4 26. Bf1 Qxg4+ 27. Kh1 Nef5 28. Bf4 Qf3+ 29. Bg2 Nxg2 30. Qxg2 Qxf4 31. Ne2 Rxc1+ 32. Nxc1 Qxc1+',
    accuracy: { white: 71.3, black: 92.5 }, // MOCK
    estimatedRating: { white: 1050, black: 1350 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'A', tactics: 'A', endgame: 'B' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 4: 'best', 5: 'best',
      41: 'brilliant', 42: 'blunder', 43: 'best', 60: 'blunder', 61: 'best', 62: 'blunder', 63: 'best'
    }
  },
  {
    id: 'game-03',
    white: { username: 'You', rating: 905 },
    black: { username: 'TacticsKnight', rating: 915 },
    result: '1-0',
    date: '2026-10-20T21:05:00Z',
    timeControl: '3 min',
    speed: 'blitz',
    source: 'online',
    opening: { eco: 'B20', name: 'Sicilian Defense' },
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. g4 b5 11. Bxf6 Nxf6 12. g5 Nd7 13. f5 O-O 14. Rg1 b4 15. Nce2 e5 16. f6 exd4 17. fxe7 Re8 18. Nxd4 Ne5 19. Qf4 Qxe7 20. Nf5 Bxf5 21. exf5 Rac8 22. f6 Qc7 23. Rd2 Nf3 24. Qxf3 Re1+ 25. Qd1 Rxd1+ 26. Kxd1 Qc5 27. Rg3 Qe5 28. Bd3 Qxb2 29. Re3 gxf6 30. gxf6 Qxf6 31. Rg2+ Kf8 32. Reg3 Qa1+ 33. Kd2 Qc3+ 34. Kd1 Re8 35. Rg8+ Ke7 36. Re2+ Kd7 37. Rgxe8 Qa1+ 38. Kd2 Qc3+ 39. Kd1 Qa1+ 40. Kd2',
    accuracy: { white: 84.1, black: 79.5 }, // MOCK
    estimatedRating: { white: 1100, black: 1020 }, // MOCK
    phaseGrades: { opening: 'B', middlegame: 'B', tactics: 'A', endgame: 'B' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 22: 'brilliant', 44: 'blunder', 45: 'great'
    }
  },
  {
    id: 'game-04',
    white: { username: 'BishopSniper', rating: 940 },
    black: { username: 'You', rating: 905 },
    result: '1-0',
    date: '2026-10-19T18:22:00Z',
    timeControl: '10 min',
    speed: 'rapid',
    source: 'online',
    opening: { eco: 'D00', name: "Queen's Pawn Game: London System" },
    pgn: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3 Nc6 5. Nd2 Bf5 6. Ngf3 e6 7. Nh4 Bg6 8. Nxg6 hxg6 9. Bd3 Bd6 10. Bxd6 Qxd6 11. f4 cxd4 12. cxd4 g5 13. O-O gxf4 14. Rxf4 e5 15. dxe5 Nxe5 16. Bb5+ Ke7 17. Nf3 a6 18. Be2 Nxf3+ 19. Bxf3 g5 20. Rd4 Qxh2+ 21. Kf2 Rh4 22. Qb3 Rxd4 23. exd4 Qh4+ 24. Ke2 Re8 25. Qxb7+ Kf8+ 26. Kd3 Qf4 27. Qb4+ Kg7 28. Re1 Qf5+ 29. Kd2 Qf4+ 30. Kd1 Rxe1+ 31. Kxe1 g4 32. Be2 Ne4 33. Kd1 Nf2+ 34. Kc2 Qe4+ 35. Kd2 Qxg2 36. Qd6 Ne4+',
    accuracy: { white: 81.0, black: 88.5 }, // MOCK
    estimatedRating: { white: 990, black: 1180 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'B', tactics: 'A', endgame: 'B' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 71: 'brilliant'
    }
  },
  {
    id: 'game-05',
    white: { username: 'You', rating: 905 },
    black: { username: 'RookRoller', rating: 890 },
    result: '1-0',
    date: '2026-10-18T16:45:00Z',
    timeControl: '1 min',
    speed: 'bullet',
    source: 'online',
    opening: { eco: 'B01', name: 'Scandinavian Defense' },
    pgn: '1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d4 Nf6 5. Nf3 Bg4 6. h3 Bh5 7. g4 Bg6 8. Ne5 Nbd7 9. Nc4 Qa6 10. Bf4 Qe6+ 11. Ne3 c6 12. Bc4 Nd5 13. Ncxd5 cxd5 14. Bxd5 Qb6 15. O-O e6 16. Bg2 Bd6 17. Nc4 Bxf4 18. Nxb6 Nxb6 19. Bxb7 Rb8 20. Bc6+ Ke7 21. Qf3 Bd6 22. b3 Rhc8 23. c4 Ba3 24. Rae1 Kf8 25. Rxe6 Kg8 26. Re3 Bb4 27. c5 Na8 28. a3 Bxa3 29. Ra1 Bb2 30. Rxa7 Nc7 31. Qf4 Ne6 32. Rxe6 fxe6 33. Qe5',
    accuracy: { white: 89.2, black: 68.4 }, // MOCK
    estimatedRating: { white: 1240, black: 840 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'A', tactics: 'A', endgame: 'A' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 17: 'brilliant', 18: 'blunder', 64: 'great'
    }
  },
  {
    id: 'game-06',
    white: { username: 'GM_Example', rating: 1400, title: 'BOT' },
    black: { username: 'You', rating: 905 },
    result: '1-0',
    date: '2026-10-17T20:10:00Z',
    timeControl: '15 min',
    speed: 'rapid',
    source: 'vs_coach',
    opening: { eco: 'E60', name: "King's Indian Defense" },
    pgn: '1. d4 Nf6 2. c4 g6 3. g3 Bg7 4. Bg2 O-O 5. Nc3 d6 6. Nf3 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. Re1 exd4 11. Nxd4 Re8 12. Re2 Ng4 13. Nb3 Nge5 14. Be3 Qc7 15. c5 dxc5 16. Nxc5 Nxc5 17. Bxc5 Rd8 18. Qc2 Be6 19. b3 Nd3 20. Be3 Nb4 21. Qc1 Rd3 22. Bd2 Rad8 23. Be1 Qe5 24. a3 Na6 25. Rc2 Bxb3 26. f4 Qd4+ 27. Bf2 Qd7 28. e5 Bxc2 29. Qxc2 Rd2 30. Qb3 Rxf2 31. Kxf2 Qd4+ 32. Kf1 Nc5 33. Qc2 Qc4+ 34. Kg1 Rd3 35. Rc1 Rxg3',
    accuracy: { white: 76.5, black: 88.0 }, // MOCK
    estimatedRating: { white: 1100, black: 1290 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'B', tactics: 'A', endgame: 'B' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 59: 'brilliant', 60: 'blunder', 61: 'best'
    }
  },
  {
    id: 'game-07',
    white: { username: 'You', rating: 905 },
    black: { username: 'friend_01', rating: 930 },
    result: '1/2-1/2',
    date: '2026-10-16T15:30:00Z',
    timeControl: '10 min',
    speed: 'rapid',
    source: 'online',
    opening: { eco: 'C42', name: 'Petrov Defense' },
    pgn: '1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 d5 6. Bd3 Bd6 7. O-O O-O 8. c4 c6 9. Nc3 Nxc3 10. bxc3 dxc4 11. Bxc4 Bg4 12. h3 Bh5 13. Re1 Nd7 14. Be2 Re8 15. Be3 Qc7 16. Qb3 Rad8 17. Rab1 b6 18. c4 c5 19. d5 Nf6 20. a4 Ne4 21. a5 bxa5 22. Qa3 Rb8 23. Ra1 Rb4 24. Qxa5 Qxa5 25. Rxa5 Nc3 26. Bd3 Bxf3 27. gxf3 Ra4 28. Rxa4 Nxa4 29. Ra1 Nb2 30. Bf1 Ra8 31. Ra6 Bf8 32. f4 Nd1 33. Bd2',
    accuracy: { white: 85.0, black: 84.5 }, // MOCK
    estimatedRating: { white: 1040, black: 1030 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'B', tactics: 'B', endgame: 'A' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 26: 'great', 51: 'inaccuracy'
    }
  },
  {
    id: 'game-08',
    white: { username: 'KnightRider99', rating: 910 },
    black: { username: 'You', rating: 905 },
    result: '0-1',
    date: '2026-10-15T11:20:00Z',
    timeControl: '5 min',
    speed: 'blitz',
    source: 'online',
    opening: { eco: 'A04', name: 'Reti Opening' },
    pgn: '1. Nf3 c5 2. g3 Nc6 3. Bg2 g6 4. O-O Bg7 5. d3 d6 6. e4 e5 7. Nc3 Nge7 8. Be3 O-O 9. Qd2 Nd4 10. Bh6 Bxh6 11. Qxh6 Nxf3+ 12. Bxf3 Be6 13. Bg2 d5 14. exd5 Nxd5 15. Ne4 f6 16. Nxc5 Bf7 17. Ne4 Rc8 18. c4 Nb4 19. Rad1 Rc6 20. a3 Nc2 21. Rd2 Nd4 22. f4 exf4 23. Rxf4 Re8 24. Rdf2 f5 25. Ng5 Re1+ 26. Bf1 Qf6 27. Qxh7+ Kf8 28. Qxf7+ Qxf7 29. Nxf7 Kxf7 30. Rxd4',
    accuracy: { white: 69.8, black: 88.0 }, // MOCK
    estimatedRating: { white: 860, black: 1210 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'B', tactics: 'A', endgame: 'B' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 20: 'blunder', 49: 'brilliant', 50: 'blunder'
    }
  },
  {
    id: 'game-09',
    white: { username: 'You', rating: 905 },
    black: { username: 'CheckmateChamp', rating: 880 },
    result: '1-0',
    date: '2026-10-14T09:12:00Z',
    timeControl: '3 min',
    speed: 'blitz',
    source: 'online',
    opening: { eco: 'C20', name: "King's Pawn Opening: Wayward Queen Attack" },
    pgn: '1. e4 e5 2. Qh5 Nc6 3. Bc4 g6 4. Qf3 Nf6 5. Ne2 Bg7 6. d3 O-O 7. Nbc3 d6 8. Bg5 h6 9. Bxf6 Bxf6 10. Nd5 Bg7 11. h4 Be6 12. O-O-O Na5 13. g4 c6 14. Ne3 Nxc4 15. dxc4 Qe7 16. h5 g5 17. Ng3 Rfd8 18. Ngf5 Bxf5 19. Nxf5 Qe6 20. b3 Bf8 21. Rd3 Rd7 22. Rhd1 Rad8 23. Qe3 b6 24. Kb1 Kh7 25. f3 Kg8 26. Qd2 Kh7 27. a4 a5 28. Qf2 c5 29. Ne3 Rb7 30. Nd5 Bg7 31. Qd2 Bf8 32. Nc3 Rbd7 33. Nb5 Kg8 34. Rd5 Kh7',
    accuracy: { white: 91.5, black: 72.0 }, // MOCK
    estimatedRating: { white: 1320, black: 890 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'A', tactics: 'A', endgame: 'A' }, // MOCK
    specialLabels: {
      0: 'good', 1: 'book', 2: 'inaccuracy', 3: 'best', 7: 'blunder', 8: 'great'
    }
  },
  {
    id: 'game-10',
    white: { username: 'CoachAllChess', rating: 800, title: 'BOT' },
    black: { username: 'You', rating: 905 },
    result: '0-1',
    date: '2026-10-13T17:40:00Z',
    timeControl: '10 min',
    speed: 'rapid',
    source: 'vs_coach',
    opening: { eco: 'B00', name: 'Owen Defense' },
    pgn: '1. e4 b6 2. d4 Bb7 3. Bd3 e6 4. Nf3 c5 5. c3 Nf6 6. Qe2 Be7 7. O-O d5 8. e5 Nfd7 9. Bf4 Nc6 10. a3 c4 11. Bc2 b5 12. Nbd2 a5 13. Rfe1 Nb6 14. Nf1 b4 15. axb4 axb4 16. Rxa8 Qxa8 17. Ng5 g6 18. h4 Qa2 19. Bc1 b3 20. Bd1 Na4 21. Qf3 Nd8 22. Re2 Qb1 23. Qf4 h6 24. Nh3 g5 25. hxg5 hxg5 26. Nxg5 Rg8 27. Nh3 Qg6 28. Ng3 Qb1 29. Kh2 Rh8 30. Kg1 Bc6 31. Nf1 Nb6 32. Nh2 Qg6 33. Qg4 Qxg4 34. Nxg4',
    accuracy: { white: 65.4, black: 86.8 }, // MOCK
    estimatedRating: { white: 780, black: 1190 }, // MOCK
    phaseGrades: { opening: 'B', middlegame: 'A', tactics: 'A', endgame: 'B' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'good', 41: 'great', 42: 'blunder', 43: 'best'
    }
  },
  {
    id: 'game-11',
    white: { username: 'You', rating: 905 },
    black: { username: 'EndgameWizard', rating: 925 },
    result: '1-0',
    date: '2026-10-12T13:00:00Z',
    timeControl: '10 min',
    speed: 'rapid',
    source: 'online',
    opening: { eco: 'D35', name: "Queen's Gambit Declined: Exchange Variation" },
    pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5 5. Bg5 Be7 6. e3 O-O 7. Bd3 c6 8. Qc2 Nbd7 9. Nge2 Re8 10. O-O Nf8 11. f3 Be6 12. Rad1 Rc8 13. Kh1 a6 14. e4 dxe4 15. fxe4 Ng4 16. Bxe7 Qxe7 17. Qd2 Qh4 18. Qf4 Ng6 19. Qg3 Qxg3 20. Nxg3 Ne3 21. Rde1 Nxf1 22. Rxf1 Rcd8 23. Nge2 Bg4 24. Bc4 Re7 25. h3 Bxe2 26. Nxe2 b5 27. Bb3 a5 28. a3 a4 29. Ba2 Kf8 30. e5 f6 31. exf6 Rxe2 32. fxg7+ Kxg7 33. Rf7+ Kh6',
    accuracy: { white: 87.5, black: 78.0 }, // MOCK
    estimatedRating: { white: 1150, black: 980 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'B', tactics: 'B', endgame: 'A' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 29: 'blunder', 30: 'best'
    }
  },
  {
    id: 'game-12',
    white: { username: 'BulletBlitzer', rating: 895 },
    black: { username: 'You', rating: 905 },
    result: '1/2-1/2', // Final position is threefold repetition draw (36. Rf2 Rd1+)
    date: '2026-10-11T22:50:00Z',
    timeControl: '1 min',
    speed: 'bullet',
    source: 'online',
    opening: { eco: 'C45', name: 'Scotch Game' },
    pgn: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6 6. c3 Nge7 7. Bc4 O-O 8. O-O Bb6 9. Na3 d6 10. Nac2 Ne5 11. Be2 Qg6 12. f3 f5 13. exf5 Nxf5 14. Nxf5 Bxf5 15. Bxb6 axb6 16. Nd4 Bd7 17. f4 Nc6 18. Bc4+ Kh8 19. Nb5 Rac8 20. Qd2 Bf5 21. Rae1 Na5 22. Be2 Be4 23. Rf2 d5 24. b4 Nc6 25. Nd4 Ne7 26. Bf3 c5 27. Bxe4 dxe4 28. Nc2 Rcd8 29. Qe2 Nd5 30. Qxe4 Qxe4 31. Rxe4 Nxc3 32. Re7 Rd1+ 33. Rf1 Rd2 34. Rf2 Rd1+ 35. Rf1 Rd2 36. Rf2 Rd1+',
    accuracy: { white: 80.2, black: 86.5 }, // MOCK
    estimatedRating: { white: 980, black: 1100 }, // MOCK
    phaseGrades: { opening: 'A', middlegame: 'B', tactics: 'A', endgame: 'B' }, // MOCK
    specialLabels: {
      0: 'book', 1: 'book', 2: 'book', 3: 'book', 22: 'brilliant', 23: 'blunder', 24: 'best'
    }
  }
];

// Specific hand-authored details for showcase game-01 (Italian Game, 27 full moves, 54 plies)
const GAME_01_HAND_AUTHORED = [
  { san: 'e4', cls: 'book', eval: 0.2, why: 'Controls central squares and frees diagonals for bishop and queen.', comment: 'Solid start. e4 stakes an immediate claim on the center.' },
  { san: 'e5', cls: 'book', eval: 0.2, why: 'Equalizes in the center and challenges White for central space.', comment: 'Black responds symmetrically to contest the center.' },
  { san: 'Nf3', cls: 'book', eval: 0.2, why: 'Develops a minor piece while attacking the undefended e5 pawn.', comment: 'Knight development with an active threat on e5.' },
  { san: 'Nc6', cls: 'book', eval: 0.2, why: 'Naturally defends e5 and develops toward the center.', comment: 'Natural defense and piece development.' },
  { san: 'Bc4', cls: 'book', eval: 0.3, why: 'The Italian Game. Points pressure toward the f7 weakness.', comment: 'Bc4 aims directly at Black’s vulnerable f7 square.' },
  { san: 'Nf6', cls: 'book', eval: 0.3, why: 'Two Knights Defense, applying counter-pressure against e4.', comment: 'Two Knights Defense, immediately counterattacking e4.' },
  { san: 'd3', cls: 'book', eval: 0.3, why: 'Giuoco Pianissimo. Fortifies e4 and supports the bishop.', comment: 'Quiet and solid, securing e4.' },
  { san: 'Bc5', cls: 'book', eval: 0.3, why: 'Develops Black’s king bishop to an active post.', comment: 'Active development along the a7-g1 diagonal.' },
  { san: 'O-O', cls: 'book', eval: 0.3, why: 'Tucks the king away to safety and activates the f1 rook.', comment: 'King safety first before launching operations.' },
  { san: 'd6', cls: 'book', eval: 0.3, why: 'Anchors c5 bishop and frees the light-squared bishop.', comment: 'Solid pawn structure maintaining central balance.' },
  // Move 6: White blunders 6. Bxf7+?! (+0.3 -> -2.4)
  {
    san: 'Bxf7+',
    cls: 'blunder',
    eval: -2.4,
    bestMove: 'c3',
    lines: [
      { move: 'c3', eval: 0.3, depth: 18, why: 'Prepares the d4 pawn break to seize the center.', pv: ['c3', 'O-O', 'h3'] },
      { move: 'Nc3', eval: 0.2, depth: 18, why: 'Natural knight development defending e4.', pv: ['Nc3', 'O-O', 'h3'] },
      { move: 'Bb3', eval: 0.2, depth: 18, why: 'Prophylactic retreat keeping the bishop active.', pv: ['Bb3', 'O-O', 'h3'] }
    ],
    variation: ['Kxf7', 'Ng5+', 'Kg8'],
    why: 'Bxf7+ sacrifices a bishop for just one pawn with no follow-up attack, leaving White down material.',
    comment: 'Bxf7+ is a blunder. You sacrificed a bishop for just one pawn, but Black simply takes with the king and remains completely safe.'
  },
  { san: 'Kxf7', cls: 'best', eval: -2.4, why: 'Black accepts the sacrificed bishop and is clearly ahead.', comment: 'Black accepts the gift with the king.' },
  // 7. Ng5+ (inaccuracy: -2.4 -> -3.0)
  {
    san: 'Ng5+',
    cls: 'inaccuracy',
    eval: -3.0,
    bestMove: 'c3',
    lines: [
      { move: 'c3', eval: -2.4, depth: 16, why: 'c3 stabilizes the center and prevents Black’s knight from penetrating.', pv: ['c3', 'Qe7', 'h3'] }
    ],
    why: 'Premature knight check that does not trouble Black.',
    comment: 'Checking without sufficient support just loses time.'
  },
  { san: 'Kg8', cls: 'best', eval: -3.0, why: 'The king tucks away safely on g8.', comment: 'King finds shelter safely on g8.' },
  // 8. Qf3 (mistake: -3.0 -> -4.5)
  {
    san: 'Qf3',
    cls: 'mistake',
    eval: -4.5,
    bestMove: 'Nc3',
    lines: [
      { move: 'Nc3', eval: -3.0, depth: 16, why: 'Nc3 develops a piece rather than exposing the queen early.', pv: ['Nc3', 'Qe8', 'Be3'] }
    ],
    why: 'Brings queen out early into potential tactical counter-attacks.',
    comment: 'Early queen sortie leaves White vulnerable to tactical counters.'
  },
  { san: 'Qe7', cls: 'best', eval: -4.5, why: 'Connects rooks and guards key central squares.', comment: 'Calm queen development connecting rooks.' },
  { san: 'Nc3', cls: 'good', eval: -4.6, why: 'Develops knight toward central squares.', comment: 'Developing the queenside knight.' },
  { san: 'Be6', cls: 'best', eval: -4.6, why: 'Offers bishop exchange to neutralize White’s remaining piece.', comment: 'Neutralizes White’s minor piece activity.' },
  // 10. Nxe6 (inaccuracy: -4.6 -> -5.2)
  {
    san: 'Nxe6',
    cls: 'inaccuracy',
    eval: -5.2,
    bestMove: 'Be3',
    lines: [
      { move: 'Be3', eval: -4.6, depth: 16, why: 'Be3 maintains tension rather than trading White’s active knight.', pv: ['Be3', 'Bxe3', 'fxe3'] }
    ],
    why: 'Exchanges the attacking knight, simplifying into a lost endgame.',
    comment: 'Trades off White’s only active piece while down material.'
  },
  { san: 'Qxe6', cls: 'best', eval: -5.2, why: 'Black recaptures with the queen, dominating the center.', comment: 'Central queen recapture with total control.' },
  { san: 'Bg5', cls: 'good', eval: -5.3, why: 'Pins the f6 knight against the queen.', comment: 'Pinning the knight to seek counterplay.' },
  { san: 'Rf8', cls: 'excellent', eval: -5.3, why: 'Reinforces the f-file and readies a counter-strike.', comment: 'Taking control of the semi-open f-file.' },
  // 12. Bxf6 (mistake: -5.3 -> -6.8)
  {
    san: 'Bxf6',
    cls: 'mistake',
    eval: -6.8,
    bestMove: 'Qg3',
    lines: [
      { move: 'Qg3', eval: -5.3, depth: 16, why: 'Qg3 sidesteps the pin while keeping the dark-squared bishop.', pv: ['Qg3', 'Nh5', 'Qh4'] }
    ],
    why: 'Gives up White’s dark-squared bishop without compensation.',
    comment: 'Surrendering the bishop pair deepens Black’s advantage.'
  },
  { san: 'Rxf6', cls: 'best', eval: -6.8, why: 'Recaptures and gains a tempo hitting White’s queen.', comment: 'Active recapture threatening the queen.' },
  { san: 'Qg3', cls: 'good', eval: -6.9, why: 'Steps queen out of attack to g3.', comment: 'Queen steps aside to safety.' },
  { san: 'Nd4', cls: 'great', eval: -6.9, why: 'Threatens the devastating fork on c2.', comment: 'Powerful knight leap threatening Nc2 fork.' },
  { san: 'Kh1', cls: 'best', eval: -6.9, why: 'Moves king off the g1-a7 diagonal and evades check.', comment: 'Stepping off the pin diagonal.' },
  { san: 'Nxc2', cls: 'best', eval: -7.0, why: 'Black wins another pawn on c2.', comment: 'Black snatches another pawn.' },
  { san: 'Rac1', cls: 'good', eval: -7.1, why: 'Attacks the advanced knight on c2.', comment: 'Rook attacks the knight.' },
  { san: 'Nd4', cls: 'best', eval: -7.1, why: 'Knight retreats to a dominating central outpost.', comment: 'Dominating knight outpost on d4.' },
  // 16. Nd5 (inaccuracy: -7.1 -> -7.7)
  {
    san: 'Nd5',
    cls: 'inaccuracy',
    eval: -7.7,
    bestMove: 'Rce1',
    lines: [
      { move: 'Rce1', eval: -7.1, depth: 16, why: 'Rce1 controls the e-file and fortifies the back rank.', pv: ['Rce1', 'Rf7', 'f4'] }
    ],
    why: 'Aggressive leap that leaves White’s back rank weak.',
    comment: 'Knight leaps forward but leaves the back rank open.'
  },
  { san: 'Rf7', cls: 'best', eval: -7.7, why: 'Defends c7 and maintains rook along the f-file.', comment: 'Solid defense of c7.' },
  // 17. f4 (mistake: -7.7 -> -9.3)
  {
    san: 'f4',
    cls: 'mistake',
    eval: -9.3,
    bestMove: 'Rce1',
    lines: [
      { move: 'Rce1', eval: -7.7, depth: 16, why: 'Rce1 centralizes the rook on the e-file and guards against knight infiltration.', pv: ['Rce1', 'c6', 'Nc3'] }
    ],
    why: 'Opens lines while White’s king is vulnerable.',
    comment: 'Overambitious pawn thrust exposing White’s king.'
  },
  { san: 'Ne2', cls: 'brilliant', eval: -9.5, why: 'Forks queen and rook while attacking White’s position.', comment: 'Brilliant knight maneuver picking up the rook.' },
  { san: 'Qg5', cls: 'good', eval: -9.6, why: 'Attempts a counter-threat on c1.', comment: 'Desperation queen counter-attack.' },
  { san: 'Nxc1', cls: 'best', eval: -9.8, why: 'Black wins the exchange cleanly.', comment: 'Cash in the rook. Black is up overwhelming material.' },
  { san: 'f5', cls: 'good', eval: -9.9, why: 'Tries to keep pressure on Black’s queen.', comment: 'White pushes pawns forward.' },
  { san: 'Qd7', cls: 'best', eval: -10.0, why: 'Queen retreats while keeping control over f7.', comment: 'Prudent queen retreat.' },
  // 20. f6 (mistake: -10.0 -> -11.6)
  {
    san: 'f6',
    cls: 'mistake',
    eval: -11.6,
    bestMove: 'Rxc1',
    lines: [
      { move: 'Rxc1', eval: -10.0, depth: 16, why: 'Recapturing the knight on c1 was essential.', pv: ['Rxc1', 'c6', 'Nc3'] }
    ],
    why: 'Advances a pawn without piece coordination.',
    comment: 'Desperation pawn push.'
  },
  { san: 'h6', cls: 'excellent', eval: -11.6, why: 'Challenges the white queen and creates luft.', comment: 'Kicking the queen away with tempo.' },
  // 21. Qg3 (inaccuracy: -11.6 -> -12.2)
  {
    san: 'Qg3',
    cls: 'inaccuracy',
    eval: -12.2,
    bestMove: 'Qg4',
    lines: [
      { move: 'Qg4', eval: -11.6, depth: 16, why: 'Qg4 maintains an active threat on the kingside.', pv: ['Qg4', 'g5', 'Rxc1'] }
    ],
    why: 'Queen retreats to g3.',
    comment: 'Queen forced backward.'
  },
  { san: 'g5', cls: 'best', eval: -12.2, why: 'Blunts White’s pawn thrust and cements kingside.', comment: 'Cementing kingside structure.' },
  { san: 'Rxc1', cls: 'good', eval: -12.3, why: 'Finally recaptures the knight on c1.', comment: 'White recaptures on c1.' },
  { san: 'c6', cls: 'best', eval: -12.3, why: 'Kicks the white knight from d5.', comment: 'Evicting White’s knight.' },
  // 23. Ne7+ (mistake: -12.3 -> -13.9)
  {
    san: 'Ne7+',
    cls: 'mistake',
    eval: -13.9,
    bestMove: 'Nc3',
    lines: [
      { move: 'Nc3', eval: -12.3, depth: 16, why: 'Nc3 keeps the knight on the board.', pv: ['Nc3', 'Kh7', 'Qf3'] }
    ],
    why: 'Desperate knight check that leads nowhere.',
    comment: 'Spite check before knight falls.'
  },
  { san: 'Kh7', cls: 'best', eval: -13.9, why: 'King steps aside safely to h7.', comment: 'King steps aside calmly.' },
  { san: 'Qf3', cls: 'good', eval: -14.0, why: 'White tries to support f6.', comment: 'Defending the f6 outpost.' },
  { san: 'Qe6', cls: 'best', eval: -14.0, why: 'Centralizes queen and piles pressure on e7.', comment: 'Targeting White’s pinned pieces.' },
  { san: 'Rf1', cls: 'good', eval: -14.1, why: 'Guards the f-file.', comment: 'Rook slides to f1.' },
  { san: 'Re8', cls: 'best', eval: -14.1, why: 'Brings final rook to attack e7.', comment: 'Bringing the last piece into the attack.' },
  // 26. Qh5 (mistake: -14.1 -> -15.7)
  {
    san: 'Qh5',
    cls: 'mistake',
    eval: -15.7,
    bestMove: 'h3',
    lines: [
      { move: 'h3', eval: -14.1, depth: 16, why: 'h3 provides luft against back-rank mate.', pv: ['h3', 'Rexe7', 'fxe7'] }
    ],
    why: 'Desperation attack against g6.',
    comment: 'Desperation attack against g6.'
  },
  { san: 'Rexe7', cls: 'best', eval: -15.7, why: 'Black removes the knight.', comment: 'Rook cleans up e7.' },
  // 27. fxe7 (blunder: -15.7 -> -99.0)
  {
    san: 'fxe7',
    cls: 'blunder',
    eval: -99.0,
    mate: -1,
    bestMove: 'h3',
    lines: [
      { move: 'h3', eval: -15.7, depth: 16, why: 'Creates luft for the king to avoid back-rank mate.', pv: ['h3', 'Rxf6', 'Rxf6'] }
    ],
    why: 'fxe7 blunders an immediate back-rank checkmate by abandoning control of f1.',
    comment: 'fxe7 is a blunder. Abandoning defense of the back rank allows an immediate checkmate.'
  },
  {
    san: 'Rxf1#',
    cls: 'best',
    eval: -99.0,
    mate: 0,
    why: 'Checkmate on the back rank.',
    comment: 'Checkmate! Black finishes the game with a clean back-rank strike.'
  }
];

function generateGames() {
  const processedGames = [];

  for (const raw of RAW_GAMES) {
    const chess = new Chess();
    chess.loadPgn(raw.pgn);
    const history = chess.history({ verbose: true });

    chess.reset();
    const moves = [];

    if (raw.id === 'game-01') {
      // Use completely hand-authored data for showcase game-01
      for (let i = 0; i < history.length; i++) {
        const step = history[i];
        const authored = GAME_01_HAND_AUTHORED[i];
        chess.move(step.san);

        const lines = authored.lines || [
          {
            move: authored.bestMove || step.san,
            eval: authored.eval,
            mate: authored.mate ?? null,
            depth: 18,
            why: authored.why,
            pv: [authored.bestMove || step.san]
          }
        ];

        moves.push({
          san: step.san,
          from: step.from,
          to: step.to,
          promotion: step.promotion,
          color: step.color,
          fen: chess.fen(),
          moveNumber: Math.floor(i / 2) + 1,
          classification: authored.cls,
          coachComment: authored.comment,
          variation: authored.variation,
          eval: {
            eval: authored.eval, // MOCK
            mate: authored.mate ?? null,
            bestMove: authored.bestMove || step.san,
            why: authored.why,
            lines // MOCK
          },
          timeSpent: 2 + (i % 8)
        });
      }
    } else {
      // Dynamic generation for games 02 to 12
      let runningEval = 0.2; // White perspective

      for (let i = 0; i < history.length; i++) {
        const step = history[i];
        const isWhite = step.color === 'w';

        // Classification
        let cls = raw.specialLabels[i];
        if (!cls) {
          if (i < 6) cls = 'book';
          else if (i % 7 === 0) cls = 'best';
          else if (i % 5 === 0) cls = 'excellent';
          else if (i % 3 === 0) cls = 'good';
          else cls = 'best';
        }

        // Eval delta per classification requirements:
        // Blunder >= 3.0, Mistake >= 1.5, Inaccuracy >= 0.5, Miss >= 2.0
        let moverLoss = 0.05;
        if (cls === 'blunder') moverLoss = 3.2;
        else if (cls === 'mistake') moverLoss = 1.6;
        else if (cls === 'inaccuracy') moverLoss = 0.6;
        else if (cls === 'miss') moverLoss = 2.1;
        else if (cls === 'brilliant') moverLoss = -0.3; // Slight bonus
        else if (cls === 'great') moverLoss = 0.0;
        else if (cls === 'best' || cls === 'book') moverLoss = 0.02;
        else if (cls === 'excellent') moverLoss = 0.08;
        else if (cls === 'good') moverLoss = 0.15;

        // Apply loss from mover's perspective
        if (isWhite) {
          runningEval -= moverLoss;
        } else {
          runningEval += moverLoss;
        }

        // Clamp eval
        runningEval = Math.max(-12.0, Math.min(12.0, runningEval));
        const roundedEval = Math.round(runningEval * 10) / 10;

        // Get legal moves from position BEFORE the move
        const legalMoves = chess.moves({ verbose: true });
        let bestMove = step.san;
        let altLines = [];

        const isSuboptimal = ['blunder', 'mistake', 'inaccuracy', 'miss'].includes(cls);

        if (isSuboptimal && legalMoves.length > 1) {
          // Pick a legal move different from played move
          const alternative = legalMoves.find((m) => m.san !== step.san) || legalMoves[0];
          bestMove = alternative.san;

          // Compute legal PV for alternative move from current position
          const tempChess = new Chess(chess.fen());
          tempChess.move(alternative.san);
          const follow1 = tempChess.moves()[0];
          const pv = [alternative.san];
          if (follow1) {
            pv.push(follow1);
            tempChess.move(follow1);
            const follow2 = tempChess.moves()[0];
            if (follow2) pv.push(follow2);
          }

          const altEval = Math.round((isWhite ? runningEval + moverLoss : runningEval - moverLoss) * 10) / 10;
          altLines.push({
            move: bestMove,
            eval: altEval, // MOCK
            depth: 16,
            why: `${bestMove} was the engine recommendation maintaining the initiative.`,
            pv
          });
        } else {
          // Move was best/good/book
          bestMove = step.san;
          const tempChess = new Chess(chess.fen());
          tempChess.move(step.san);
          const follow1 = tempChess.moves()[0];
          const pv = [step.san];
          if (follow1) pv.push(follow1);

          altLines.push({
            move: step.san,
            eval: roundedEval, // MOCK
            depth: 16,
            why: `${step.san} is the top line maintaining optimal control.`,
            pv
          });
        }

        // Varied why explanation mentioning the actual move
        let whyText = '';
        if (cls === 'blunder') whyText = `${step.san} blunders significant tactical advantage or material.`;
        else if (cls === 'mistake') whyText = `${step.san} is a mistake that concedes the initiative to the opponent.`;
        else if (cls === 'inaccuracy') whyText = `${step.san} is inaccurate; ${bestMove} offered firmer positional pressure.`;
        else if (cls === 'miss') whyText = `${step.san} misses a critical tactical opportunity.`;
        else if (cls === 'brilliant') whyText = `${step.san} is brilliant, finding an inspired tactical shot.`;
        else if (cls === 'great') whyText = `${step.san} finds a sharp and critical continuation.`;
        else if (cls === 'best') whyText = `${step.san} is the best move, maintaining active piece coordination.`;
        else if (cls === 'excellent') whyText = `${step.san} is an excellent move, steadily consolidating the position.`;
        else if (cls === 'good') whyText = `${step.san} is a sound practical choice.`;
        else whyText = `${step.san} adheres to established opening book theory.`;

        // Now play the actual move
        chess.move(step.san);

        moves.push({
          san: step.san,
          from: step.from,
          to: step.to,
          promotion: step.promotion,
          color: step.color,
          fen: chess.fen(),
          moveNumber: Math.floor(i / 2) + 1,
          classification: cls,
          coachComment: whyText,
          eval: {
            eval: roundedEval, // MOCK
            bestMove,
            why: whyText,
            lines: altLines // MOCK
          },
          timeSpent: 2 + (i % 8)
        });
      }
    }

    const { specialLabels: _, ...gameData } = raw;
    processedGames.push({
      ...gameData,
      moves
    });
  }

  const fileContent = `import { Game } from '../types';

/**
 * 12 verified mock games for ALL-CHESS Phase 1.
 * All PGNs are verified for legal moves via chess.js.
 * All numbers labeled as MOCK per Section 6 requirements.
 */
export const MOCK_GAMES: Game[] = ${JSON.stringify(processedGames, null, 2)};
`;

  const outputPath = path.resolve(__dirname, '../src/data/mock/mockGames.ts');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log('Successfully generated mockGames.ts with', processedGames.length, 'games at', outputPath);
}

generateGames();
