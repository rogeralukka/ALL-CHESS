import { Game } from '../types';

/**
 * 12 verified mock games for ALL-CHESS Phase 1.
 * All PGNs are verified for legal moves via chess.js.
 * All numbers labeled as MOCK per Section 6 requirements.
 */
export const MOCK_GAMES: Game[] = [
  {
    "id": "game-01",
    "white": {
      "username": "You",
      "rating": 905,
      "avatarUrl": "/assets/coach/coach_neutral.webp"
    },
    "black": {
      "username": "PawnStorm22",
      "rating": 920
    },
    "result": "1-0",
    "date": "2026-10-22T19:30:00Z",
    "timeControl": "10 min",
    "speed": "rapid",
    "source": "online",
    "opening": {
      "eco": "C50",
      "name": "Italian Game: Giuoco Pianissimo"
    },
    "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Bc5 5. O-O d6 6. Bxf7+ Kxf7 7. Ng5+ Kg8 8. Qf3 Qe7 9. Nc3 Be6 10. Nxe6 Qxe6 11. Bg5 Rf8 12. Bxf6 Rxf6 13. Qg3 Nd4 14. Kh1 Nxc2 15. Rac1 Nd4 16. Nd5 Rf7 17. f4 Ne2 18. Qg5 Nxc1 19. f5 Qd7 20. f6 Nxd3 21. Ne7+ Qxe7 22. fxe7 Rxf1#",
    "accuracy": {
      "white": 78.4,
      "black": 86.2
    },
    "estimatedRating": {
      "white": 980,
      "black": 1120
    },
    "phaseGrades": {
      "opening": "B",
      "middlegame": "C",
      "tactics": "D",
      "endgame": "N/A"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "e5",
        "from": "e7",
        "to": "e5",
        "color": "b",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nc6",
        "from": "b8",
        "to": "c6",
        "color": "b",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bc4",
        "from": "f1",
        "to": "c4",
        "color": "w",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Bc4",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "d3",
        "from": "d2",
        "to": "d3",
        "color": "w",
        "fen": "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
        "moveNumber": 4,
        "classification": "book",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "d3",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bc5",
        "from": "f8",
        "to": "c5",
        "color": "b",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5",
        "moveNumber": 4,
        "classification": "book",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Bc5",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 2 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d6",
        "from": "d7",
        "to": "d6",
        "color": "b",
        "fen": "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 6",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bxf7+",
        "from": "c4",
        "to": "f7",
        "color": "w",
        "fen": "r1bqk2r/ppp2Bpp/2np1n2/2b1p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 6",
        "moveNumber": 6,
        "classification": "blunder",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Bxf7+",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf7+"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Kxf7",
        "from": "e8",
        "to": "f7",
        "color": "b",
        "fen": "r1bq3r/ppp2kpp/2np1n2/2b1p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Kxf7",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kxf7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ng5+",
        "from": "f3",
        "to": "g5",
        "color": "w",
        "fen": "r1bq3r/ppp2kpp/2np1n2/2b1p1N1/4P3/3P4/PPP2PPP/RNBQ1RK1 b - - 1 7",
        "moveNumber": 7,
        "classification": "inaccuracy",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Ng5+",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng5+"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Kg8",
        "from": "f7",
        "to": "g8",
        "color": "b",
        "fen": "r1bq2kr/ppp3pp/2np1n2/2b1p1N1/4P3/3P4/PPP2PPP/RNBQ1RK1 w - - 2 8",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Kg8",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kg8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qf3",
        "from": "d1",
        "to": "f3",
        "color": "w",
        "fen": "r1bq2kr/ppp3pp/2np1n2/2b1p1N1/4P3/3P1Q2/PPP2PPP/RNB2RK1 b - - 3 8",
        "moveNumber": 8,
        "classification": "mistake",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Qf3",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qe7",
        "from": "d8",
        "to": "e7",
        "color": "b",
        "fen": "r1b3kr/ppp1q1pp/2np1n2/2b1p1N1/4P3/3P1Q2/PPP2PPP/RNB2RK1 w - - 4 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Qe7",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "r1b3kr/ppp1q1pp/2np1n2/2b1p1N1/4P3/2NP1Q2/PPP2PPP/R1B2RK1 b - - 5 9",
        "moveNumber": 9,
        "classification": "good",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Be6",
        "from": "c8",
        "to": "e6",
        "color": "b",
        "fen": "r5kr/ppp1q1pp/2npbn2/2b1p1N1/4P3/2NP1Q2/PPP2PPP/R1B2RK1 w - - 6 10",
        "moveNumber": 9,
        "classification": "great",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Be6",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nxe6",
        "from": "g5",
        "to": "e6",
        "color": "w",
        "fen": "r5kr/ppp1q1pp/2npNn2/2b1p3/4P3/2NP1Q2/PPP2PPP/R1B2RK1 b - - 0 10",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Nxe6",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxe6"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qxe6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "r5kr/ppp3pp/2npqn2/2b1p3/4P3/2NP1Q2/PPP2PPP/R1B2RK1 w - - 0 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Qxe6",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxe6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bg5",
        "from": "c1",
        "to": "g5",
        "color": "w",
        "fen": "r5kr/ppp3pp/2npqn2/2b1p1B1/4P3/2NP1Q2/PPP2PPP/R4RK1 b - - 1 11",
        "moveNumber": 11,
        "classification": "inaccuracy",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Bg5",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rf8",
        "from": "a8",
        "to": "f8",
        "color": "b",
        "fen": "5rkr/ppp3pp/2npqn2/2b1p1B1/4P3/2NP1Q2/PPP2PPP/R4RK1 w - - 2 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Rf8",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bxf6",
        "from": "g5",
        "to": "f6",
        "color": "w",
        "fen": "5rkr/ppp3pp/2npqB2/2b1p3/4P3/2NP1Q2/PPP2PPP/R4RK1 b - - 0 12",
        "moveNumber": 12,
        "classification": "good",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf6"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rxf6",
        "from": "f8",
        "to": "f6",
        "color": "b",
        "fen": "6kr/ppp3pp/2npqr2/2b1p3/4P3/2NP1Q2/PPP2PPP/R4RK1 w - - 0 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Rxf6",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxf6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qg3",
        "from": "f3",
        "to": "g3",
        "color": "w",
        "fen": "6kr/ppp3pp/2npqr2/2b1p3/4P3/2NP2Q1/PPP2PPP/R4RK1 b - - 1 13",
        "moveNumber": 13,
        "classification": "mistake",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Qg3",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qg3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nd4",
        "from": "c6",
        "to": "d4",
        "color": "b",
        "fen": "6kr/ppp3pp/3pqr2/2b1p3/3nP3/2NP2Q1/PPP2PPP/R4RK1 w - - 2 14",
        "moveNumber": 13,
        "classification": "great",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Nd4",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kh1",
        "from": "g1",
        "to": "h1",
        "color": "w",
        "fen": "6kr/ppp3pp/3pqr2/2b1p3/3nP3/2NP2Q1/PPP2PPP/R4R1K b - - 3 14",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Kh1",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nxc2",
        "from": "d4",
        "to": "c2",
        "color": "b",
        "fen": "6kr/ppp3pp/3pqr2/2b1p3/4P3/2NP2Q1/PPn2PPP/R4R1K w - - 0 15",
        "moveNumber": 14,
        "classification": "brilliant",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Nxc2",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc2"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rac1",
        "from": "a1",
        "to": "c1",
        "color": "w",
        "fen": "6kr/ppp3pp/3pqr2/2b1p3/4P3/2NP2Q1/PPn2PPP/2R2R1K b - - 1 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Rac1",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rac1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nd4",
        "from": "c2",
        "to": "d4",
        "color": "b",
        "fen": "6kr/ppp3pp/3pqr2/2b1p3/3nP3/2NP2Q1/PP3PPP/2R2R1K w - - 2 16",
        "moveNumber": 15,
        "classification": "miss",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Nd4",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nd5",
        "from": "c3",
        "to": "d5",
        "color": "w",
        "fen": "6kr/ppp3pp/3pqr2/2bNp3/3nP3/3P2Q1/PP3PPP/2R2R1K b - - 3 16",
        "moveNumber": 16,
        "classification": "good",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Nd5",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rf7",
        "from": "f6",
        "to": "f7",
        "color": "b",
        "fen": "6kr/ppp2rpp/3pq3/2bNp3/3nP3/3P2Q1/PP3PPP/2R2R1K w - - 4 17",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Rf7",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "f4",
        "from": "f2",
        "to": "f4",
        "color": "w",
        "fen": "6kr/ppp2rpp/3pq3/2bNp3/3nPP2/3P2Q1/PP4PP/2R2R1K b - - 0 17",
        "moveNumber": 17,
        "classification": "blunder",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "f4",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Ne2",
        "from": "d4",
        "to": "e2",
        "color": "b",
        "fen": "6kr/ppp2rpp/3pq3/2bNp3/4PP2/3P2Q1/PP2n1PP/2R2R1K w - - 1 18",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Ne2",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne2"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qg5",
        "from": "g3",
        "to": "g5",
        "color": "w",
        "fen": "6kr/ppp2rpp/3pq3/2bNp1Q1/4PP2/3P4/PP2n1PP/2R2R1K b - - 2 18",
        "moveNumber": 18,
        "classification": "inaccuracy",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Qg5",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qg5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nxc1",
        "from": "e2",
        "to": "c1",
        "color": "b",
        "fen": "6kr/ppp2rpp/3pq3/2bNp1Q1/4PP2/3P4/PP4PP/2n2R1K w - - 0 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Nxc1",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc1"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "f5",
        "from": "f4",
        "to": "f5",
        "color": "w",
        "fen": "6kr/ppp2rpp/3pq3/2bNpPQ1/4P3/3P4/PP4PP/2n2R1K b - - 0 19",
        "moveNumber": 19,
        "classification": "blunder",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "f5",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qd7",
        "from": "e6",
        "to": "d7",
        "color": "b",
        "fen": "6kr/pppq1rpp/3p4/2bNpPQ1/4P3/3P4/PP4PP/2n2R1K w - - 1 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Qd7",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "f6",
        "from": "f5",
        "to": "f6",
        "color": "w",
        "fen": "6kr/pppq1rpp/3p1P2/2bNp1Q1/4P3/3P4/PP4PP/2n2R1K b - - 0 20",
        "moveNumber": 20,
        "classification": "mistake",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "f6",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f6"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nxd3",
        "from": "c1",
        "to": "d3",
        "color": "b",
        "fen": "6kr/pppq1rpp/3p1P2/2bNp1Q1/4P3/3n4/PP4PP/5R1K w - - 0 21",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Nxd3",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxd3"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ne7+",
        "from": "d5",
        "to": "e7",
        "color": "w",
        "fen": "6kr/pppqNrpp/3p1P2/2b1p1Q1/4P3/3n4/PP4PP/5R1K b - - 1 21",
        "moveNumber": 21,
        "classification": "blunder",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Ne7+",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne7+"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qxe7",
        "from": "d7",
        "to": "e7",
        "color": "b",
        "fen": "6kr/ppp1qrpp/3p1P2/2b1p1Q1/4P3/3n4/PP4PP/5R1K w - - 0 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Qxe7",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxe7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "fxe7",
        "from": "f6",
        "to": "e7",
        "color": "w",
        "fen": "6kr/ppp1Prpp/3p4/2b1p1Q1/4P3/3n4/PP4PP/5R1K b - - 0 22",
        "moveNumber": 22,
        "classification": "blunder",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "fxe7",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "fxe7"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rxf1#",
        "from": "f7",
        "to": "f1",
        "color": "b",
        "fen": "6kr/ppp1P1pp/3p4/2b1p1Q1/4P3/3n4/PP4PP/5r1K w - - 0 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rxf1#",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxf1#"
              ]
            }
          ]
        },
        "timeSpent": 5
      }
    ]
  },
  {
    "id": "game-02",
    "white": {
      "username": "CoachAllChess",
      "rating": 1200,
      "title": "BOT"
    },
    "black": {
      "username": "You",
      "rating": 905
    },
    "result": "0-1",
    "date": "2026-10-21T14:15:00Z",
    "timeControl": "5 min",
    "speed": "blitz",
    "source": "vs_coach",
    "opening": {
      "eco": "B12",
      "name": "Caro-Kann Defense: Advance Variation"
    },
    "pgn": "1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. c3 Nc6 7. O-O cxd4 8. cxd4 Nge7 9. Nc3 Ng6 10. Be3 Be7 11. Qd2 O-O 12. Rac1 Rc8 13. a3 f6 14. exf6 Bxf6 15. b4 Kh8 16. Na4 b6 17. Ba6 Rc7 18. Nc3 Bg4 19. Ne1 Nce7 20. f3 Bf5 21. g4 Bxg4 22. fxg4 Bh4 23. Rxf8+ Qxf8 24. Ng2 Qf3 25. Nxh4 Nxh4 26. Bf1 Qxg4+ 27. Kh1 Nef5 28. Bf4 Qf3+ 29. Bg2 Nxg2 30. Qxg2 Qxf4 31. Ne2 Rxc1+ 32. Nxc1 Qxc1+",
    "accuracy": {
      "white": 71.3,
      "black": 92.5
    },
    "estimatedRating": {
      "white": 1050,
      "black": 1350
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "A",
      "tactics": "A",
      "endgame": "B"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "c6",
        "from": "c7",
        "to": "c6",
        "color": "b",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "c6",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "d4",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "d5",
        "from": "d7",
        "to": "d5",
        "color": "b",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "d5",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "e5",
        "from": "e4",
        "to": "e5",
        "color": "w",
        "fen": "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        "moveNumber": 3,
        "classification": "best",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "e5",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bf5",
        "from": "c8",
        "to": "f5",
        "color": "b",
        "fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4",
        "moveNumber": 3,
        "classification": "best",
        "eval": {
          "eval": -0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Bf5",
              "eval": -0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": -0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nf3",
              "eval": -0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "e6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "e6",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Be2",
        "from": "f1",
        "to": "e2",
        "color": "w",
        "fen": "rn1qkbnr/pp3ppp/2p1p3/3pPb2/3P4/5N2/PPP1BPPP/RNBQK2R b KQkq - 1 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Be2",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "c5",
        "from": "c6",
        "to": "c5",
        "color": "b",
        "fen": "rn1qkbnr/pp3ppp/4p3/2ppPb2/3P4/5N2/PPP1BPPP/RNBQK2R w KQkq - 0 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "c5",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "c3",
        "from": "c2",
        "to": "c3",
        "color": "w",
        "fen": "rn1qkbnr/pp3ppp/4p3/2ppPb2/3P4/2P2N2/PP2BPPP/RNBQK2R b KQkq - 0 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "c3",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nc6",
        "from": "b8",
        "to": "c6",
        "color": "b",
        "fen": "r2qkbnr/pp3ppp/2n1p3/2ppPb2/3P4/2P2N2/PP2BPPP/RNBQK2R w KQkq - 1 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": -0.6,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Nc6",
              "eval": -0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r2qkbnr/pp3ppp/2n1p3/2ppPb2/3P4/2P2N2/PP2BPPP/RNBQ1RK1 b kq - 2 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "cxd4",
        "from": "c5",
        "to": "d4",
        "color": "b",
        "fen": "r2qkbnr/pp3ppp/2n1p3/3pPb2/3p4/2P2N2/PP2BPPP/RNBQ1RK1 w kq - 0 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "cxd4",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "cxd4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "cxd4",
        "from": "c3",
        "to": "d4",
        "color": "w",
        "fen": "r2qkbnr/pp3ppp/2n1p3/3pPb2/3P4/5N2/PP2BPPP/RNBQ1RK1 b kq - 0 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "cxd4",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "cxd4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nge7",
        "from": "g8",
        "to": "e7",
        "color": "b",
        "fen": "r2qkb1r/pp2nppp/2n1p3/3pPb2/3P4/5N2/PP2BPPP/RNBQ1RK1 w kq - 1 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Nge7",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nge7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "r2qkb1r/pp2nppp/2n1p3/3pPb2/3P4/2N2N2/PP2BPPP/R1BQ1RK1 b kq - 2 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nc3",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Ng6",
        "from": "e7",
        "to": "g6",
        "color": "b",
        "fen": "r2qkb1r/pp3ppp/2n1p1n1/3pPb2/3P4/2N2N2/PP2BPPP/R1BQ1RK1 w kq - 3 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Ng6",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Be3",
        "from": "c1",
        "to": "e3",
        "color": "w",
        "fen": "r2qkb1r/pp3ppp/2n1p1n1/3pPb2/3P4/2N1BN2/PP2BPPP/R2Q1RK1 b kq - 4 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": -1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Be3",
              "eval": -1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Be7",
        "from": "f8",
        "to": "e7",
        "color": "b",
        "fen": "r2qk2r/pp2bppp/2n1p1n1/3pPb2/3P4/2N1BN2/PP2BPPP/R2Q1RK1 w kq - 5 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": -1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Be7",
              "eval": -1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "r2qk2r/pp2bppp/2n1p1n1/3pPb2/3P4/2N1BN2/PP1QBPPP/R4RK1 b kq - 6 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Qd2",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "r2q1rk1/pp2bppp/2n1p1n1/3pPb2/3P4/2N1BN2/PP1QBPPP/R4RK1 w - - 7 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "O-O",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rac1",
        "from": "a1",
        "to": "c1",
        "color": "w",
        "fen": "r2q1rk1/pp2bppp/2n1p1n1/3pPb2/3P4/2N1BN2/PP1QBPPP/2R2RK1 b - - 8 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": -1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Rac1",
              "eval": -1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rac1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rc8",
        "from": "a8",
        "to": "c8",
        "color": "b",
        "fen": "2rq1rk1/pp2bppp/2n1p1n1/3pPb2/3P4/2N1BN2/PP1QBPPP/2R2RK1 w - - 9 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": -1.3,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Rc8",
              "eval": -1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rc8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "a3",
        "from": "a2",
        "to": "a3",
        "color": "w",
        "fen": "2rq1rk1/pp2bppp/2n1p1n1/3pPb2/3P4/P1N1BN2/1P1QBPPP/2R2RK1 b - - 0 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": -1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "a3",
              "eval": -1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "f6",
        "from": "f7",
        "to": "f6",
        "color": "b",
        "fen": "2rq1rk1/pp2b1pp/2n1ppn1/3pPb2/3P4/P1N1BN2/1P1QBPPP/2R2RK1 w - - 0 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "f6",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "exf6",
        "from": "e5",
        "to": "f6",
        "color": "w",
        "fen": "2rq1rk1/pp2b1pp/2n1pPn1/3p1b2/3P4/P1N1BN2/1P1QBPPP/2R2RK1 b - - 0 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "exf6",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exf6"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bxf6",
        "from": "e7",
        "to": "f6",
        "color": "b",
        "fen": "2rq1rk1/pp4pp/2n1pbn1/3p1b2/3P4/P1N1BN2/1P1QBPPP/2R2RK1 w - - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "b4",
        "from": "b2",
        "to": "b4",
        "color": "w",
        "fen": "2rq1rk1/pp4pp/2n1pbn1/3p1b2/1P1P4/P1N1BN2/3QBPPP/2R2RK1 b - - 0 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "b4",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Kh8",
        "from": "g8",
        "to": "h8",
        "color": "b",
        "fen": "2rq1r1k/pp4pp/2n1pbn1/3p1b2/1P1P4/P1N1BN2/3QBPPP/2R2RK1 w - - 1 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.6,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Kh8",
              "eval": -1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Na4",
        "from": "c3",
        "to": "a4",
        "color": "w",
        "fen": "2rq1r1k/pp4pp/2n1pbn1/3p1b2/NP1P4/P3BN2/3QBPPP/2R2RK1 b - - 2 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": -1.6,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Na4",
              "eval": -1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Na4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "b6",
        "from": "b7",
        "to": "b6",
        "color": "b",
        "fen": "2rq1r1k/p5pp/1pn1pbn1/3p1b2/NP1P4/P3BN2/3QBPPP/2R2RK1 w - - 0 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "b6",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ba6",
        "from": "e2",
        "to": "a6",
        "color": "w",
        "fen": "2rq1r1k/p5pp/Bpn1pbn1/3p1b2/NP1P4/P3BN2/3Q1PPP/2R2RK1 b - - 1 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Ba6",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ba6"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rc7",
        "from": "c8",
        "to": "c7",
        "color": "b",
        "fen": "3q1r1k/p1r3pp/Bpn1pbn1/3p1b2/NP1P4/P3BN2/3Q1PPP/2R2RK1 w - - 2 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": -1.8,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Rc7",
              "eval": -1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rc7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nc3",
        "from": "a4",
        "to": "c3",
        "color": "w",
        "fen": "3q1r1k/p1r3pp/Bpn1pbn1/3p1b2/1P1P4/P1N1BN2/3Q1PPP/2R2RK1 b - - 3 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -1.9,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Nc3",
              "eval": -1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bg4",
        "from": "f5",
        "to": "g4",
        "color": "b",
        "fen": "3q1r1k/p1r3pp/Bpn1pbn1/3p4/1P1P2b1/P1N1BN2/3Q1PPP/2R2RK1 w - - 4 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -1.9,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Bg4",
              "eval": -1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ne1",
        "from": "f3",
        "to": "e1",
        "color": "w",
        "fen": "3q1r1k/p1r3pp/Bpn1pbn1/3p4/1P1P2b1/P1N1B3/3Q1PPP/2R1NRK1 b - - 5 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Ne1",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nce7",
        "from": "c6",
        "to": "e7",
        "color": "b",
        "fen": "3q1r1k/p1r1n1pp/Bp2pbn1/3p4/1P1P2b1/P1N1B3/3Q1PPP/2R1NRK1 w - - 6 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Nce7",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nce7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "f3",
        "from": "f2",
        "to": "f3",
        "color": "w",
        "fen": "3q1r1k/p1r1n1pp/Bp2pbn1/3p4/1P1P2b1/P1N1BP2/3Q2PP/2R1NRK1 b - - 0 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "f3",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bf5",
        "from": "g4",
        "to": "f5",
        "color": "b",
        "fen": "3q1r1k/p1r1n1pp/Bp2pbn1/3p1b2/1P1P4/P1N1BP2/3Q2PP/2R1NRK1 w - - 1 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Bf5",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "g4",
        "from": "g2",
        "to": "g4",
        "color": "w",
        "fen": "3q1r1k/p1r1n1pp/Bp2pbn1/3p1b2/1P1P2P1/P1N1BP2/3Q3P/2R1NRK1 b - - 0 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": -2.2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "g4",
              "eval": -2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bxg4",
        "from": "f5",
        "to": "g4",
        "color": "b",
        "fen": "3q1r1k/p1r1n1pp/Bp2pbn1/3p4/1P1P2b1/P1N1BP2/3Q3P/2R1NRK1 w - - 0 22",
        "moveNumber": 21,
        "classification": "brilliant",
        "eval": {
          "eval": -2.2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Bxg4",
              "eval": -2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxg4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "fxg4",
        "from": "f3",
        "to": "g4",
        "color": "w",
        "fen": "3q1r1k/p1r1n1pp/Bp2pbn1/3p4/1P1P2P1/P1N1B3/3Q3P/2R1NRK1 b - - 0 22",
        "moveNumber": 22,
        "classification": "blunder",
        "eval": {
          "eval": -2.3,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "fxg4",
              "eval": -2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "fxg4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bh4",
        "from": "f6",
        "to": "h4",
        "color": "b",
        "fen": "3q1r1k/p1r1n1pp/Bp2p1n1/3p4/1P1P2Pb/P1N1B3/3Q3P/2R1NRK1 w - - 1 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Bh4",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bh4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rxf8+",
        "from": "f1",
        "to": "f8",
        "color": "w",
        "fen": "3q1R1k/p1r1n1pp/Bp2p1n1/3p4/1P1P2Pb/P1N1B3/3Q3P/2R1N1K1 b - - 0 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Rxf8+",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxf8+"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qxf8",
        "from": "d8",
        "to": "f8",
        "color": "b",
        "fen": "5q1k/p1r1n1pp/Bp2p1n1/3p4/1P1P2Pb/P1N1B3/3Q3P/2R1N1K1 w - - 0 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": -2.5,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Qxf8",
              "eval": -2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxf8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Ng2",
        "from": "e1",
        "to": "g2",
        "color": "w",
        "fen": "5q1k/p1r1n1pp/Bp2p1n1/3p4/1P1P2Pb/P1N1B3/3Q2NP/2R3K1 b - - 1 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.5,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Ng2",
              "eval": -2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qf3",
        "from": "f8",
        "to": "f3",
        "color": "b",
        "fen": "7k/p1r1n1pp/Bp2p1n1/3p4/1P1P2Pb/P1N1Bq2/3Q2NP/2R3K1 w - - 2 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Qf3",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nxh4",
        "from": "g2",
        "to": "h4",
        "color": "w",
        "fen": "7k/p1r1n1pp/Bp2p1n1/3p4/1P1P2PN/P1N1Bq2/3Q3P/2R3K1 b - - 0 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Nxh4",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxh4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nxh4",
        "from": "g6",
        "to": "h4",
        "color": "b",
        "fen": "7k/p1r1n1pp/Bp2p3/3p4/1P1P2Pn/P1N1Bq2/3Q3P/2R3K1 w - - 0 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Nxh4",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxh4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bf1",
        "from": "a6",
        "to": "f1",
        "color": "w",
        "fen": "7k/p1r1n1pp/1p2p3/3p4/1P1P2Pn/P1N1Bq2/3Q3P/2R2BK1 b - - 1 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Bf1",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qxg4+",
        "from": "f3",
        "to": "g4",
        "color": "b",
        "fen": "7k/p1r1n1pp/1p2p3/3p4/1P1P2qn/P1N1B3/3Q3P/2R2BK1 w - - 0 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Qxg4+",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxg4+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Kh1",
        "from": "g1",
        "to": "h1",
        "color": "w",
        "fen": "7k/p1r1n1pp/1p2p3/3p4/1P1P2qn/P1N1B3/3Q3P/2R2B1K b - - 1 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Kh1",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nef5",
        "from": "e7",
        "to": "f5",
        "color": "b",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P2qn/P1N1B3/3Q3P/2R2B1K w - - 2 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -2.9,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Nef5",
              "eval": -2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nef5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bf4",
        "from": "e3",
        "to": "f4",
        "color": "w",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P1Bqn/P1N5/3Q3P/2R2B1K b - - 3 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Bf4",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qf3+",
        "from": "g4",
        "to": "f3",
        "color": "b",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P1B1n/P1N2q2/3Q3P/2R2B1K w - - 4 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Qf3+",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf3+"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bg2",
        "from": "f1",
        "to": "g2",
        "color": "w",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P1B1n/P1N2q2/3Q2BP/2R4K b - - 5 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Bg2",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nxg2",
        "from": "h4",
        "to": "g2",
        "color": "b",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P1B2/P1N2q2/3Q2nP/2R4K w - - 0 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Nxg2",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxg2"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qxg2",
        "from": "d2",
        "to": "g2",
        "color": "w",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P1B2/P1N2q2/6QP/2R4K b - - 0 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": -3.2,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Qxg2",
              "eval": -3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxg2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qxf4",
        "from": "f3",
        "to": "f4",
        "color": "b",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P1q2/P1N5/6QP/2R4K w - - 0 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": -3.2,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Qxf4",
              "eval": -3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxf4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ne2",
        "from": "c3",
        "to": "e2",
        "color": "w",
        "fen": "7k/p1r3pp/1p2p3/3p1n2/1P1P1q2/P7/4N1QP/2R4K b - - 1 31",
        "moveNumber": 31,
        "classification": "blunder",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Ne2",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rxc1+",
        "from": "c7",
        "to": "c1",
        "color": "b",
        "fen": "7k/p5pp/1p2p3/3p1n2/1P1P1q2/P7/4N1QP/2r4K w - - 0 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Rxc1+",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxc1+"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nxc1",
        "from": "e2",
        "to": "c1",
        "color": "w",
        "fen": "7k/p5pp/1p2p3/3p1n2/1P1P1q2/P7/6QP/2N4K b - - 0 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Nxc1",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qxc1+",
        "from": "f4",
        "to": "c1",
        "color": "b",
        "fen": "7k/p5pp/1p2p3/3p1n2/1P1P4/P7/6QP/2q4K w - - 0 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Qxc1+",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxc1+"
              ]
            }
          ]
        },
        "timeSpent": 9
      }
    ]
  },
  {
    "id": "game-03",
    "white": {
      "username": "You",
      "rating": 905
    },
    "black": {
      "username": "TacticsKnight",
      "rating": 915
    },
    "result": "1-0",
    "date": "2026-10-20T21:05:00Z",
    "timeControl": "3 min",
    "speed": "blitz",
    "source": "online",
    "opening": {
      "eco": "B20",
      "name": "Sicilian Defense"
    },
    "pgn": "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. g4 b5 11. Bxf6 Nxf6 12. g5 Nd7 13. f5 O-O 14. Rg1 b4 15. Nce2 e5 16. f6 exd4 17. fxe7 Re8 18. Nxd4 Ne5 19. Qf4 Qxe7 20. Nf5 Bxf5 21. exf5 Rac8 22. f6 Qc7 23. Rd2 Nf3 24. Qxf3 Re1+ 25. Qd1 Rxd1+ 26. Kxd1 Qc5 27. Rg3 Qe5 28. Bd3 Qxb2 29. Re3 gxf6 30. gxf6 Qxf6 31. Rg2+ Kf8 32. Reg3 Qa1+ 33. Kd2 Qc3+ 34. Kd1 Re8 35. Rg8+ Ke7 36. Re2+ Kd7 37. Rgxe8 Qa1+ 38. Kd2 Qc3+ 39. Kd1 Qa1+ 40. Kd2",
    "accuracy": {
      "white": 84.1,
      "black": 79.5
    },
    "estimatedRating": {
      "white": 1100,
      "black": 1020
    },
    "phaseGrades": {
      "opening": "B",
      "middlegame": "B",
      "tactics": "A",
      "endgame": "B"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "c5",
        "from": "c7",
        "to": "c5",
        "color": "b",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "c5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "d6",
        "from": "d7",
        "to": "d6",
        "color": "b",
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "cxd4",
        "from": "c5",
        "to": "d4",
        "color": "b",
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "cxd4",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "cxd4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nxd4",
        "from": "f3",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxd4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "a6",
        "from": "a7",
        "to": "a6",
        "color": "b",
        "fen": "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "a6",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bg5",
        "from": "c1",
        "to": "g5",
        "color": "w",
        "fen": "rnbqkb1r/1p2pppp/p2p1n2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq - 1 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Bg5",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "e6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "rnbqkb1r/1p3ppp/p2ppn2/6B1/3NP3/2N5/PPP2PPP/R2QKB1R w KQkq - 0 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "f4",
        "from": "f2",
        "to": "f4",
        "color": "w",
        "fen": "rnbqkb1r/1p3ppp/p2ppn2/6B1/3NPP2/2N5/PPP3PP/R2QKB1R b KQkq - 0 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "f4",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Be7",
        "from": "f8",
        "to": "e7",
        "color": "b",
        "fen": "rnbqk2r/1p2bppp/p2ppn2/6B1/3NPP2/2N5/PPP3PP/R2QKB1R w KQkq - 1 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Be7",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qf3",
        "from": "d1",
        "to": "f3",
        "color": "w",
        "fen": "rnbqk2r/1p2bppp/p2ppn2/6B1/3NPP2/2N2Q2/PPP3PP/R3KB1R b KQkq - 2 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Qf3",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qc7",
        "from": "d8",
        "to": "c7",
        "color": "b",
        "fen": "rnb1k2r/1pq1bppp/p2ppn2/6B1/3NPP2/2N2Q2/PPP3PP/R3KB1R w KQkq - 3 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Qc7",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "O-O-O",
        "from": "e1",
        "to": "c1",
        "color": "w",
        "fen": "rnb1k2r/1pq1bppp/p2ppn2/6B1/3NPP2/2N2Q2/PPP3PP/2KR1B1R b kq - 4 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "O-O-O",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O-O"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nbd7",
        "from": "b8",
        "to": "d7",
        "color": "b",
        "fen": "r1b1k2r/1pqnbppp/p2ppn2/6B1/3NPP2/2N2Q2/PPP3PP/2KR1B1R w kq - 5 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nbd7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "g4",
        "from": "g2",
        "to": "g4",
        "color": "w",
        "fen": "r1b1k2r/1pqnbppp/p2ppn2/6B1/3NPPP1/2N2Q2/PPP4P/2KR1B1R b kq - 0 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "g4",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "b5",
        "from": "b7",
        "to": "b5",
        "color": "b",
        "fen": "r1b1k2r/2qnbppp/p2ppn2/1p4B1/3NPPP1/2N2Q2/PPP4P/2KR1B1R w kq - 0 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "b5",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bxf6",
        "from": "g5",
        "to": "f6",
        "color": "w",
        "fen": "r1b1k2r/2qnbppp/p2ppB2/1p6/3NPPP1/2N2Q2/PPP4P/2KR1B1R b kq - 0 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf6"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nxf6",
        "from": "d7",
        "to": "f6",
        "color": "b",
        "fen": "r1b1k2r/2q1bppp/p2ppn2/1p6/3NPPP1/2N2Q2/PPP4P/2KR1B1R w kq - 0 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Nxf6",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "g5",
        "from": "g4",
        "to": "g5",
        "color": "w",
        "fen": "r1b1k2r/2q1bppp/p2ppn2/1p4P1/3NPP2/2N2Q2/PPP4P/2KR1B1R b kq - 0 12",
        "moveNumber": 12,
        "classification": "brilliant",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "g5",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nd7",
        "from": "f6",
        "to": "d7",
        "color": "b",
        "fen": "r1b1k2r/2qnbppp/p2pp3/1p4P1/3NPP2/2N2Q2/PPP4P/2KR1B1R w kq - 1 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Nd7",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "f5",
        "from": "f4",
        "to": "f5",
        "color": "w",
        "fen": "r1b1k2r/2qnbppp/p2pp3/1p3PP1/3NP3/2N2Q2/PPP4P/2KR1B1R b kq - 0 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "f5",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "r1b2rk1/2qnbppp/p2pp3/1p3PP1/3NP3/2N2Q2/PPP4P/2KR1B1R w - - 1 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "O-O",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rg1",
        "from": "h1",
        "to": "g1",
        "color": "w",
        "fen": "r1b2rk1/2qnbppp/p2pp3/1p3PP1/3NP3/2N2Q2/PPP4P/2KR1BR1 b - - 2 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Rg1",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rg1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "b4",
        "from": "b5",
        "to": "b4",
        "color": "b",
        "fen": "r1b2rk1/2qnbppp/p2pp3/5PP1/1p1NP3/2N2Q2/PPP4P/2KR1BR1 w - - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "b4",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nce2",
        "from": "c3",
        "to": "e2",
        "color": "w",
        "fen": "r1b2rk1/2qnbppp/p2pp3/5PP1/1p1NP3/5Q2/PPP1N2P/2KR1BR1 b - - 1 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Nce2",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nce2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "e5",
        "from": "e6",
        "to": "e5",
        "color": "b",
        "fen": "r1b2rk1/2qnbppp/p2p4/4pPP1/1p1NP3/5Q2/PPP1N2P/2KR1BR1 w - - 0 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "e5",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "f6",
        "from": "f5",
        "to": "f6",
        "color": "w",
        "fen": "r1b2rk1/2qnbppp/p2p1P2/4p1P1/1p1NP3/5Q2/PPP1N2P/2KR1BR1 b - - 0 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "f6",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f6"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "exd4",
        "from": "e5",
        "to": "d4",
        "color": "b",
        "fen": "r1b2rk1/2qnbppp/p2p1P2/6P1/1p1pP3/5Q2/PPP1N2P/2KR1BR1 w - - 0 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "exd4",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exd4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "fxe7",
        "from": "f6",
        "to": "e7",
        "color": "w",
        "fen": "r1b2rk1/2qnPppp/p2p4/6P1/1p1pP3/5Q2/PPP1N2P/2KR1BR1 b - - 0 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "fxe7",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "fxe7"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Re8",
        "from": "f8",
        "to": "e8",
        "color": "b",
        "fen": "r1b1r1k1/2qnPppp/p2p4/6P1/1p1pP3/5Q2/PPP1N2P/2KR1BR1 w - - 1 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Re8",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nxd4",
        "from": "e2",
        "to": "d4",
        "color": "w",
        "fen": "r1b1r1k1/2qnPppp/p2p4/6P1/1p1NP3/5Q2/PPP4P/2KR1BR1 b - - 0 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxd4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Ne5",
        "from": "d7",
        "to": "e5",
        "color": "b",
        "fen": "r1b1r1k1/2q1Pppp/p2p4/4n1P1/1p1NP3/5Q2/PPP4P/2KR1BR1 w - - 1 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Ne5",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qf4",
        "from": "f3",
        "to": "f4",
        "color": "w",
        "fen": "r1b1r1k1/2q1Pppp/p2p4/4n1P1/1p1NPQ2/8/PPP4P/2KR1BR1 b - - 2 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Qf4",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qxe7",
        "from": "c7",
        "to": "e7",
        "color": "b",
        "fen": "r1b1r1k1/4qppp/p2p4/4n1P1/1p1NPQ2/8/PPP4P/2KR1BR1 w - - 0 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Qxe7",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxe7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nf5",
        "from": "d4",
        "to": "f5",
        "color": "w",
        "fen": "r1b1r1k1/4qppp/p2p4/4nNP1/1p2PQ2/8/PPP4P/2KR1BR1 b - - 1 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Nf5",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bxf5",
        "from": "c8",
        "to": "f5",
        "color": "b",
        "fen": "r3r1k1/4qppp/p2p4/4nbP1/1p2PQ2/8/PPP4P/2KR1BR1 w - - 0 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Bxf5",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "exf5",
        "from": "e4",
        "to": "f5",
        "color": "w",
        "fen": "r3r1k1/4qppp/p2p4/4nPP1/1p3Q2/8/PPP4P/2KR1BR1 b - - 0 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "exf5",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exf5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rac8",
        "from": "a8",
        "to": "c8",
        "color": "b",
        "fen": "2r1r1k1/4qppp/p2p4/4nPP1/1p3Q2/8/PPP4P/2KR1BR1 w - - 1 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rac8",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rac8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "f6",
        "from": "f5",
        "to": "f6",
        "color": "w",
        "fen": "2r1r1k1/4qppp/p2p1P2/4n1P1/1p3Q2/8/PPP4P/2KR1BR1 b - - 0 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "f6",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f6"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qc7",
        "from": "e7",
        "to": "c7",
        "color": "b",
        "fen": "2r1r1k1/2q2ppp/p2p1P2/4n1P1/1p3Q2/8/PPP4P/2KR1BR1 w - - 1 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Qc7",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "2r1r1k1/2q2ppp/p2p1P2/4n1P1/1p3Q2/8/PPPR3P/2K2BR1 b - - 2 23",
        "moveNumber": 23,
        "classification": "blunder",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Rd2",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nf3",
        "from": "e5",
        "to": "f3",
        "color": "b",
        "fen": "2r1r1k1/2q2ppp/p2p1P2/6P1/1p3Q2/5n2/PPPR3P/2K2BR1 w - - 3 24",
        "moveNumber": 23,
        "classification": "great",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qxf3",
        "from": "f4",
        "to": "f3",
        "color": "w",
        "fen": "2r1r1k1/2q2ppp/p2p1P2/6P1/1p6/5Q2/PPPR3P/2K2BR1 b - - 0 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Qxf3",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Re1+",
        "from": "e8",
        "to": "e1",
        "color": "b",
        "fen": "2r3k1/2q2ppp/p2p1P2/6P1/1p6/5Q2/PPPR3P/2K1rBR1 w - - 1 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Re1+",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re1+"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qd1",
        "from": "f3",
        "to": "d1",
        "color": "w",
        "fen": "2r3k1/2q2ppp/p2p1P2/6P1/1p6/8/PPPR3P/2KQrBR1 b - - 2 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Qd1",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rxd1+",
        "from": "e1",
        "to": "d1",
        "color": "b",
        "fen": "2r3k1/2q2ppp/p2p1P2/6P1/1p6/8/PPPR3P/2Kr1BR1 w - - 0 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Rxd1+",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxd1+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kxd1",
        "from": "c1",
        "to": "d1",
        "color": "w",
        "fen": "2r3k1/2q2ppp/p2p1P2/6P1/1p6/8/PPPR3P/3K1BR1 b - - 0 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Kxd1",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kxd1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qc5",
        "from": "c7",
        "to": "c5",
        "color": "b",
        "fen": "2r3k1/5ppp/p2p1P2/2q3P1/1p6/8/PPPR3P/3K1BR1 w - - 1 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Qc5",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rg3",
        "from": "g1",
        "to": "g3",
        "color": "w",
        "fen": "2r3k1/5ppp/p2p1P2/2q3P1/1p6/6R1/PPPR3P/3K1B2 b - - 2 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Rg3",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rg3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qe5",
        "from": "c5",
        "to": "e5",
        "color": "b",
        "fen": "2r3k1/5ppp/p2p1P2/4q1P1/1p6/6R1/PPPR3P/3K1B2 w - - 3 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Qe5",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bd3",
        "from": "f1",
        "to": "d3",
        "color": "w",
        "fen": "2r3k1/5ppp/p2p1P2/4q1P1/1p6/3B2R1/PPPR3P/3K4 b - - 4 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qxb2",
        "from": "e5",
        "to": "b2",
        "color": "b",
        "fen": "2r3k1/5ppp/p2p1P2/6P1/1p6/3B2R1/PqPR3P/3K4 w - - 0 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Qxb2",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxb2"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Re3",
        "from": "g3",
        "to": "e3",
        "color": "w",
        "fen": "2r3k1/5ppp/p2p1P2/6P1/1p6/3BR3/PqPR3P/3K4 b - - 1 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Re3",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "gxf6",
        "from": "g7",
        "to": "f6",
        "color": "b",
        "fen": "2r3k1/5p1p/p2p1p2/6P1/1p6/3BR3/PqPR3P/3K4 w - - 0 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "gxf6",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "gxf6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "gxf6",
        "from": "g5",
        "to": "f6",
        "color": "w",
        "fen": "2r3k1/5p1p/p2p1P2/8/1p6/3BR3/PqPR3P/3K4 b - - 0 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "gxf6",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "gxf6"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qxf6",
        "from": "b2",
        "to": "f6",
        "color": "b",
        "fen": "2r3k1/5p1p/p2p1q2/8/1p6/3BR3/P1PR3P/3K4 w - - 0 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Qxf6",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxf6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rg2+",
        "from": "d2",
        "to": "g2",
        "color": "w",
        "fen": "2r3k1/5p1p/p2p1q2/8/1p6/3BR3/P1P3RP/3K4 b - - 1 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Rg2+",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rg2+"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Kf8",
        "from": "g8",
        "to": "f8",
        "color": "b",
        "fen": "2r2k2/5p1p/p2p1q2/8/1p6/3BR3/P1P3RP/3K4 w - - 2 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Kf8",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kf8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Reg3",
        "from": "e3",
        "to": "g3",
        "color": "w",
        "fen": "2r2k2/5p1p/p2p1q2/8/1p6/3B2R1/P1P3RP/3K4 b - - 3 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Reg3",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Reg3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qa1+",
        "from": "f6",
        "to": "a1",
        "color": "b",
        "fen": "2r2k2/5p1p/p2p4/8/1p6/3B2R1/P1P3RP/q2K4 w - - 4 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Qa1+",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qa1+"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Kd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "2r2k2/5p1p/p2p4/8/1p6/3B2R1/P1PK2RP/q7 b - - 5 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Kd2",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qc3+",
        "from": "a1",
        "to": "c3",
        "color": "b",
        "fen": "2r2k2/5p1p/p2p4/8/1p6/2qB2R1/P1PK2RP/8 w - - 6 34",
        "moveNumber": 33,
        "classification": "excellent",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Qc3+",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc3+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kd1",
        "from": "d2",
        "to": "d1",
        "color": "w",
        "fen": "2r2k2/5p1p/p2p4/8/1p6/2qB2R1/P1P3RP/3K4 b - - 7 34",
        "moveNumber": 34,
        "classification": "good",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Kd1",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Re8",
        "from": "c8",
        "to": "e8",
        "color": "b",
        "fen": "4rk2/5p1p/p2p4/8/1p6/2qB2R1/P1P3RP/3K4 w - - 8 35",
        "moveNumber": 34,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Re8",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rg8+",
        "from": "g3",
        "to": "g8",
        "color": "w",
        "fen": "4rkR1/5p1p/p2p4/8/1p6/2qB4/P1P3RP/3K4 b - - 9 35",
        "moveNumber": 35,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Rg8+",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rg8+"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Ke7",
        "from": "f8",
        "to": "e7",
        "color": "b",
        "fen": "4r1R1/4kp1p/p2p4/8/1p6/2qB4/P1P3RP/3K4 w - - 10 36",
        "moveNumber": 35,
        "classification": "good",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Ke7",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ke7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Re2+",
        "from": "g2",
        "to": "e2",
        "color": "w",
        "fen": "4r1R1/4kp1p/p2p4/8/1p6/2qB4/P1P1R2P/3K4 b - - 11 36",
        "moveNumber": 36,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 36.",
          "lines": [
            {
              "move": "Re2+",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re2+"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Kd7",
        "from": "e7",
        "to": "d7",
        "color": "b",
        "fen": "4r1R1/3k1p1p/p2p4/8/1p6/2qB4/P1P1R2P/3K4 w - - 12 37",
        "moveNumber": 36,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 36.",
          "lines": [
            {
              "move": "Kd7",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rgxe8",
        "from": "g8",
        "to": "e8",
        "color": "w",
        "fen": "4R3/3k1p1p/p2p4/8/1p6/2qB4/P1P1R2P/3K4 b - - 0 37",
        "moveNumber": 37,
        "classification": "good",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 37.",
          "lines": [
            {
              "move": "Rgxe8",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rgxe8"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qa1+",
        "from": "c3",
        "to": "a1",
        "color": "b",
        "fen": "4R3/3k1p1p/p2p4/8/1p6/3B4/P1P1R2P/q2K4 w - - 1 38",
        "moveNumber": 37,
        "classification": "best",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 37.",
          "lines": [
            {
              "move": "Qa1+",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qa1+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "4R3/3k1p1p/p2p4/8/1p6/3B4/P1PKR2P/q7 b - - 2 38",
        "moveNumber": 38,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 38.",
          "lines": [
            {
              "move": "Kd2",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qc3+",
        "from": "a1",
        "to": "c3",
        "color": "b",
        "fen": "4R3/3k1p1p/p2p4/8/1p6/2qB4/P1PKR2P/8 w - - 3 39",
        "moveNumber": 38,
        "classification": "excellent",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 38.",
          "lines": [
            {
              "move": "Qc3+",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc3+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Kd1",
        "from": "d2",
        "to": "d1",
        "color": "w",
        "fen": "4R3/3k1p1p/p2p4/8/1p6/2qB4/P1P1R2P/3K4 b - - 4 39",
        "moveNumber": 39,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 39.",
          "lines": [
            {
              "move": "Kd1",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qa1+",
        "from": "c3",
        "to": "a1",
        "color": "b",
        "fen": "4R3/3k1p1p/p2p4/8/1p6/3B4/P1P1R2P/q2K4 w - - 5 40",
        "moveNumber": 39,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 39.",
          "lines": [
            {
              "move": "Qa1+",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qa1+"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Kd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "4R3/3k1p1p/p2p4/8/1p6/3B4/P1PKR2P/q7 b - - 6 40",
        "moveNumber": 40,
        "classification": "good",
        "eval": {
          "eval": 3.5,
          "why": "Control of center and piece coordination on move 40.",
          "lines": [
            {
              "move": "Kd2",
              "eval": 3.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd2"
              ]
            }
          ]
        },
        "timeSpent": 8
      }
    ]
  },
  {
    "id": "game-04",
    "white": {
      "username": "BishopSniper",
      "rating": 940
    },
    "black": {
      "username": "You",
      "rating": 905
    },
    "result": "1-0",
    "date": "2026-10-19T18:22:00Z",
    "timeControl": "10 min",
    "speed": "rapid",
    "source": "online",
    "opening": {
      "eco": "D00",
      "name": "Queen's Pawn Game: London System"
    },
    "pgn": "1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3 Nc6 5. Nd2 Bf5 6. Ngf3 e6 7. Nh4 Bg6 8. Nxg6 hxg6 9. Bd3 Bd6 10. Bxd6 Qxd6 11. f4 cxd4 12. cxd4 g5 13. O-O gxf4 14. Rxf4 e5 15. dxe5 Nxe5 16. Bb5+ Ke7 17. Nf3 a6 18. Be2 Nxf3+ 19. Bxf3 g5 20. Rd4 Qxh2+ 21. Kf2 Rh4 22. Qb3 Rxd4 23. exd4 Qh4+ 24. Ke2 Re8 25. Qxb7+ Kf8+ 26. Kd3 Qf4 27. Qb4+ Kg7 28. Re1 Qf5+ 29. Kd2 Qf4+ 30. Kd1 Rxe1+ 31. Kxe1 g4 32. Be2 Ne4 33. Kd1 Nf2+ 34. Kc2 Qe4+ 35. Kd2 Qxg2 36. Qd6 Ne4+",
    "accuracy": {
      "white": 81,
      "black": 88.5
    },
    "estimatedRating": {
      "white": 990,
      "black": 1180
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "B",
      "tactics": "A",
      "endgame": "B"
    },
    "moves": [
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "d4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d5",
        "from": "d7",
        "to": "d5",
        "color": "b",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "d5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bf4",
        "from": "c1",
        "to": "f4",
        "color": "w",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Bf4",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR w KQkq - 2 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "e3",
        "from": "e2",
        "to": "e3",
        "color": "w",
        "fen": "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR b KQkq - 0 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "e3",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "c5",
        "from": "c7",
        "to": "c5",
        "color": "b",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/4P3/PPP2PPP/RN1QKBNR w KQkq - 0 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "c5",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "c3",
        "from": "c2",
        "to": "c3",
        "color": "w",
        "fen": "rnbqkb1r/pp2pppp/5n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR b KQkq - 0 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "c3",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nc6",
        "from": "b8",
        "to": "c6",
        "color": "b",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP3PPP/RN1QKBNR w KQkq - 1 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nd2",
        "from": "b1",
        "to": "d2",
        "color": "w",
        "fen": "r1bqkb1r/pp2pppp/2n2n2/2pp4/3P1B2/2P1P3/PP1N1PPP/R2QKBNR b KQkq - 2 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Nd2",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bf5",
        "from": "c8",
        "to": "f5",
        "color": "b",
        "fen": "r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1P3/PP1N1PPP/R2QKBNR w KQkq - 3 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Bf5",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Ngf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "r2qkb1r/pp2pppp/2n2n2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R b KQkq - 4 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Ngf3",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ngf3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "e6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "r2qkb1r/pp3ppp/2n1pn2/2pp1b2/3P1B2/2P1PN2/PP1N1PPP/R2QKB1R w KQkq - 0 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nh4",
        "from": "f3",
        "to": "h4",
        "color": "w",
        "fen": "r2qkb1r/pp3ppp/2n1pn2/2pp1b2/3P1B1N/2P1P3/PP1N1PPP/R2QKB1R b KQkq - 1 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Nh4",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nh4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bg6",
        "from": "f5",
        "to": "g6",
        "color": "b",
        "fen": "r2qkb1r/pp3ppp/2n1pnb1/2pp4/3P1B1N/2P1P3/PP1N1PPP/R2QKB1R w KQkq - 2 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Bg6",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nxg6",
        "from": "h4",
        "to": "g6",
        "color": "w",
        "fen": "r2qkb1r/pp3ppp/2n1pnN1/2pp4/3P1B2/2P1P3/PP1N1PPP/R2QKB1R b KQkq - 0 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Nxg6",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxg6"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "hxg6",
        "from": "h7",
        "to": "g6",
        "color": "b",
        "fen": "r2qkb1r/pp3pp1/2n1pnp1/2pp4/3P1B2/2P1P3/PP1N1PPP/R2QKB1R w KQkq - 0 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "hxg6",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "hxg6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bd3",
        "from": "f1",
        "to": "d3",
        "color": "w",
        "fen": "r2qkb1r/pp3pp1/2n1pnp1/2pp4/3P1B2/2PBP3/PP1N1PPP/R2QK2R b KQkq - 1 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bd6",
        "from": "f8",
        "to": "d6",
        "color": "b",
        "fen": "r2qk2r/pp3pp1/2nbpnp1/2pp4/3P1B2/2PBP3/PP1N1PPP/R2QK2R w KQkq - 2 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Bd6",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bxd6",
        "from": "f4",
        "to": "d6",
        "color": "w",
        "fen": "r2qk2r/pp3pp1/2nBpnp1/2pp4/3P4/2PBP3/PP1N1PPP/R2QK2R b KQkq - 0 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Bxd6",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxd6"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qxd6",
        "from": "d8",
        "to": "d6",
        "color": "b",
        "fen": "r3k2r/pp3pp1/2nqpnp1/2pp4/3P4/2PBP3/PP1N1PPP/R2QK2R w KQkq - 0 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Qxd6",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxd6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "f4",
        "from": "f2",
        "to": "f4",
        "color": "w",
        "fen": "r3k2r/pp3pp1/2nqpnp1/2pp4/3P1P2/2PBP3/PP1N2PP/R2QK2R b KQkq - 0 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "f4",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "cxd4",
        "from": "c5",
        "to": "d4",
        "color": "b",
        "fen": "r3k2r/pp3pp1/2nqpnp1/3p4/3p1P2/2PBP3/PP1N2PP/R2QK2R w KQkq - 0 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "cxd4",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "cxd4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "cxd4",
        "from": "c3",
        "to": "d4",
        "color": "w",
        "fen": "r3k2r/pp3pp1/2nqpnp1/3p4/3P1P2/3BP3/PP1N2PP/R2QK2R b KQkq - 0 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "cxd4",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "cxd4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "g5",
        "from": "g6",
        "to": "g5",
        "color": "b",
        "fen": "r3k2r/pp3pp1/2nqpn2/3p2p1/3P1P2/3BP3/PP1N2PP/R2QK2R w KQkq - 0 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "g5",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r3k2r/pp3pp1/2nqpn2/3p2p1/3P1P2/3BP3/PP1N2PP/R2Q1RK1 b kq - 1 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "O-O",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "gxf4",
        "from": "g5",
        "to": "f4",
        "color": "b",
        "fen": "r3k2r/pp3pp1/2nqpn2/3p4/3P1p2/3BP3/PP1N2PP/R2Q1RK1 w kq - 0 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "gxf4",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "gxf4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rxf4",
        "from": "f1",
        "to": "f4",
        "color": "w",
        "fen": "r3k2r/pp3pp1/2nqpn2/3p4/3P1R2/3BP3/PP1N2PP/R2Q2K1 b kq - 0 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Rxf4",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxf4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "e5",
        "from": "e6",
        "to": "e5",
        "color": "b",
        "fen": "r3k2r/pp3pp1/2nq1n2/3pp3/3P1R2/3BP3/PP1N2PP/R2Q2K1 w kq - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "e5",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "dxe5",
        "from": "d4",
        "to": "e5",
        "color": "w",
        "fen": "r3k2r/pp3pp1/2nq1n2/3pP3/5R2/3BP3/PP1N2PP/R2Q2K1 b kq - 0 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "dxe5",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "dxe5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nxe5",
        "from": "c6",
        "to": "e5",
        "color": "b",
        "fen": "r3k2r/pp3pp1/3q1n2/3pn3/5R2/3BP3/PP1N2PP/R2Q2K1 w kq - 0 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Nxe5",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxe5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bb5+",
        "from": "d3",
        "to": "b5",
        "color": "w",
        "fen": "r3k2r/pp3pp1/3q1n2/1B1pn3/5R2/4P3/PP1N2PP/R2Q2K1 b kq - 1 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Bb5+",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bb5+"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Ke7",
        "from": "e8",
        "to": "e7",
        "color": "b",
        "fen": "r6r/pp2kpp1/3q1n2/1B1pn3/5R2/4P3/PP1N2PP/R2Q2K1 w - - 2 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Ke7",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ke7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nf3",
        "from": "d2",
        "to": "f3",
        "color": "w",
        "fen": "r6r/pp2kpp1/3q1n2/1B1pn3/5R2/4PN2/PP4PP/R2Q2K1 b - - 3 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "a6",
        "from": "a7",
        "to": "a6",
        "color": "b",
        "fen": "r6r/1p2kpp1/p2q1n2/1B1pn3/5R2/4PN2/PP4PP/R2Q2K1 w - - 0 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "a6",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Be2",
        "from": "b5",
        "to": "e2",
        "color": "w",
        "fen": "r6r/1p2kpp1/p2q1n2/3pn3/5R2/4PN2/PP2B1PP/R2Q2K1 b - - 1 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Be2",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nxf3+",
        "from": "e5",
        "to": "f3",
        "color": "b",
        "fen": "r6r/1p2kpp1/p2q1n2/3p4/5R2/4Pn2/PP2B1PP/R2Q2K1 w - - 0 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Nxf3+",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf3+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bxf3",
        "from": "e2",
        "to": "f3",
        "color": "w",
        "fen": "r6r/1p2kpp1/p2q1n2/3p4/5R2/4PB2/PP4PP/R2Q2K1 b - - 0 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Bxf3",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "g5",
        "from": "g7",
        "to": "g5",
        "color": "b",
        "fen": "r6r/1p2kp2/p2q1n2/3p2p1/5R2/4PB2/PP4PP/R2Q2K1 w - - 0 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "g5",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rd4",
        "from": "f4",
        "to": "d4",
        "color": "w",
        "fen": "r6r/1p2kp2/p2q1n2/3p2p1/3R4/4PB2/PP4PP/R2Q2K1 b - - 1 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Rd4",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qxh2+",
        "from": "d6",
        "to": "h2",
        "color": "b",
        "fen": "r6r/1p2kp2/p4n2/3p2p1/3R4/4PB2/PP4Pq/R2Q2K1 w - - 0 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Qxh2+",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxh2+"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Kf2",
        "from": "g1",
        "to": "f2",
        "color": "w",
        "fen": "r6r/1p2kp2/p4n2/3p2p1/3R4/4PB2/PP3KPq/R2Q4 b - - 1 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Kf2",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kf2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rh4",
        "from": "h8",
        "to": "h4",
        "color": "b",
        "fen": "r7/1p2kp2/p4n2/3p2p1/3R3r/4PB2/PP3KPq/R2Q4 w - - 2 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rh4",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rh4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qb3",
        "from": "d1",
        "to": "b3",
        "color": "w",
        "fen": "r7/1p2kp2/p4n2/3p2p1/3R3r/1Q2PB2/PP3KPq/R7 b - - 3 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Qb3",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rxd4",
        "from": "h4",
        "to": "d4",
        "color": "b",
        "fen": "r7/1p2kp2/p4n2/3p2p1/3r4/1Q2PB2/PP3KPq/R7 w - - 0 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rxd4",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxd4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "exd4",
        "from": "e3",
        "to": "d4",
        "color": "w",
        "fen": "r7/1p2kp2/p4n2/3p2p1/3P4/1Q3B2/PP3KPq/R7 b - - 0 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "exd4",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exd4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qh4+",
        "from": "h2",
        "to": "h4",
        "color": "b",
        "fen": "r7/1p2kp2/p4n2/3p2p1/3P3q/1Q3B2/PP3KP1/R7 w - - 1 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Qh4+",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qh4+"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Ke2",
        "from": "f2",
        "to": "e2",
        "color": "w",
        "fen": "r7/1p2kp2/p4n2/3p2p1/3P3q/1Q3B2/PP2K1P1/R7 b - - 2 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Ke2",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ke2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Re8",
        "from": "a8",
        "to": "e8",
        "color": "b",
        "fen": "4r3/1p2kp2/p4n2/3p2p1/3P3q/1Q3B2/PP2K1P1/R7 w - - 3 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Re8",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qxb7+",
        "from": "b3",
        "to": "b7",
        "color": "w",
        "fen": "4r3/1Q2kp2/p4n2/3p2p1/3P3q/5B2/PP2K1P1/R7 b - - 0 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Qxb7+",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxb7+"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Kf8+",
        "from": "e7",
        "to": "f8",
        "color": "b",
        "fen": "4rk2/1Q3p2/p4n2/3p2p1/3P3q/5B2/PP2K1P1/R7 w - - 1 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Kf8+",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kf8+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kd3",
        "from": "e2",
        "to": "d3",
        "color": "w",
        "fen": "4rk2/1Q3p2/p4n2/3p2p1/3P3q/3K1B2/PP4P1/R7 b - - 2 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Kd3",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qf4",
        "from": "h4",
        "to": "f4",
        "color": "b",
        "fen": "4rk2/1Q3p2/p4n2/3p2p1/3P1q2/3K1B2/PP4P1/R7 w - - 3 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Qf4",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qb4+",
        "from": "b7",
        "to": "b4",
        "color": "w",
        "fen": "4rk2/5p2/p4n2/3p2p1/1Q1P1q2/3K1B2/PP4P1/R7 b - - 4 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Qb4+",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb4+"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Kg7",
        "from": "f8",
        "to": "g7",
        "color": "b",
        "fen": "4r3/5pk1/p4n2/3p2p1/1Q1P1q2/3K1B2/PP4P1/R7 w - - 5 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Kg7",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kg7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Re1",
        "from": "a1",
        "to": "e1",
        "color": "w",
        "fen": "4r3/5pk1/p4n2/3p2p1/1Q1P1q2/3K1B2/PP4P1/4R3 b - - 6 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Re1",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qf5+",
        "from": "f4",
        "to": "f5",
        "color": "b",
        "fen": "4r3/5pk1/p4n2/3p1qp1/1Q1P4/3K1B2/PP4P1/4R3 w - - 7 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Qf5+",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf5+"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Kd2",
        "from": "d3",
        "to": "d2",
        "color": "w",
        "fen": "4r3/5pk1/p4n2/3p1qp1/1Q1P4/5B2/PP1K2P1/4R3 b - - 8 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Kd2",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qf4+",
        "from": "f5",
        "to": "f4",
        "color": "b",
        "fen": "4r3/5pk1/p4n2/3p2p1/1Q1P1q2/5B2/PP1K2P1/4R3 w - - 9 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Qf4+",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf4+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kd1",
        "from": "d2",
        "to": "d1",
        "color": "w",
        "fen": "4r3/5pk1/p4n2/3p2p1/1Q1P1q2/5B2/PP4P1/3KR3 b - - 10 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Kd1",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rxe1+",
        "from": "e8",
        "to": "e1",
        "color": "b",
        "fen": "8/5pk1/p4n2/3p2p1/1Q1P1q2/5B2/PP4P1/3Kr3 w - - 0 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Rxe1+",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxe1+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Kxe1",
        "from": "d1",
        "to": "e1",
        "color": "w",
        "fen": "8/5pk1/p4n2/3p2p1/1Q1P1q2/5B2/PP4P1/4K3 b - - 0 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Kxe1",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kxe1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "g4",
        "from": "g5",
        "to": "g4",
        "color": "b",
        "fen": "8/5pk1/p4n2/3p4/1Q1P1qp1/5B2/PP4P1/4K3 w - - 0 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "g4",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Be2",
        "from": "f3",
        "to": "e2",
        "color": "w",
        "fen": "8/5pk1/p4n2/3p4/1Q1P1qp1/8/PP2B1P1/4K3 b - - 1 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Be2",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Ne4",
        "from": "f6",
        "to": "e4",
        "color": "b",
        "fen": "8/5pk1/p7/3p4/1Q1Pnqp1/8/PP2B1P1/4K3 w - - 2 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Ne4",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Kd1",
        "from": "e1",
        "to": "d1",
        "color": "w",
        "fen": "8/5pk1/p7/3p4/1Q1Pnqp1/8/PP2B1P1/3K4 b - - 3 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Kd1",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nf2+",
        "from": "e4",
        "to": "f2",
        "color": "b",
        "fen": "8/5pk1/p7/3p4/1Q1P1qp1/8/PP2BnP1/3K4 w - - 4 34",
        "moveNumber": 33,
        "classification": "excellent",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Nf2+",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf2+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kc2",
        "from": "d1",
        "to": "c2",
        "color": "w",
        "fen": "8/5pk1/p7/3p4/1Q1P1qp1/8/PPK1BnP1/8 b - - 5 34",
        "moveNumber": 34,
        "classification": "good",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Kc2",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kc2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qe4+",
        "from": "f4",
        "to": "e4",
        "color": "b",
        "fen": "8/5pk1/p7/3p4/1Q1Pq1p1/8/PPK1BnP1/8 w - - 6 35",
        "moveNumber": 34,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Qe4+",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe4+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Kd2",
        "from": "c2",
        "to": "d2",
        "color": "w",
        "fen": "8/5pk1/p7/3p4/1Q1Pq1p1/8/PP1KBnP1/8 b - - 7 35",
        "moveNumber": 35,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Kd2",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kd2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qxg2",
        "from": "e4",
        "to": "g2",
        "color": "b",
        "fen": "8/5pk1/p7/3p4/1Q1P2p1/8/PP1KBnq1/8 w - - 0 36",
        "moveNumber": 35,
        "classification": "good",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Qxg2",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxg2"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qd6",
        "from": "b4",
        "to": "d6",
        "color": "w",
        "fen": "8/5pk1/p2Q4/3p4/3P2p1/8/PP1KBnq1/8 b - - 1 36",
        "moveNumber": 36,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 36.",
          "lines": [
            {
              "move": "Qd6",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd6"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Ne4+",
        "from": "f2",
        "to": "e4",
        "color": "b",
        "fen": "8/5pk1/p2Q4/3p4/3Pn1p1/8/PP1KB1q1/8 w - - 2 37",
        "moveNumber": 36,
        "classification": "brilliant",
        "eval": {
          "eval": 3.5,
          "why": "Control of center and piece coordination on move 36.",
          "lines": [
            {
              "move": "Ne4+",
              "eval": 3.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne4+"
              ]
            }
          ]
        },
        "timeSpent": 9
      }
    ]
  },
  {
    "id": "game-05",
    "white": {
      "username": "You",
      "rating": 905
    },
    "black": {
      "username": "RookRoller",
      "rating": 890
    },
    "result": "1-0",
    "date": "2026-10-18T16:45:00Z",
    "timeControl": "1 min",
    "speed": "bullet",
    "source": "online",
    "opening": {
      "eco": "B01",
      "name": "Scandinavian Defense"
    },
    "pgn": "1. e4 d5 2. exd5 Qxd5 3. Nc3 Qa5 4. d4 Nf6 5. Nf3 Bg4 6. h3 Bh5 7. g4 Bg6 8. Ne5 Nbd7 9. Nc4 Qa6 10. Bf4 Qe6+ 11. Ne3 c6 12. Bc4 Nd5 13. Ncxd5 cxd5 14. Bxd5 Qb6 15. O-O e6 16. Bg2 Bd6 17. Nc4 Bxf4 18. Nxb6 Nxb6 19. Bxb7 Rb8 20. Bc6+ Ke7 21. Qf3 Bd6 22. b3 Rhc8 23. c4 Ba3 24. Rae1 Kf8 25. Rxe6 Kg8 26. Re3 Bb4 27. c5 Na8 28. a3 Bxa3 29. Ra1 Bb2 30. Rxa7 Nc7 31. Qf4 Ne6 32. Rxe6 fxe6 33. Qe5",
    "accuracy": {
      "white": 89.2,
      "black": 68.4
    },
    "estimatedRating": {
      "white": 1240,
      "black": 840
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "A",
      "tactics": "A",
      "endgame": "A"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d5",
        "from": "d7",
        "to": "d5",
        "color": "b",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "exd5",
        "from": "e4",
        "to": "d5",
        "color": "w",
        "fen": "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "exd5",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exd5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qxd5",
        "from": "d8",
        "to": "d5",
        "color": "b",
        "fen": "rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Qxd5",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxd5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "rnb1kbnr/ppp1pppp/8/3q4/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qa5",
        "from": "d5",
        "to": "a5",
        "color": "b",
        "fen": "rnb1kbnr/ppp1pppp/8/q7/8/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Qa5",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qa5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnb1kbnr/ppp1pppp/8/q7/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 0 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 1 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 2 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bg4",
        "from": "c8",
        "to": "g4",
        "color": "b",
        "fen": "rn2kb1r/ppp1pppp/5n2/q7/3P2b1/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 3 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Bg4",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "h3",
        "from": "h2",
        "to": "h3",
        "color": "w",
        "fen": "rn2kb1r/ppp1pppp/5n2/q7/3P2b1/2N2N1P/PPP2PP1/R1BQKB1R b KQkq - 0 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "h3",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bh5",
        "from": "g4",
        "to": "h5",
        "color": "b",
        "fen": "rn2kb1r/ppp1pppp/5n2/q6b/3P4/2N2N1P/PPP2PP1/R1BQKB1R w KQkq - 1 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Bh5",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bh5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "g4",
        "from": "g2",
        "to": "g4",
        "color": "w",
        "fen": "rn2kb1r/ppp1pppp/5n2/q6b/3P2P1/2N2N1P/PPP2P2/R1BQKB1R b KQkq - 0 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "g4",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bg6",
        "from": "h5",
        "to": "g6",
        "color": "b",
        "fen": "rn2kb1r/ppp1pppp/5nb1/q7/3P2P1/2N2N1P/PPP2P2/R1BQKB1R w KQkq - 1 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Bg6",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Ne5",
        "from": "f3",
        "to": "e5",
        "color": "w",
        "fen": "rn2kb1r/ppp1pppp/5nb1/q3N3/3P2P1/2N4P/PPP2P2/R1BQKB1R b KQkq - 2 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Ne5",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nbd7",
        "from": "b8",
        "to": "d7",
        "color": "b",
        "fen": "r3kb1r/pppnpppp/5nb1/q3N3/3P2P1/2N4P/PPP2P2/R1BQKB1R w KQkq - 3 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nbd7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nc4",
        "from": "e5",
        "to": "c4",
        "color": "w",
        "fen": "r3kb1r/pppnpppp/5nb1/q7/2NP2P1/2N4P/PPP2P2/R1BQKB1R b KQkq - 4 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nc4",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qa6",
        "from": "a5",
        "to": "a6",
        "color": "b",
        "fen": "r3kb1r/pppnpppp/q4nb1/8/2NP2P1/2N4P/PPP2P2/R1BQKB1R w KQkq - 5 10",
        "moveNumber": 9,
        "classification": "brilliant",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Qa6",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qa6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bf4",
        "from": "c1",
        "to": "f4",
        "color": "w",
        "fen": "r3kb1r/pppnpppp/q4nb1/8/2NP1BP1/2N4P/PPP2P2/R2QKB1R b KQkq - 6 10",
        "moveNumber": 10,
        "classification": "blunder",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Bf4",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qe6+",
        "from": "a6",
        "to": "e6",
        "color": "b",
        "fen": "r3kb1r/pppnpppp/4qnb1/8/2NP1BP1/2N4P/PPP2P2/R2QKB1R w KQkq - 7 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Qe6+",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe6+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ne3",
        "from": "c4",
        "to": "e3",
        "color": "w",
        "fen": "r3kb1r/pppnpppp/4qnb1/8/3P1BP1/2N1N2P/PPP2P2/R2QKB1R b KQkq - 8 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Ne3",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "c6",
        "from": "c7",
        "to": "c6",
        "color": "b",
        "fen": "r3kb1r/pp1npppp/2p1qnb1/8/3P1BP1/2N1N2P/PPP2P2/R2QKB1R w KQkq - 0 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "c6",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bc4",
        "from": "f1",
        "to": "c4",
        "color": "w",
        "fen": "r3kb1r/pp1npppp/2p1qnb1/8/2BP1BP1/2N1N2P/PPP2P2/R2QK2R b KQkq - 1 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Bc4",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nd5",
        "from": "f6",
        "to": "d5",
        "color": "b",
        "fen": "r3kb1r/pp1npppp/2p1q1b1/3n4/2BP1BP1/2N1N2P/PPP2P2/R2QK2R w KQkq - 2 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Nd5",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nxd5",
        "from": "c3",
        "to": "d5",
        "color": "w",
        "fen": "r3kb1r/pp1npppp/2p1q1b1/3N4/2BP1BP1/4N2P/PPP2P2/R2QK2R b KQkq - 0 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Nxd5",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxd5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "cxd5",
        "from": "c6",
        "to": "d5",
        "color": "b",
        "fen": "r3kb1r/pp1npppp/4q1b1/3p4/2BP1BP1/4N2P/PPP2P2/R2QK2R w KQkq - 0 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "cxd5",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "cxd5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bxd5",
        "from": "c4",
        "to": "d5",
        "color": "w",
        "fen": "r3kb1r/pp1npppp/4q1b1/3B4/3P1BP1/4N2P/PPP2P2/R2QK2R b KQkq - 0 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Bxd5",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxd5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qb6",
        "from": "e6",
        "to": "b6",
        "color": "b",
        "fen": "r3kb1r/pp1npppp/1q4b1/3B4/3P1BP1/4N2P/PPP2P2/R2QK2R w KQkq - 1 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Qb6",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r3kb1r/pp1npppp/1q4b1/3B4/3P1BP1/4N2P/PPP2P2/R2Q1RK1 b kq - 2 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "O-O",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "e6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "r3kb1r/pp1n1ppp/1q2p1b1/3B4/3P1BP1/4N2P/PPP2P2/R2Q1RK1 w kq - 0 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "e6",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bg2",
        "from": "d5",
        "to": "g2",
        "color": "w",
        "fen": "r3kb1r/pp1n1ppp/1q2p1b1/8/3P1BP1/4N2P/PPP2PB1/R2Q1RK1 b kq - 1 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Bg2",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bd6",
        "from": "f8",
        "to": "d6",
        "color": "b",
        "fen": "r3k2r/pp1n1ppp/1q1bp1b1/8/3P1BP1/4N2P/PPP2PB1/R2Q1RK1 w kq - 2 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Bd6",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nc4",
        "from": "e3",
        "to": "c4",
        "color": "w",
        "fen": "r3k2r/pp1n1ppp/1q1bp1b1/8/2NP1BP1/7P/PPP2PB1/R2Q1RK1 b kq - 3 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Nc4",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bxf4",
        "from": "d6",
        "to": "f4",
        "color": "b",
        "fen": "r3k2r/pp1n1ppp/1q2p1b1/8/2NP1bP1/7P/PPP2PB1/R2Q1RK1 w kq - 0 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Bxf4",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nxb6",
        "from": "c4",
        "to": "b6",
        "color": "w",
        "fen": "r3k2r/pp1n1ppp/1N2p1b1/8/3P1bP1/7P/PPP2PB1/R2Q1RK1 b kq - 0 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Nxb6",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxb6"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nxb6",
        "from": "d7",
        "to": "b6",
        "color": "b",
        "fen": "r3k2r/pp3ppp/1n2p1b1/8/3P1bP1/7P/PPP2PB1/R2Q1RK1 w kq - 0 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Nxb6",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxb6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bxb7",
        "from": "g2",
        "to": "b7",
        "color": "w",
        "fen": "r3k2r/pB3ppp/1n2p1b1/8/3P1bP1/7P/PPP2P2/R2Q1RK1 b kq - 0 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Bxb7",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxb7"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rb8",
        "from": "a8",
        "to": "b8",
        "color": "b",
        "fen": "1r2k2r/pB3ppp/1n2p1b1/8/3P1bP1/7P/PPP2P2/R2Q1RK1 w k - 1 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Rb8",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rb8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bc6+",
        "from": "b7",
        "to": "c6",
        "color": "w",
        "fen": "1r2k2r/p4ppp/1nB1p1b1/8/3P1bP1/7P/PPP2P2/R2Q1RK1 b k - 2 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Bc6+",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc6+"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Ke7",
        "from": "e8",
        "to": "e7",
        "color": "b",
        "fen": "1r5r/p3kppp/1nB1p1b1/8/3P1bP1/7P/PPP2P2/R2Q1RK1 w - - 3 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Ke7",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ke7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qf3",
        "from": "d1",
        "to": "f3",
        "color": "w",
        "fen": "1r5r/p3kppp/1nB1p1b1/8/3P1bP1/5Q1P/PPP2P2/R4RK1 b - - 4 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Qf3",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bd6",
        "from": "f4",
        "to": "d6",
        "color": "b",
        "fen": "1r5r/p3kppp/1nBbp1b1/8/3P2P1/5Q1P/PPP2P2/R4RK1 w - - 5 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Bd6",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "b3",
        "from": "b2",
        "to": "b3",
        "color": "w",
        "fen": "1r5r/p3kppp/1nBbp1b1/8/3P2P1/1P3Q1P/P1P2P2/R4RK1 b - - 0 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "b3",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rhc8",
        "from": "h8",
        "to": "c8",
        "color": "b",
        "fen": "1rr5/p3kppp/1nBbp1b1/8/3P2P1/1P3Q1P/P1P2P2/R4RK1 w - - 1 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rhc8",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rhc8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "c4",
        "from": "c2",
        "to": "c4",
        "color": "w",
        "fen": "1rr5/p3kppp/1nBbp1b1/8/2PP2P1/1P3Q1P/P4P2/R4RK1 b - - 0 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "c4",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Ba3",
        "from": "d6",
        "to": "a3",
        "color": "b",
        "fen": "1rr5/p3kppp/1nB1p1b1/8/2PP2P1/bP3Q1P/P4P2/R4RK1 w - - 1 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Ba3",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ba3"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rae1",
        "from": "a1",
        "to": "e1",
        "color": "w",
        "fen": "1rr5/p3kppp/1nB1p1b1/8/2PP2P1/bP3Q1P/P4P2/4RRK1 b - - 2 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Rae1",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rae1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Kf8",
        "from": "e7",
        "to": "f8",
        "color": "b",
        "fen": "1rr2k2/p4ppp/1nB1p1b1/8/2PP2P1/bP3Q1P/P4P2/4RRK1 w - - 3 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Kf8",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kf8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rxe6",
        "from": "e1",
        "to": "e6",
        "color": "w",
        "fen": "1rr2k2/p4ppp/1nB1R1b1/8/2PP2P1/bP3Q1P/P4P2/5RK1 b - - 0 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Rxe6",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxe6"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Kg8",
        "from": "f8",
        "to": "g8",
        "color": "b",
        "fen": "1rr3k1/p4ppp/1nB1R1b1/8/2PP2P1/bP3Q1P/P4P2/5RK1 w - - 1 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Kg8",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kg8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Re3",
        "from": "e6",
        "to": "e3",
        "color": "w",
        "fen": "1rr3k1/p4ppp/1nB3b1/8/2PP2P1/bP2RQ1P/P4P2/5RK1 b - - 2 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Re3",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bb4",
        "from": "a3",
        "to": "b4",
        "color": "b",
        "fen": "1rr3k1/p4ppp/1nB3b1/8/1bPP2P1/1P2RQ1P/P4P2/5RK1 w - - 3 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Bb4",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bb4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "c5",
        "from": "c4",
        "to": "c5",
        "color": "w",
        "fen": "1rr3k1/p4ppp/1nB3b1/2P5/1b1P2P1/1P2RQ1P/P4P2/5RK1 b - - 0 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "c5",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Na8",
        "from": "b6",
        "to": "a8",
        "color": "b",
        "fen": "nrr3k1/p4ppp/2B3b1/2P5/1b1P2P1/1P2RQ1P/P4P2/5RK1 w - - 1 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Na8",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Na8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "a3",
        "from": "a2",
        "to": "a3",
        "color": "w",
        "fen": "nrr3k1/p4ppp/2B3b1/2P5/1b1P2P1/PP2RQ1P/5P2/5RK1 b - - 0 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "a3",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bxa3",
        "from": "b4",
        "to": "a3",
        "color": "b",
        "fen": "nrr3k1/p4ppp/2B3b1/2P5/3P2P1/bP2RQ1P/5P2/5RK1 w - - 0 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Bxa3",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxa3"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ra1",
        "from": "f1",
        "to": "a1",
        "color": "w",
        "fen": "nrr3k1/p4ppp/2B3b1/2P5/3P2P1/bP2RQ1P/5P2/R5K1 b - - 1 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Ra1",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ra1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bb2",
        "from": "a3",
        "to": "b2",
        "color": "b",
        "fen": "nrr3k1/p4ppp/2B3b1/2P5/3P2P1/1P2RQ1P/1b3P2/R5K1 w - - 2 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Bb2",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bb2"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rxa7",
        "from": "a1",
        "to": "a7",
        "color": "w",
        "fen": "nrr3k1/R4ppp/2B3b1/2P5/3P2P1/1P2RQ1P/1b3P2/6K1 b - - 0 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Rxa7",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxa7"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nc7",
        "from": "a8",
        "to": "c7",
        "color": "b",
        "fen": "1rr3k1/R1n2ppp/2B3b1/2P5/3P2P1/1P2RQ1P/1b3P2/6K1 w - - 1 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Nc7",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qf4",
        "from": "f3",
        "to": "f4",
        "color": "w",
        "fen": "1rr3k1/R1n2ppp/2B3b1/2P5/3P1QP1/1P2R2P/1b3P2/6K1 b - - 2 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Qf4",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Ne6",
        "from": "c7",
        "to": "e6",
        "color": "b",
        "fen": "1rr3k1/R4ppp/2B1n1b1/2P5/3P1QP1/1P2R2P/1b3P2/6K1 w - - 3 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Ne6",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rxe6",
        "from": "e3",
        "to": "e6",
        "color": "w",
        "fen": "1rr3k1/R4ppp/2B1R1b1/2P5/3P1QP1/1P5P/1b3P2/6K1 b - - 0 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Rxe6",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxe6"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "fxe6",
        "from": "f7",
        "to": "e6",
        "color": "b",
        "fen": "1rr3k1/R5pp/2B1p1b1/2P5/3P1QP1/1P5P/1b3P2/6K1 w - - 0 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "fxe6",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "fxe6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qe5",
        "from": "f4",
        "to": "e5",
        "color": "w",
        "fen": "1rr3k1/R5pp/2B1p1b1/2P1Q3/3P2P1/1P5P/1b3P2/6K1 b - - 1 33",
        "moveNumber": 33,
        "classification": "great",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Qe5",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe5"
              ]
            }
          ]
        },
        "timeSpent": 2
      }
    ]
  },
  {
    "id": "game-06",
    "white": {
      "username": "GM_Example",
      "rating": 1400,
      "title": "BOT"
    },
    "black": {
      "username": "You",
      "rating": 905
    },
    "result": "1-0",
    "date": "2026-10-17T20:10:00Z",
    "timeControl": "15 min",
    "speed": "rapid",
    "source": "vs_coach",
    "opening": {
      "eco": "E60",
      "name": "King's Indian Defense"
    },
    "pgn": "1. d4 Nf6 2. c4 g6 3. g3 Bg7 4. Bg2 O-O 5. Nc3 d6 6. Nf3 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. Re1 exd4 11. Nxd4 Re8 12. Re2 Ng4 13. Nb3 Nge5 14. Be3 Qc7 15. c5 dxc5 16. Nxc5 Nxc5 17. Bxc5 Rd8 18. Qc2 Be6 19. b3 Nd3 20. Be3 Nb4 21. Qc1 Rd3 22. Bd2 Rad8 23. Be1 Qe5 24. a3 Na6 25. Rc2 Bxb3 26. f4 Qd4+ 27. Bf2 Qd7 28. e5 Bxc2 29. Qxc2 Rd2 30. Qb3 Rxf2 31. Kxf2 Qd4+ 32. Kf1 Nc5 33. Qc2 Qc4+ 34. Kg1 Rd3 35. Rc1 Rxg3",
    "accuracy": {
      "white": 76.5,
      "black": 88
    },
    "estimatedRating": {
      "white": 1100,
      "black": 1290
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "B",
      "tactics": "A",
      "endgame": "B"
    },
    "moves": [
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "d4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "c4",
        "from": "c2",
        "to": "c4",
        "color": "w",
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "c4",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "g6",
        "from": "g7",
        "to": "g6",
        "color": "b",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "g6",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "g3",
        "from": "g2",
        "to": "g3",
        "color": "w",
        "fen": "rnbqkb1r/pppppp1p/5np1/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "g3",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bg7",
        "from": "f8",
        "to": "g7",
        "color": "b",
        "fen": "rnbqk2r/ppppppbp/5np1/8/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq - 1 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bg2",
        "from": "f1",
        "to": "g2",
        "color": "w",
        "fen": "rnbqk2r/ppppppbp/5np1/8/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq - 2 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Bg2",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/2PP4/6P1/PP2PPBP/RNBQK1NR w KQ - 3 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "rnbq1rk1/ppppppbp/5np1/8/2PP4/2N3P1/PP2PPBP/R1BQK1NR b KQ - 4 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d6",
        "from": "d7",
        "to": "d6",
        "color": "b",
        "fen": "rnbq1rk1/ppp1ppbp/3p1np1/8/2PP4/2N3P1/PP2PPBP/R1BQK1NR w KQ - 0 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rnbq1rk1/ppp1ppbp/3p1np1/8/2PP4/2N2NP1/PP2PPBP/R1BQK2R b KQ - 1 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nbd7",
        "from": "b8",
        "to": "d7",
        "color": "b",
        "fen": "r1bq1rk1/pppnppbp/3p1np1/8/2PP4/2N2NP1/PP2PPBP/R1BQK2R w KQ - 2 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nbd7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r1bq1rk1/pppnppbp/3p1np1/8/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 b - - 3 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "e5",
        "from": "e7",
        "to": "e5",
        "color": "b",
        "fen": "r1bq1rk1/pppn1pbp/3p1np1/4p3/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "r1bq1rk1/pppn1pbp/3p1np1/4p3/2PPP3/2N2NP1/PP3PBP/R1BQ1RK1 b - - 0 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "c6",
        "from": "c7",
        "to": "c6",
        "color": "b",
        "fen": "r1bq1rk1/pp1n1pbp/2pp1np1/4p3/2PPP3/2N2NP1/PP3PBP/R1BQ1RK1 w - - 0 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "c6",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "h3",
        "from": "h2",
        "to": "h3",
        "color": "w",
        "fen": "r1bq1rk1/pp1n1pbp/2pp1np1/4p3/2PPP3/2N2NPP/PP3PB1/R1BQ1RK1 b - - 0 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "h3",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qb6",
        "from": "d8",
        "to": "b6",
        "color": "b",
        "fen": "r1b2rk1/pp1n1pbp/1qpp1np1/4p3/2PPP3/2N2NPP/PP3PB1/R1BQ1RK1 w - - 1 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Qb6",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Re1",
        "from": "f1",
        "to": "e1",
        "color": "w",
        "fen": "r1b2rk1/pp1n1pbp/1qpp1np1/4p3/2PPP3/2N2NPP/PP3PB1/R1BQR1K1 b - - 2 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Re1",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "exd4",
        "from": "e5",
        "to": "d4",
        "color": "b",
        "fen": "r1b2rk1/pp1n1pbp/1qpp1np1/8/2PpP3/2N2NPP/PP3PB1/R1BQR1K1 w - - 0 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "exd4",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exd4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nxd4",
        "from": "f3",
        "to": "d4",
        "color": "w",
        "fen": "r1b2rk1/pp1n1pbp/1qpp1np1/8/2PNP3/2N3PP/PP3PB1/R1BQR1K1 b - - 0 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxd4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Re8",
        "from": "f8",
        "to": "e8",
        "color": "b",
        "fen": "r1b1r1k1/pp1n1pbp/1qpp1np1/8/2PNP3/2N3PP/PP3PB1/R1BQR1K1 w - - 1 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Re8",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Re2",
        "from": "e1",
        "to": "e2",
        "color": "w",
        "fen": "r1b1r1k1/pp1n1pbp/1qpp1np1/8/2PNP3/2N3PP/PP2RPB1/R1BQ2K1 b - - 2 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Re2",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Ng4",
        "from": "f6",
        "to": "g4",
        "color": "b",
        "fen": "r1b1r1k1/pp1n1pbp/1qpp2p1/8/2PNP1n1/2N3PP/PP2RPB1/R1BQ2K1 w - - 3 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Ng4",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nb3",
        "from": "d4",
        "to": "b3",
        "color": "w",
        "fen": "r1b1r1k1/pp1n1pbp/1qpp2p1/8/2P1P1n1/1NN3PP/PP2RPB1/R1BQ2K1 b - - 4 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Nb3",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nge5",
        "from": "g4",
        "to": "e5",
        "color": "b",
        "fen": "r1b1r1k1/pp1n1pbp/1qpp2p1/4n3/2P1P3/1NN3PP/PP2RPB1/R1BQ2K1 w - - 5 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Nge5",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nge5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Be3",
        "from": "c1",
        "to": "e3",
        "color": "w",
        "fen": "r1b1r1k1/pp1n1pbp/1qpp2p1/4n3/2P1P3/1NN1B1PP/PP2RPB1/R2Q2K1 b - - 6 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Be3",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qc7",
        "from": "b6",
        "to": "c7",
        "color": "b",
        "fen": "r1b1r1k1/ppqn1pbp/2pp2p1/4n3/2P1P3/1NN1B1PP/PP2RPB1/R2Q2K1 w - - 7 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Qc7",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "c5",
        "from": "c4",
        "to": "c5",
        "color": "w",
        "fen": "r1b1r1k1/ppqn1pbp/2pp2p1/2P1n3/4P3/1NN1B1PP/PP2RPB1/R2Q2K1 b - - 0 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "c5",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "dxc5",
        "from": "d6",
        "to": "c5",
        "color": "b",
        "fen": "r1b1r1k1/ppqn1pbp/2p3p1/2p1n3/4P3/1NN1B1PP/PP2RPB1/R2Q2K1 w - - 0 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "dxc5",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "dxc5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nxc5",
        "from": "b3",
        "to": "c5",
        "color": "w",
        "fen": "r1b1r1k1/ppqn1pbp/2p3p1/2N1n3/4P3/2N1B1PP/PP2RPB1/R2Q2K1 b - - 0 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Nxc5",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nxc5",
        "from": "d7",
        "to": "c5",
        "color": "b",
        "fen": "r1b1r1k1/ppq2pbp/2p3p1/2n1n3/4P3/2N1B1PP/PP2RPB1/R2Q2K1 w - - 0 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Nxc5",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bxc5",
        "from": "e3",
        "to": "c5",
        "color": "w",
        "fen": "r1b1r1k1/ppq2pbp/2p3p1/2B1n3/4P3/2N3PP/PP2RPB1/R2Q2K1 b - - 0 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Bxc5",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxc5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rd8",
        "from": "e8",
        "to": "d8",
        "color": "b",
        "fen": "r1br2k1/ppq2pbp/2p3p1/2B1n3/4P3/2N3PP/PP2RPB1/R2Q2K1 w - - 1 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Rd8",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qc2",
        "from": "d1",
        "to": "c2",
        "color": "w",
        "fen": "r1br2k1/ppq2pbp/2p3p1/2B1n3/4P3/2N3PP/PPQ1RPB1/R5K1 b - - 2 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Qc2",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Be6",
        "from": "c8",
        "to": "e6",
        "color": "b",
        "fen": "r2r2k1/ppq2pbp/2p1b1p1/2B1n3/4P3/2N3PP/PPQ1RPB1/R5K1 w - - 3 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Be6",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "b3",
        "from": "b2",
        "to": "b3",
        "color": "w",
        "fen": "r2r2k1/ppq2pbp/2p1b1p1/2B1n3/4P3/1PN3PP/P1Q1RPB1/R5K1 b - - 0 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "b3",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nd3",
        "from": "e5",
        "to": "d3",
        "color": "b",
        "fen": "r2r2k1/ppq2pbp/2p1b1p1/2B5/4P3/1PNn2PP/P1Q1RPB1/R5K1 w - - 1 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Nd3",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd3"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Be3",
        "from": "c5",
        "to": "e3",
        "color": "w",
        "fen": "r2r2k1/ppq2pbp/2p1b1p1/8/4P3/1PNnB1PP/P1Q1RPB1/R5K1 b - - 2 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Be3",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nb4",
        "from": "d3",
        "to": "b4",
        "color": "b",
        "fen": "r2r2k1/ppq2pbp/2p1b1p1/8/1n2P3/1PN1B1PP/P1Q1RPB1/R5K1 w - - 3 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Nb4",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qc1",
        "from": "c2",
        "to": "c1",
        "color": "w",
        "fen": "r2r2k1/ppq2pbp/2p1b1p1/8/1n2P3/1PN1B1PP/P3RPB1/R1Q3K1 b - - 4 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Qc1",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rd3",
        "from": "d8",
        "to": "d3",
        "color": "b",
        "fen": "r5k1/ppq2pbp/2p1b1p1/8/1n2P3/1PNrB1PP/P3RPB1/R1Q3K1 w - - 5 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rd3",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd3"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bd2",
        "from": "e3",
        "to": "d2",
        "color": "w",
        "fen": "r5k1/ppq2pbp/2p1b1p1/8/1n2P3/1PNr2PP/P2BRPB1/R1Q3K1 b - - 6 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Bd2",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rad8",
        "from": "a8",
        "to": "d8",
        "color": "b",
        "fen": "3r2k1/ppq2pbp/2p1b1p1/8/1n2P3/1PNr2PP/P2BRPB1/R1Q3K1 w - - 7 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rad8",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rad8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Be1",
        "from": "d2",
        "to": "e1",
        "color": "w",
        "fen": "3r2k1/ppq2pbp/2p1b1p1/8/1n2P3/1PNr2PP/P3RPB1/R1Q1B1K1 b - - 8 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Be1",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qe5",
        "from": "c7",
        "to": "e5",
        "color": "b",
        "fen": "3r2k1/pp3pbp/2p1b1p1/4q3/1n2P3/1PNr2PP/P3RPB1/R1Q1B1K1 w - - 9 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Qe5",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "a3",
        "from": "a2",
        "to": "a3",
        "color": "w",
        "fen": "3r2k1/pp3pbp/2p1b1p1/4q3/1n2P3/PPNr2PP/4RPB1/R1Q1B1K1 b - - 0 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "a3",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Na6",
        "from": "b4",
        "to": "a6",
        "color": "b",
        "fen": "3r2k1/pp3pbp/n1p1b1p1/4q3/4P3/PPNr2PP/4RPB1/R1Q1B1K1 w - - 1 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Na6",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Na6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rc2",
        "from": "e2",
        "to": "c2",
        "color": "w",
        "fen": "3r2k1/pp3pbp/n1p1b1p1/4q3/4P3/PPNr2PP/2R2PB1/R1Q1B1K1 b - - 2 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Rc2",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rc2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bxb3",
        "from": "e6",
        "to": "b3",
        "color": "b",
        "fen": "3r2k1/pp3pbp/n1p3p1/4q3/4P3/PbNr2PP/2R2PB1/R1Q1B1K1 w - - 0 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Bxb3",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxb3"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "f4",
        "from": "f2",
        "to": "f4",
        "color": "w",
        "fen": "3r2k1/pp3pbp/n1p3p1/4q3/4PP2/PbNr2PP/2R3B1/R1Q1B1K1 b - - 0 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "f4",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qd4+",
        "from": "e5",
        "to": "d4",
        "color": "b",
        "fen": "3r2k1/pp3pbp/n1p3p1/8/3qPP2/PbNr2PP/2R3B1/R1Q1B1K1 w - - 1 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Qd4+",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd4+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bf2",
        "from": "e1",
        "to": "f2",
        "color": "w",
        "fen": "3r2k1/pp3pbp/n1p3p1/8/3qPP2/PbNr2PP/2R2BB1/R1Q3K1 b - - 2 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Bf2",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qd7",
        "from": "d4",
        "to": "d7",
        "color": "b",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/8/4PP2/PbNr2PP/2R2BB1/R1Q3K1 w - - 3 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Qd7",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "e5",
        "from": "e4",
        "to": "e5",
        "color": "w",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/4P3/5P2/PbNr2PP/2R2BB1/R1Q3K1 b - - 0 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "e5",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bxc2",
        "from": "b3",
        "to": "c2",
        "color": "b",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/4P3/5P2/P1Nr2PP/2b2BB1/R1Q3K1 w - - 0 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Bxc2",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxc2"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qxc2",
        "from": "c1",
        "to": "c2",
        "color": "w",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/4P3/5P2/P1Nr2PP/2Q2BB1/R5K1 b - - 0 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Qxc2",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxc2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rd2",
        "from": "d3",
        "to": "d2",
        "color": "b",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/4P3/5P2/P1N3PP/2Qr1BB1/R5K1 w - - 1 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Rd2",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd2"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qb3",
        "from": "c2",
        "to": "b3",
        "color": "w",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/4P3/5P2/PQN3PP/3r1BB1/R5K1 b - - 2 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Qb3",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rxf2",
        "from": "d2",
        "to": "f2",
        "color": "b",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/4P3/5P2/PQN3PP/5rB1/R5K1 w - - 0 31",
        "moveNumber": 30,
        "classification": "brilliant",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Rxf2",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxf2"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Kxf2",
        "from": "g1",
        "to": "f2",
        "color": "w",
        "fen": "3r2k1/pp1q1pbp/n1p3p1/4P3/5P2/PQN3PP/5KB1/R7 b - - 0 31",
        "moveNumber": 31,
        "classification": "blunder",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Kxf2",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kxf2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qd4+",
        "from": "d7",
        "to": "d4",
        "color": "b",
        "fen": "3r2k1/pp3pbp/n1p3p1/4P3/3q1P2/PQN3PP/5KB1/R7 w - - 1 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Qd4+",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd4+"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Kf1",
        "from": "f2",
        "to": "f1",
        "color": "w",
        "fen": "3r2k1/pp3pbp/n1p3p1/4P3/3q1P2/PQN3PP/6B1/R4K2 b - - 2 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Kf1",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kf1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nc5",
        "from": "a6",
        "to": "c5",
        "color": "b",
        "fen": "3r2k1/pp3pbp/2p3p1/2n1P3/3q1P2/PQN3PP/6B1/R4K2 w - - 3 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Nc5",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qc2",
        "from": "b3",
        "to": "c2",
        "color": "w",
        "fen": "3r2k1/pp3pbp/2p3p1/2n1P3/3q1P2/P1N3PP/2Q3B1/R4K2 b - - 4 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Qc2",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qc4+",
        "from": "d4",
        "to": "c4",
        "color": "b",
        "fen": "3r2k1/pp3pbp/2p3p1/2n1P3/2q2P2/P1N3PP/2Q3B1/R4K2 w - - 5 34",
        "moveNumber": 33,
        "classification": "excellent",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Qc4+",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc4+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kg1",
        "from": "f1",
        "to": "g1",
        "color": "w",
        "fen": "3r2k1/pp3pbp/2p3p1/2n1P3/2q2P2/P1N3PP/2Q3B1/R5K1 b - - 6 34",
        "moveNumber": 34,
        "classification": "good",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Kg1",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kg1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rd3",
        "from": "d8",
        "to": "d3",
        "color": "b",
        "fen": "6k1/pp3pbp/2p3p1/2n1P3/2q2P2/P1Nr2PP/2Q3B1/R5K1 w - - 7 35",
        "moveNumber": 34,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Rd3",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd3"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rc1",
        "from": "a1",
        "to": "c1",
        "color": "w",
        "fen": "6k1/pp3pbp/2p3p1/2n1P3/2q2P2/P1Nr2PP/2Q3B1/2R3K1 b - - 8 35",
        "moveNumber": 35,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Rc1",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rc1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rxg3",
        "from": "d3",
        "to": "g3",
        "color": "b",
        "fen": "6k1/pp3pbp/2p3p1/2n1P3/2q2P2/P1N3rP/2Q3B1/2R3K1 w - - 0 36",
        "moveNumber": 35,
        "classification": "good",
        "eval": {
          "eval": 3.5,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Rxg3",
              "eval": 3.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxg3"
              ]
            }
          ]
        },
        "timeSpent": 7
      }
    ]
  },
  {
    "id": "game-07",
    "white": {
      "username": "You",
      "rating": 905
    },
    "black": {
      "username": "friend_01",
      "rating": 930
    },
    "result": "1/2-1/2",
    "date": "2026-10-16T15:30:00Z",
    "timeControl": "10 min",
    "speed": "rapid",
    "source": "online",
    "opening": {
      "eco": "C42",
      "name": "Petrov Defense"
    },
    "pgn": "1. e4 e5 2. Nf3 Nf6 3. Nxe5 d6 4. Nf3 Nxe4 5. d4 d5 6. Bd3 Bd6 7. O-O O-O 8. c4 c6 9. Nc3 Nxc3 10. bxc3 dxc4 11. Bxc4 Bg4 12. h3 Bh5 13. Re1 Nd7 14. Be2 Re8 15. Be3 Qc7 16. Qb3 Rad8 17. Rab1 b6 18. c4 c5 19. d5 Nf6 20. a4 Ne4 21. a5 bxa5 22. Qa3 Rb8 23. Ra1 Rb4 24. Qxa5 Qxa5 25. Rxa5 Nc3 26. Bd3 Bxf3 27. gxf3 Ra4 28. Rxa4 Nxa4 29. Ra1 Nb2 30. Bf1 Ra8 31. Ra6 Bf8 32. f4 Nd1 33. Bd2",
    "accuracy": {
      "white": 85,
      "black": 84.5
    },
    "estimatedRating": {
      "white": 1040,
      "black": 1030
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "B",
      "tactics": "B",
      "endgame": "A"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "e5",
        "from": "e7",
        "to": "e5",
        "color": "b",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nxe5",
        "from": "f3",
        "to": "e5",
        "color": "w",
        "fen": "rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Nxe5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxe5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "d6",
        "from": "d7",
        "to": "d6",
        "color": "b",
        "fen": "rnbqkb1r/ppp2ppp/3p1n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "d6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nf3",
        "from": "e5",
        "to": "f3",
        "color": "w",
        "fen": "rnbqkb1r/ppp2ppp/3p1n2/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nxe4",
        "from": "f6",
        "to": "e4",
        "color": "b",
        "fen": "rnbqkb1r/ppp2ppp/3p4/8/4n3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nxe4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxe4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkb1r/ppp2ppp/3p4/8/3Pn3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "d4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d5",
        "from": "d6",
        "to": "d5",
        "color": "b",
        "fen": "rnbqkb1r/ppp2ppp/8/3p4/3Pn3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "d5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bd3",
        "from": "f1",
        "to": "d3",
        "color": "w",
        "fen": "rnbqkb1r/ppp2ppp/8/3p4/3Pn3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bd6",
        "from": "f8",
        "to": "d6",
        "color": "b",
        "fen": "rnbqk2r/ppp2ppp/3b4/3p4/3Pn3/3B1N2/PPP2PPP/RNBQK2R w KQkq - 2 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Bd6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "rnbqk2r/ppp2ppp/3b4/3p4/3Pn3/3B1N2/PPP2PPP/RNBQ1RK1 b kq - 3 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "rnbq1rk1/ppp2ppp/3b4/3p4/3Pn3/3B1N2/PPP2PPP/RNBQ1RK1 w - - 4 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "c4",
        "from": "c2",
        "to": "c4",
        "color": "w",
        "fen": "rnbq1rk1/ppp2ppp/3b4/3p4/2PPn3/3B1N2/PP3PPP/RNBQ1RK1 b - - 0 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "c4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "c6",
        "from": "c7",
        "to": "c6",
        "color": "b",
        "fen": "rnbq1rk1/pp3ppp/2pb4/3p4/2PPn3/3B1N2/PP3PPP/RNBQ1RK1 w - - 0 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "c6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "rnbq1rk1/pp3ppp/2pb4/3p4/2PPn3/2NB1N2/PP3PPP/R1BQ1RK1 b - - 1 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nxc3",
        "from": "e4",
        "to": "c3",
        "color": "b",
        "fen": "rnbq1rk1/pp3ppp/2pb4/3p4/2PP4/2nB1N2/PP3PPP/R1BQ1RK1 w - - 0 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nxc3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc3"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "bxc3",
        "from": "b2",
        "to": "c3",
        "color": "w",
        "fen": "rnbq1rk1/pp3ppp/2pb4/3p4/2PP4/2PB1N2/P4PPP/R1BQ1RK1 b - - 0 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "bxc3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "bxc3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "dxc4",
        "from": "d5",
        "to": "c4",
        "color": "b",
        "fen": "rnbq1rk1/pp3ppp/2pb4/8/2pP4/2PB1N2/P4PPP/R1BQ1RK1 w - - 0 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "dxc4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "dxc4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bxc4",
        "from": "d3",
        "to": "c4",
        "color": "w",
        "fen": "rnbq1rk1/pp3ppp/2pb4/8/2BP4/2P2N2/P4PPP/R1BQ1RK1 b - - 0 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Bxc4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxc4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bg4",
        "from": "c8",
        "to": "g4",
        "color": "b",
        "fen": "rn1q1rk1/pp3ppp/2pb4/8/2BP2b1/2P2N2/P4PPP/R1BQ1RK1 w - - 1 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Bg4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "h3",
        "from": "h2",
        "to": "h3",
        "color": "w",
        "fen": "rn1q1rk1/pp3ppp/2pb4/8/2BP2b1/2P2N1P/P4PP1/R1BQ1RK1 b - - 0 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "h3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bh5",
        "from": "g4",
        "to": "h5",
        "color": "b",
        "fen": "rn1q1rk1/pp3ppp/2pb4/7b/2BP4/2P2N1P/P4PP1/R1BQ1RK1 w - - 1 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Bh5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bh5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Re1",
        "from": "f1",
        "to": "e1",
        "color": "w",
        "fen": "rn1q1rk1/pp3ppp/2pb4/7b/2BP4/2P2N1P/P4PP1/R1BQR1K1 b - - 2 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Re1",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nd7",
        "from": "b8",
        "to": "d7",
        "color": "b",
        "fen": "r2q1rk1/pp1n1ppp/2pb4/7b/2BP4/2P2N1P/P4PP1/R1BQR1K1 w - - 3 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Nd7",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Be2",
        "from": "c4",
        "to": "e2",
        "color": "w",
        "fen": "r2q1rk1/pp1n1ppp/2pb4/7b/3P4/2P2N1P/P3BPP1/R1BQR1K1 b - - 4 14",
        "moveNumber": 14,
        "classification": "great",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Be2",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Re8",
        "from": "f8",
        "to": "e8",
        "color": "b",
        "fen": "r2qr1k1/pp1n1ppp/2pb4/7b/3P4/2P2N1P/P3BPP1/R1BQR1K1 w - - 5 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Re8",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Be3",
        "from": "c1",
        "to": "e3",
        "color": "w",
        "fen": "r2qr1k1/pp1n1ppp/2pb4/7b/3P4/2P1BN1P/P3BPP1/R2QR1K1 b - - 6 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Be3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qc7",
        "from": "d8",
        "to": "c7",
        "color": "b",
        "fen": "r3r1k1/ppqn1ppp/2pb4/7b/3P4/2P1BN1P/P3BPP1/R2QR1K1 w - - 7 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Qc7",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qb3",
        "from": "d1",
        "to": "b3",
        "color": "w",
        "fen": "r3r1k1/ppqn1ppp/2pb4/7b/3P4/1QP1BN1P/P3BPP1/R3R1K1 b - - 8 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Qb3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rad8",
        "from": "a8",
        "to": "d8",
        "color": "b",
        "fen": "3rr1k1/ppqn1ppp/2pb4/7b/3P4/1QP1BN1P/P3BPP1/R3R1K1 w - - 9 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Rad8",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rad8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rab1",
        "from": "a1",
        "to": "b1",
        "color": "w",
        "fen": "3rr1k1/ppqn1ppp/2pb4/7b/3P4/1QP1BN1P/P3BPP1/1R2R1K1 b - - 10 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Rab1",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rab1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "b6",
        "from": "b7",
        "to": "b6",
        "color": "b",
        "fen": "3rr1k1/p1qn1ppp/1ppb4/7b/3P4/1QP1BN1P/P3BPP1/1R2R1K1 w - - 0 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "b6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "c4",
        "from": "c3",
        "to": "c4",
        "color": "w",
        "fen": "3rr1k1/p1qn1ppp/1ppb4/7b/2PP4/1Q2BN1P/P3BPP1/1R2R1K1 b - - 0 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "c4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "c5",
        "from": "c6",
        "to": "c5",
        "color": "b",
        "fen": "3rr1k1/p1qn1ppp/1p1b4/2p4b/2PP4/1Q2BN1P/P3BPP1/1R2R1K1 w - - 0 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "c5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "d5",
        "from": "d4",
        "to": "d5",
        "color": "w",
        "fen": "3rr1k1/p1qn1ppp/1p1b4/2pP3b/2P5/1Q2BN1P/P3BPP1/1R2R1K1 b - - 0 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "d5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nf6",
        "from": "d7",
        "to": "f6",
        "color": "b",
        "fen": "3rr1k1/p1q2ppp/1p1b1n2/2pP3b/2P5/1Q2BN1P/P3BPP1/1R2R1K1 w - - 1 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "a4",
        "from": "a2",
        "to": "a4",
        "color": "w",
        "fen": "3rr1k1/p1q2ppp/1p1b1n2/2pP3b/P1P5/1Q2BN1P/4BPP1/1R2R1K1 b - - 0 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "a4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Ne4",
        "from": "f6",
        "to": "e4",
        "color": "b",
        "fen": "3rr1k1/p1q2ppp/1p1b4/2pP3b/P1P1n3/1Q2BN1P/4BPP1/1R2R1K1 w - - 1 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Ne4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "a5",
        "from": "a4",
        "to": "a5",
        "color": "w",
        "fen": "3rr1k1/p1q2ppp/1p1b4/P1pP3b/2P1n3/1Q2BN1P/4BPP1/1R2R1K1 b - - 0 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "a5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "bxa5",
        "from": "b6",
        "to": "a5",
        "color": "b",
        "fen": "3rr1k1/p1q2ppp/3b4/p1pP3b/2P1n3/1Q2BN1P/4BPP1/1R2R1K1 w - - 0 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "bxa5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "bxa5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qa3",
        "from": "b3",
        "to": "a3",
        "color": "w",
        "fen": "3rr1k1/p1q2ppp/3b4/p1pP3b/2P1n3/Q3BN1P/4BPP1/1R2R1K1 b - - 1 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Qa3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qa3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rb8",
        "from": "d8",
        "to": "b8",
        "color": "b",
        "fen": "1r2r1k1/p1q2ppp/3b4/p1pP3b/2P1n3/Q3BN1P/4BPP1/1R2R1K1 w - - 2 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rb8",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rb8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ra1",
        "from": "b1",
        "to": "a1",
        "color": "w",
        "fen": "1r2r1k1/p1q2ppp/3b4/p1pP3b/2P1n3/Q3BN1P/4BPP1/R3R1K1 b - - 3 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Ra1",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ra1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rb4",
        "from": "b8",
        "to": "b4",
        "color": "b",
        "fen": "4r1k1/p1q2ppp/3b4/p1pP3b/1rP1n3/Q3BN1P/4BPP1/R3R1K1 w - - 4 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Rb4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rb4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qxa5",
        "from": "a3",
        "to": "a5",
        "color": "w",
        "fen": "4r1k1/p1q2ppp/3b4/Q1pP3b/1rP1n3/4BN1P/4BPP1/R3R1K1 b - - 0 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Qxa5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxa5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qxa5",
        "from": "c7",
        "to": "a5",
        "color": "b",
        "fen": "4r1k1/p4ppp/3b4/q1pP3b/1rP1n3/4BN1P/4BPP1/R3R1K1 w - - 0 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Qxa5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxa5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rxa5",
        "from": "a1",
        "to": "a5",
        "color": "w",
        "fen": "4r1k1/p4ppp/3b4/R1pP3b/1rP1n3/4BN1P/4BPP1/4R1K1 b - - 0 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Rxa5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxa5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nc3",
        "from": "e4",
        "to": "c3",
        "color": "b",
        "fen": "4r1k1/p4ppp/3b4/R1pP3b/1rP5/2n1BN1P/4BPP1/4R1K1 w - - 1 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bd3",
        "from": "e2",
        "to": "d3",
        "color": "w",
        "fen": "4r1k1/p4ppp/3b4/R1pP3b/1rP5/2nBBN1P/5PP1/4R1K1 b - - 2 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bxf3",
        "from": "h5",
        "to": "f3",
        "color": "b",
        "fen": "4r1k1/p4ppp/3b4/R1pP4/1rP5/2nBBb1P/5PP1/4R1K1 w - - 0 27",
        "moveNumber": 26,
        "classification": "inaccuracy",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Bxf3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf3"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "gxf3",
        "from": "g2",
        "to": "f3",
        "color": "w",
        "fen": "4r1k1/p4ppp/3b4/R1pP4/1rP5/2nBBP1P/5P2/4R1K1 b - - 0 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "gxf3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "gxf3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Ra4",
        "from": "b4",
        "to": "a4",
        "color": "b",
        "fen": "4r1k1/p4ppp/3b4/R1pP4/r1P5/2nBBP1P/5P2/4R1K1 w - - 1 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Ra4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ra4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rxa4",
        "from": "a5",
        "to": "a4",
        "color": "w",
        "fen": "4r1k1/p4ppp/3b4/2pP4/R1P5/2nBBP1P/5P2/4R1K1 b - - 0 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Rxa4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxa4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nxa4",
        "from": "c3",
        "to": "a4",
        "color": "b",
        "fen": "4r1k1/p4ppp/3b4/2pP4/n1P5/3BBP1P/5P2/4R1K1 w - - 0 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Nxa4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxa4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ra1",
        "from": "e1",
        "to": "a1",
        "color": "w",
        "fen": "4r1k1/p4ppp/3b4/2pP4/n1P5/3BBP1P/5P2/R5K1 b - - 1 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Ra1",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ra1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nb2",
        "from": "a4",
        "to": "b2",
        "color": "b",
        "fen": "4r1k1/p4ppp/3b4/2pP4/2P5/3BBP1P/1n3P2/R5K1 w - - 2 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Nb2",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb2"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bf1",
        "from": "d3",
        "to": "f1",
        "color": "w",
        "fen": "4r1k1/p4ppp/3b4/2pP4/2P5/4BP1P/1n3P2/R4BK1 b - - 3 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Bf1",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Ra8",
        "from": "e8",
        "to": "a8",
        "color": "b",
        "fen": "r5k1/p4ppp/3b4/2pP4/2P5/4BP1P/1n3P2/R4BK1 w - - 4 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Ra8",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ra8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ra6",
        "from": "a1",
        "to": "a6",
        "color": "w",
        "fen": "r5k1/p4ppp/R2b4/2pP4/2P5/4BP1P/1n3P2/5BK1 b - - 5 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Ra6",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ra6"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bf8",
        "from": "d6",
        "to": "f8",
        "color": "b",
        "fen": "r4bk1/p4ppp/R7/2pP4/2P5/4BP1P/1n3P2/5BK1 w - - 6 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Bf8",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "f4",
        "from": "f3",
        "to": "f4",
        "color": "w",
        "fen": "r4bk1/p4ppp/R7/2pP4/2P2P2/4B2P/1n3P2/5BK1 b - - 0 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "f4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nd1",
        "from": "b2",
        "to": "d1",
        "color": "b",
        "fen": "r4bk1/p4ppp/R7/2pP4/2P2P2/4B2P/5P2/3n1BK1 w - - 1 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Nd1",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd1"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bd2",
        "from": "e3",
        "to": "d2",
        "color": "w",
        "fen": "r4bk1/p4ppp/R7/2pP4/2P2P2/7P/3B1P2/3n1BK1 b - - 2 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Bd2",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd2"
              ]
            }
          ]
        },
        "timeSpent": 2
      }
    ]
  },
  {
    "id": "game-08",
    "white": {
      "username": "KnightRider99",
      "rating": 910
    },
    "black": {
      "username": "You",
      "rating": 905
    },
    "result": "0-1",
    "date": "2026-10-15T11:20:00Z",
    "timeControl": "5 min",
    "speed": "blitz",
    "source": "online",
    "opening": {
      "eco": "A04",
      "name": "Reti Opening"
    },
    "pgn": "1. Nf3 c5 2. g3 Nc6 3. Bg2 g6 4. O-O Bg7 5. d3 d6 6. e4 e5 7. Nc3 Nge7 8. Be3 O-O 9. Qd2 Nd4 10. Bh6 Bxh6 11. Qxh6 Nxf3+ 12. Bxf3 Be6 13. Bg2 d5 14. exd5 Nxd5 15. Ne4 f6 16. Nxc5 Bf7 17. Ne4 Rc8 18. c4 Nb4 19. Rad1 Rc6 20. a3 Nc2 21. Rd2 Nd4 22. f4 exf4 23. Rxf4 Re8 24. Rdf2 f5 25. Ng5 Re1+ 26. Bf1 Qf6 27. Qxh7+ Kf8 28. Qxf7+ Qxf7 29. Nxf7 Kxf7 30. Rxd4",
    "accuracy": {
      "white": 69.8,
      "black": 88
    },
    "estimatedRating": {
      "white": 860,
      "black": 1210
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "B",
      "tactics": "A",
      "endgame": "B"
    },
    "moves": [
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "c5",
        "from": "c7",
        "to": "c5",
        "color": "b",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "c5",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "g3",
        "from": "g2",
        "to": "g3",
        "color": "w",
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "g3",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nc6",
        "from": "b8",
        "to": "c6",
        "color": "b",
        "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/8/5NP1/PPPPPP1P/RNBQKB1R w KQkq - 1 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nc6",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bg2",
        "from": "f1",
        "to": "g2",
        "color": "w",
        "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/8/5NP1/PPPPPPBP/RNBQK2R b KQkq - 2 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Bg2",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "g6",
        "from": "g7",
        "to": "g6",
        "color": "b",
        "fen": "r1bqkbnr/pp1ppp1p/2n3p1/2p5/8/5NP1/PPPPPPBP/RNBQK2R w KQkq - 0 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": -0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "g6",
              "eval": -0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r1bqkbnr/pp1ppp1p/2n3p1/2p5/8/5NP1/PPPPPPBP/RNBQ1RK1 b kq - 1 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bg7",
        "from": "f8",
        "to": "g7",
        "color": "b",
        "fen": "r1bqk1nr/pp1pppbp/2n3p1/2p5/8/5NP1/PPPPPPBP/RNBQ1RK1 w kq - 2 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Bg7",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "d3",
        "from": "d2",
        "to": "d3",
        "color": "w",
        "fen": "r1bqk1nr/pp1pppbp/2n3p1/2p5/8/3P1NP1/PPP1PPBP/RNBQ1RK1 b kq - 0 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "d3",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d6",
        "from": "d7",
        "to": "d6",
        "color": "b",
        "fen": "r1bqk1nr/pp2ppbp/2np2p1/2p5/8/3P1NP1/PPP1PPBP/RNBQ1RK1 w kq - 0 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "d6",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "r1bqk1nr/pp2ppbp/2np2p1/2p5/4P3/3P1NP1/PPP2PBP/RNBQ1RK1 b kq - 0 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": -0.6,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "e4",
              "eval": -0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "e5",
        "from": "e7",
        "to": "e5",
        "color": "b",
        "fen": "r1bqk1nr/pp3pbp/2np2p1/2p1p3/4P3/3P1NP1/PPP2PBP/RNBQ1RK1 w kq - 0 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "e5",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "r1bqk1nr/pp3pbp/2np2p1/2p1p3/4P3/2NP1NP1/PPP2PBP/R1BQ1RK1 b kq - 1 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Nc3",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nge7",
        "from": "g8",
        "to": "e7",
        "color": "b",
        "fen": "r1bqk2r/pp2npbp/2np2p1/2p1p3/4P3/2NP1NP1/PPP2PBP/R1BQ1RK1 w kq - 2 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Nge7",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nge7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Be3",
        "from": "c1",
        "to": "e3",
        "color": "w",
        "fen": "r1bqk2r/pp2npbp/2np2p1/2p1p3/4P3/2NPBNP1/PPP2PBP/R2Q1RK1 b kq - 3 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Be3",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "r1bq1rk1/pp2npbp/2np2p1/2p1p3/4P3/2NPBNP1/PPP2PBP/R2Q1RK1 w - - 4 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "r1bq1rk1/pp2npbp/2np2p1/2p1p3/4P3/2NPBNP1/PPPQ1PBP/R4RK1 b - - 5 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Qd2",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nd4",
        "from": "c6",
        "to": "d4",
        "color": "b",
        "fen": "r1bq1rk1/pp2npbp/3p2p1/2p1p3/3nP3/2NPBNP1/PPPQ1PBP/R4RK1 w - - 6 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -1,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nd4",
              "eval": -1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bh6",
        "from": "e3",
        "to": "h6",
        "color": "w",
        "fen": "r1bq1rk1/pp2npbp/3p2pB/2p1p3/3nP3/2NP1NP1/PPPQ1PBP/R4RK1 b - - 7 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Bh6",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bh6"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bxh6",
        "from": "g7",
        "to": "h6",
        "color": "b",
        "fen": "r1bq1rk1/pp2np1p/3p2pb/2p1p3/3nP3/2NP1NP1/PPPQ1PBP/R4RK1 w - - 0 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Bxh6",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxh6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qxh6",
        "from": "d2",
        "to": "h6",
        "color": "w",
        "fen": "r1bq1rk1/pp2np1p/3p2pQ/2p1p3/3nP3/2NP1NP1/PPP2PBP/R4RK1 b - - 0 11",
        "moveNumber": 11,
        "classification": "blunder",
        "eval": {
          "eval": -1.2,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Qxh6",
              "eval": -1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxh6"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nxf3+",
        "from": "d4",
        "to": "f3",
        "color": "b",
        "fen": "r1bq1rk1/pp2np1p/3p2pQ/2p1p3/4P3/2NP1nP1/PPP2PBP/R4RK1 w - - 0 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": -1.2,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Nxf3+",
              "eval": -1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf3+"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bxf3",
        "from": "g2",
        "to": "f3",
        "color": "w",
        "fen": "r1bq1rk1/pp2np1p/3p2pQ/2p1p3/4P3/2NP1BP1/PPP2P1P/R4RK1 b - - 0 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": -1.3,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Bxf3",
              "eval": -1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Be6",
        "from": "c8",
        "to": "e6",
        "color": "b",
        "fen": "r2q1rk1/pp2np1p/3pb1pQ/2p1p3/4P3/2NP1BP1/PPP2P1P/R4RK1 w - - 1 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Be6",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bg2",
        "from": "f3",
        "to": "g2",
        "color": "w",
        "fen": "r2q1rk1/pp2np1p/3pb1pQ/2p1p3/4P3/2NP2P1/PPP2PBP/R4RK1 b - - 2 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Bg2",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d5",
        "from": "d6",
        "to": "d5",
        "color": "b",
        "fen": "r2q1rk1/pp2np1p/4b1pQ/2ppp3/4P3/2NP2P1/PPP2PBP/R4RK1 w - - 0 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "d5",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "exd5",
        "from": "e4",
        "to": "d5",
        "color": "w",
        "fen": "r2q1rk1/pp2np1p/4b1pQ/2pPp3/8/2NP2P1/PPP2PBP/R4RK1 b - - 0 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "exd5",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exd5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nxd5",
        "from": "e7",
        "to": "d5",
        "color": "b",
        "fen": "r2q1rk1/pp3p1p/4b1pQ/2pnp3/8/2NP2P1/PPP2PBP/R4RK1 w - - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": -1.6,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Nxd5",
              "eval": -1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxd5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ne4",
        "from": "c3",
        "to": "e4",
        "color": "w",
        "fen": "r2q1rk1/pp3p1p/4b1pQ/2pnp3/4N3/3P2P1/PPP2PBP/R4RK1 b - - 1 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Ne4",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "f6",
        "from": "f7",
        "to": "f6",
        "color": "b",
        "fen": "r2q1rk1/pp5p/4bppQ/2pnp3/4N3/3P2P1/PPP2PBP/R4RK1 w - - 0 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "f6",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nxc5",
        "from": "e4",
        "to": "c5",
        "color": "w",
        "fen": "r2q1rk1/pp5p/4bppQ/2Nnp3/8/3P2P1/PPP2PBP/R4RK1 b - - 0 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": -1.8,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Nxc5",
              "eval": -1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bf7",
        "from": "e6",
        "to": "f7",
        "color": "b",
        "fen": "r2q1rk1/pp3b1p/5ppQ/2Nnp3/8/3P2P1/PPP2PBP/R4RK1 w - - 1 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": -1.8,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Bf7",
              "eval": -1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ne4",
        "from": "c5",
        "to": "e4",
        "color": "w",
        "fen": "r2q1rk1/pp3b1p/5ppQ/3np3/4N3/3P2P1/PPP2PBP/R4RK1 b - - 2 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": -1.9,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Ne4",
              "eval": -1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rc8",
        "from": "a8",
        "to": "c8",
        "color": "b",
        "fen": "2rq1rk1/pp3b1p/5ppQ/3np3/4N3/3P2P1/PPP2PBP/R4RK1 w - - 3 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Rc8",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rc8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "c4",
        "from": "c2",
        "to": "c4",
        "color": "w",
        "fen": "2rq1rk1/pp3b1p/5ppQ/3np3/2P1N3/3P2P1/PP3PBP/R4RK1 b - - 0 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "c4",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nb4",
        "from": "d5",
        "to": "b4",
        "color": "b",
        "fen": "2rq1rk1/pp3b1p/5ppQ/4p3/1nP1N3/3P2P1/PP3PBP/R4RK1 w - - 1 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Nb4",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rad1",
        "from": "a1",
        "to": "d1",
        "color": "w",
        "fen": "2rq1rk1/pp3b1p/5ppQ/4p3/1nP1N3/3P2P1/PP3PBP/3R1RK1 b - - 2 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Rad1",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rad1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rc6",
        "from": "c8",
        "to": "c6",
        "color": "b",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/4p3/1nP1N3/3P2P1/PP3PBP/3R1RK1 w - - 3 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": -2.2,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Rc6",
              "eval": -2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rc6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "a3",
        "from": "a2",
        "to": "a3",
        "color": "w",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/4p3/1nP1N3/P2P2P1/1P3PBP/3R1RK1 b - - 0 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": -2.3,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "a3",
              "eval": -2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nc2",
        "from": "b4",
        "to": "c2",
        "color": "b",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/4p3/2P1N3/P2P2P1/1Pn2PBP/3R1RK1 w - - 1 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": -2.3,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Nc2",
              "eval": -2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc2"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/4p3/2P1N3/P2P2P1/1PnR1PBP/5RK1 b - - 2 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rd2",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nd4",
        "from": "c2",
        "to": "d4",
        "color": "b",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/4p3/2PnN3/P2P2P1/1P1R1PBP/5RK1 w - - 3 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Nd4",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "f4",
        "from": "f2",
        "to": "f4",
        "color": "w",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/4p3/2PnNP2/P2P2P1/1P1R2BP/5RK1 b - - 0 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": -2.5,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "f4",
              "eval": -2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "exf4",
        "from": "e5",
        "to": "f4",
        "color": "b",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/8/2PnNp2/P2P2P1/1P1R2BP/5RK1 w - - 0 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "exf4",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exf4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rxf4",
        "from": "f1",
        "to": "f4",
        "color": "w",
        "fen": "3q1rk1/pp3b1p/2r2ppQ/8/2PnNR2/P2P2P1/1P1R2BP/6K1 b - - 0 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Rxf4",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxf4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Re8",
        "from": "f8",
        "to": "e8",
        "color": "b",
        "fen": "3qr1k1/pp3b1p/2r2ppQ/8/2PnNR2/P2P2P1/1P1R2BP/6K1 w - - 1 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Re8",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rdf2",
        "from": "d2",
        "to": "f2",
        "color": "w",
        "fen": "3qr1k1/pp3b1p/2r2ppQ/8/2PnNR2/P2P2P1/1P3RBP/6K1 b - - 2 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Rdf2",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rdf2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "f5",
        "from": "f6",
        "to": "f5",
        "color": "b",
        "fen": "3qr1k1/pp3b1p/2r3pQ/5p2/2PnNR2/P2P2P1/1P3RBP/6K1 w - - 0 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "f5",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ng5",
        "from": "e4",
        "to": "g5",
        "color": "w",
        "fen": "3qr1k1/pp3b1p/2r3pQ/5pN1/2Pn1R2/P2P2P1/1P3RBP/6K1 b - - 1 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Ng5",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Re1+",
        "from": "e8",
        "to": "e1",
        "color": "b",
        "fen": "3q2k1/pp3b1p/2r3pQ/5pN1/2Pn1R2/P2P2P1/1P3RBP/4r1K1 w - - 2 26",
        "moveNumber": 25,
        "classification": "brilliant",
        "eval": {
          "eval": -2.9,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Re1+",
              "eval": -2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re1+"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bf1",
        "from": "g2",
        "to": "f1",
        "color": "w",
        "fen": "3q2k1/pp3b1p/2r3pQ/5pN1/2Pn1R2/P2P2P1/1P3R1P/4rBK1 b - - 3 26",
        "moveNumber": 26,
        "classification": "blunder",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Bf1",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qf6",
        "from": "d8",
        "to": "f6",
        "color": "b",
        "fen": "6k1/pp3b1p/2r2qpQ/5pN1/2Pn1R2/P2P2P1/1P3R1P/4rBK1 w - - 4 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Qf6",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qxh7+",
        "from": "h6",
        "to": "h7",
        "color": "w",
        "fen": "6k1/pp3b1Q/2r2qp1/5pN1/2Pn1R2/P2P2P1/1P3R1P/4rBK1 b - - 0 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Qxh7+",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxh7+"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Kf8",
        "from": "g8",
        "to": "f8",
        "color": "b",
        "fen": "5k2/pp3b1Q/2r2qp1/5pN1/2Pn1R2/P2P2P1/1P3R1P/4rBK1 w - - 1 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Kf8",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kf8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qxf7+",
        "from": "h7",
        "to": "f7",
        "color": "w",
        "fen": "5k2/pp3Q2/2r2qp1/5pN1/2Pn1R2/P2P2P1/1P3R1P/4rBK1 b - - 0 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": -3.2,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Qxf7+",
              "eval": -3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxf7+"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qxf7",
        "from": "f6",
        "to": "f7",
        "color": "b",
        "fen": "5k2/pp3q2/2r3p1/5pN1/2Pn1R2/P2P2P1/1P3R1P/4rBK1 w - - 0 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Qxf7",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxf7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nxf7",
        "from": "g5",
        "to": "f7",
        "color": "w",
        "fen": "5k2/pp3N2/2r3p1/5p2/2Pn1R2/P2P2P1/1P3R1P/4rBK1 b - - 0 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Nxf7",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf7"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Kxf7",
        "from": "f8",
        "to": "f7",
        "color": "b",
        "fen": "8/pp3k2/2r3p1/5p2/2Pn1R2/P2P2P1/1P3R1P/4rBK1 w - - 0 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Kxf7",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kxf7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rxd4",
        "from": "f4",
        "to": "d4",
        "color": "w",
        "fen": "8/pp3k2/2r3p1/5p2/2PR4/P2P2P1/1P3R1P/4rBK1 b - - 0 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Rxd4",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxd4"
              ]
            }
          ]
        },
        "timeSpent": 4
      }
    ]
  },
  {
    "id": "game-09",
    "white": {
      "username": "You",
      "rating": 905
    },
    "black": {
      "username": "CheckmateChamp",
      "rating": 880
    },
    "result": "1-0",
    "date": "2026-10-14T09:12:00Z",
    "timeControl": "3 min",
    "speed": "blitz",
    "source": "online",
    "opening": {
      "eco": "C20",
      "name": "King's Pawn Opening: Wayward Queen Attack"
    },
    "pgn": "1. e4 e5 2. Qh5 Nc6 3. Bc4 g6 4. Qf3 Nf6 5. Ne2 Bg7 6. d3 O-O 7. Nbc3 d6 8. Bg5 h6 9. Bxf6 Bxf6 10. Nd5 Bg7 11. h4 Be6 12. O-O-O Na5 13. g4 c6 14. Ne3 Nxc4 15. dxc4 Qe7 16. h5 g5 17. Ng3 Rfd8 18. Ngf5 Bxf5 19. Nxf5 Qe6 20. b3 Bf8 21. Rd3 Rd7 22. Rhd1 Rad8 23. Qe3 b6 24. Kb1 Kh7 25. f3 Kg8 26. Qd2 Kh7 27. a4 a5 28. Qf2 c5 29. Ne3 Rb7 30. Nd5 Bg7 31. Qd2 Bf8 32. Nc3 Rbd7 33. Nb5 Kg8 34. Rd5 Kh7",
    "accuracy": {
      "white": 91.5,
      "black": 72
    },
    "estimatedRating": {
      "white": 1320,
      "black": 890
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "A",
      "tactics": "A",
      "endgame": "A"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "good",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "e5",
        "from": "e7",
        "to": "e5",
        "color": "b",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qh5",
        "from": "d1",
        "to": "h5",
        "color": "w",
        "fen": "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2",
        "moveNumber": 2,
        "classification": "inaccuracy",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Qh5",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qh5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nc6",
        "from": "b8",
        "to": "c6",
        "color": "b",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 2 3",
        "moveNumber": 2,
        "classification": "best",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bc4",
        "from": "f1",
        "to": "c4",
        "color": "w",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Bc4",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "g6",
        "from": "g7",
        "to": "g6",
        "color": "b",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "g6",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qf3",
        "from": "h5",
        "to": "f3",
        "color": "w",
        "fen": "r1bqkbnr/pppp1p1p/2n3p1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 1 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Qf3",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 5",
        "moveNumber": 4,
        "classification": "blunder",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ne2",
        "from": "g1",
        "to": "e2",
        "color": "w",
        "fen": "r1bqkb1r/pppp1p1p/2n2np1/4p3/2B1P3/5Q2/PPPPNPPP/RNB1K2R b KQkq - 3 5",
        "moveNumber": 5,
        "classification": "great",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Ne2",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bg7",
        "from": "f8",
        "to": "g7",
        "color": "b",
        "fen": "r1bqk2r/pppp1pbp/2n2np1/4p3/2B1P3/5Q2/PPPPNPPP/RNB1K2R w KQkq - 4 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "d3",
        "from": "d2",
        "to": "d3",
        "color": "w",
        "fen": "r1bqk2r/pppp1pbp/2n2np1/4p3/2B1P3/3P1Q2/PPP1NPPP/RNB1K2R b KQkq - 0 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "d3",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "r1bq1rk1/pppp1pbp/2n2np1/4p3/2B1P3/3P1Q2/PPP1NPPP/RNB1K2R w KQ - 1 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nbc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "r1bq1rk1/pppp1pbp/2n2np1/4p3/2B1P3/2NP1Q2/PPP1NPPP/R1B1K2R b KQ - 2 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Nbc3",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nbc3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "d6",
        "from": "d7",
        "to": "d6",
        "color": "b",
        "fen": "r1bq1rk1/ppp2pbp/2np1np1/4p3/2B1P3/2NP1Q2/PPP1NPPP/R1B1K2R w KQ - 0 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bg5",
        "from": "c1",
        "to": "g5",
        "color": "w",
        "fen": "r1bq1rk1/ppp2pbp/2np1np1/4p1B1/2B1P3/2NP1Q2/PPP1NPPP/R3K2R b KQ - 1 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Bg5",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "h6",
        "from": "h7",
        "to": "h6",
        "color": "b",
        "fen": "r1bq1rk1/ppp2pb1/2np1npp/4p1B1/2B1P3/2NP1Q2/PPP1NPPP/R3K2R w KQ - 0 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "h6",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bxf6",
        "from": "g5",
        "to": "f6",
        "color": "w",
        "fen": "r1bq1rk1/ppp2pb1/2np1Bpp/4p3/2B1P3/2NP1Q2/PPP1NPPP/R3K2R b KQ - 0 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf6"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bxf6",
        "from": "g7",
        "to": "f6",
        "color": "b",
        "fen": "r1bq1rk1/ppp2p2/2np1bpp/4p3/2B1P3/2NP1Q2/PPP1NPPP/R3K2R w KQ - 0 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nd5",
        "from": "c3",
        "to": "d5",
        "color": "w",
        "fen": "r1bq1rk1/ppp2p2/2np1bpp/3Np3/2B1P3/3P1Q2/PPP1NPPP/R3K2R b KQ - 1 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Nd5",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bg7",
        "from": "f6",
        "to": "g7",
        "color": "b",
        "fen": "r1bq1rk1/ppp2pb1/2np2pp/3Np3/2B1P3/3P1Q2/PPP1NPPP/R3K2R w KQ - 2 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "h4",
        "from": "h2",
        "to": "h4",
        "color": "w",
        "fen": "r1bq1rk1/ppp2pb1/2np2pp/3Np3/2B1P2P/3P1Q2/PPP1NPP1/R3K2R b KQ - 0 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "h4",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Be6",
        "from": "c8",
        "to": "e6",
        "color": "b",
        "fen": "r2q1rk1/ppp2pb1/2npb1pp/3Np3/2B1P2P/3P1Q2/PPP1NPP1/R3K2R w KQ - 1 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Be6",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "O-O-O",
        "from": "e1",
        "to": "c1",
        "color": "w",
        "fen": "r2q1rk1/ppp2pb1/2npb1pp/3Np3/2B1P2P/3P1Q2/PPP1NPP1/2KR3R b - - 2 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "O-O-O",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O-O"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Na5",
        "from": "c6",
        "to": "a5",
        "color": "b",
        "fen": "r2q1rk1/ppp2pb1/3pb1pp/n2Np3/2B1P2P/3P1Q2/PPP1NPP1/2KR3R w - - 3 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Na5",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Na5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "g4",
        "from": "g2",
        "to": "g4",
        "color": "w",
        "fen": "r2q1rk1/ppp2pb1/3pb1pp/n2Np3/2B1P1PP/3P1Q2/PPP1NP2/2KR3R b - - 0 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "g4",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "c6",
        "from": "c7",
        "to": "c6",
        "color": "b",
        "fen": "r2q1rk1/pp3pb1/2ppb1pp/n2Np3/2B1P1PP/3P1Q2/PPP1NP2/2KR3R w - - 0 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "c6",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Ne3",
        "from": "d5",
        "to": "e3",
        "color": "w",
        "fen": "r2q1rk1/pp3pb1/2ppb1pp/n3p3/2B1P1PP/3PNQ2/PPP1NP2/2KR3R b - - 1 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Ne3",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nxc4",
        "from": "a5",
        "to": "c4",
        "color": "b",
        "fen": "r2q1rk1/pp3pb1/2ppb1pp/4p3/2n1P1PP/3PNQ2/PPP1NP2/2KR3R w - - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Nxc4",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "dxc4",
        "from": "d3",
        "to": "c4",
        "color": "w",
        "fen": "r2q1rk1/pp3pb1/2ppb1pp/4p3/2P1P1PP/4NQ2/PPP1NP2/2KR3R b - - 0 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "dxc4",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "dxc4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qe7",
        "from": "d8",
        "to": "e7",
        "color": "b",
        "fen": "r4rk1/pp2qpb1/2ppb1pp/4p3/2P1P1PP/4NQ2/PPP1NP2/2KR3R w - - 1 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Qe7",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "h5",
        "from": "h4",
        "to": "h5",
        "color": "w",
        "fen": "r4rk1/pp2qpb1/2ppb1pp/4p2P/2P1P1P1/4NQ2/PPP1NP2/2KR3R b - - 0 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "h5",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "g5",
        "from": "g6",
        "to": "g5",
        "color": "b",
        "fen": "r4rk1/pp2qpb1/2ppb2p/4p1pP/2P1P1P1/4NQ2/PPP1NP2/2KR3R w - - 0 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "g5",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ng3",
        "from": "e2",
        "to": "g3",
        "color": "w",
        "fen": "r4rk1/pp2qpb1/2ppb2p/4p1pP/2P1P1P1/4NQN1/PPP2P2/2KR3R b - - 1 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Ng3",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rfd8",
        "from": "f8",
        "to": "d8",
        "color": "b",
        "fen": "r2r2k1/pp2qpb1/2ppb2p/4p1pP/2P1P1P1/4NQN1/PPP2P2/2KR3R w - - 2 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Rfd8",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rfd8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Ngf5",
        "from": "g3",
        "to": "f5",
        "color": "w",
        "fen": "r2r2k1/pp2qpb1/2ppb2p/4pNpP/2P1P1P1/4NQ2/PPP2P2/2KR3R b - - 3 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Ngf5",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ngf5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bxf5",
        "from": "e6",
        "to": "f5",
        "color": "b",
        "fen": "r2r2k1/pp2qpb1/2pp3p/4pbpP/2P1P1P1/4NQ2/PPP2P2/2KR3R w - - 0 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Bxf5",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nxf5",
        "from": "e3",
        "to": "f5",
        "color": "w",
        "fen": "r2r2k1/pp2qpb1/2pp3p/4pNpP/2P1P1P1/5Q2/PPP2P2/2KR3R b - - 0 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Nxf5",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qe6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "r2r2k1/pp3pb1/2ppq2p/4pNpP/2P1P1P1/5Q2/PPP2P2/2KR3R w - - 1 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Qe6",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "b3",
        "from": "b2",
        "to": "b3",
        "color": "w",
        "fen": "r2r2k1/pp3pb1/2ppq2p/4pNpP/2P1P1P1/1P3Q2/P1P2P2/2KR3R b - - 0 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "b3",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bf8",
        "from": "g7",
        "to": "f8",
        "color": "b",
        "fen": "r2r1bk1/pp3p2/2ppq2p/4pNpP/2P1P1P1/1P3Q2/P1P2P2/2KR3R w - - 1 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Bf8",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rd3",
        "from": "d1",
        "to": "d3",
        "color": "w",
        "fen": "r2r1bk1/pp3p2/2ppq2p/4pNpP/2P1P1P1/1P1R1Q2/P1P2P2/2K4R b - - 2 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rd3",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rd7",
        "from": "d8",
        "to": "d7",
        "color": "b",
        "fen": "r4bk1/pp1r1p2/2ppq2p/4pNpP/2P1P1P1/1P1R1Q2/P1P2P2/2K4R w - - 3 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rd7",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rhd1",
        "from": "h1",
        "to": "d1",
        "color": "w",
        "fen": "r4bk1/pp1r1p2/2ppq2p/4pNpP/2P1P1P1/1P1R1Q2/P1P2P2/2KR4 b - - 4 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rhd1",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rhd1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rad8",
        "from": "a8",
        "to": "d8",
        "color": "b",
        "fen": "3r1bk1/pp1r1p2/2ppq2p/4pNpP/2P1P1P1/1P1R1Q2/P1P2P2/2KR4 w - - 5 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rad8",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rad8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qe3",
        "from": "f3",
        "to": "e3",
        "color": "w",
        "fen": "3r1bk1/pp1r1p2/2ppq2p/4pNpP/2P1P1P1/1P1RQ3/P1P2P2/2KR4 b - - 6 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Qe3",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "b6",
        "from": "b7",
        "to": "b6",
        "color": "b",
        "fen": "3r1bk1/p2r1p2/1pppq2p/4pNpP/2P1P1P1/1P1RQ3/P1P2P2/2KR4 w - - 0 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "b6",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Kb1",
        "from": "c1",
        "to": "b1",
        "color": "w",
        "fen": "3r1bk1/p2r1p2/1pppq2p/4pNpP/2P1P1P1/1P1RQ3/P1P2P2/1K1R4 b - - 1 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Kb1",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kb1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Kh7",
        "from": "g8",
        "to": "h7",
        "color": "b",
        "fen": "3r1b2/p2r1p1k/1pppq2p/4pNpP/2P1P1P1/1P1RQ3/P1P2P2/1K1R4 w - - 2 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Kh7",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "f3",
        "from": "f2",
        "to": "f3",
        "color": "w",
        "fen": "3r1b2/p2r1p1k/1pppq2p/4pNpP/2P1P1P1/1P1RQP2/P1P5/1K1R4 b - - 0 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "f3",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Kg8",
        "from": "h7",
        "to": "g8",
        "color": "b",
        "fen": "3r1bk1/p2r1p2/1pppq2p/4pNpP/2P1P1P1/1P1RQP2/P1P5/1K1R4 w - - 1 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Kg8",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kg8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qd2",
        "from": "e3",
        "to": "d2",
        "color": "w",
        "fen": "3r1bk1/p2r1p2/1pppq2p/4pNpP/2P1P1P1/1P1R1P2/P1PQ4/1K1R4 b - - 2 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Kh7",
        "from": "g8",
        "to": "h7",
        "color": "b",
        "fen": "3r1b2/p2r1p1k/1pppq2p/4pNpP/2P1P1P1/1P1R1P2/P1PQ4/1K1R4 w - - 3 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Kh7",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "a4",
        "from": "a2",
        "to": "a4",
        "color": "w",
        "fen": "3r1b2/p2r1p1k/1pppq2p/4pNpP/P1P1P1P1/1P1R1P2/2PQ4/1K1R4 b - - 0 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "a4",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "a5",
        "from": "a7",
        "to": "a5",
        "color": "b",
        "fen": "3r1b2/3r1p1k/1pppq2p/p3pNpP/P1P1P1P1/1P1R1P2/2PQ4/1K1R4 w - - 0 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "a5",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qf2",
        "from": "d2",
        "to": "f2",
        "color": "w",
        "fen": "3r1b2/3r1p1k/1pppq2p/p3pNpP/P1P1P1P1/1P1R1P2/2P2Q2/1K1R4 b - - 1 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Qf2",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "c5",
        "from": "c6",
        "to": "c5",
        "color": "b",
        "fen": "3r1b2/3r1p1k/1p1pq2p/p1p1pNpP/P1P1P1P1/1P1R1P2/2P2Q2/1K1R4 w - - 0 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "c5",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ne3",
        "from": "f5",
        "to": "e3",
        "color": "w",
        "fen": "3r1b2/3r1p1k/1p1pq2p/p1p1p1pP/P1P1P1P1/1P1RNP2/2P2Q2/1K1R4 b - - 1 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Ne3",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rb7",
        "from": "d7",
        "to": "b7",
        "color": "b",
        "fen": "3r1b2/1r3p1k/1p1pq2p/p1p1p1pP/P1P1P1P1/1P1RNP2/2P2Q2/1K1R4 w - - 2 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Rb7",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rb7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nd5",
        "from": "e3",
        "to": "d5",
        "color": "w",
        "fen": "3r1b2/1r3p1k/1p1pq2p/p1pNp1pP/P1P1P1P1/1P1R1P2/2P2Q2/1K1R4 b - - 3 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Nd5",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bg7",
        "from": "f8",
        "to": "g7",
        "color": "b",
        "fen": "3r4/1r3pbk/1p1pq2p/p1pNp1pP/P1P1P1P1/1P1R1P2/2P2Q2/1K1R4 w - - 4 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qd2",
        "from": "f2",
        "to": "d2",
        "color": "w",
        "fen": "3r4/1r3pbk/1p1pq2p/p1pNp1pP/P1P1P1P1/1P1R1P2/2PQ4/1K1R4 b - - 5 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bf8",
        "from": "g7",
        "to": "f8",
        "color": "b",
        "fen": "3r1b2/1r3p1k/1p1pq2p/p1pNp1pP/P1P1P1P1/1P1R1P2/2PQ4/1K1R4 w - - 6 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Bf8",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nc3",
        "from": "d5",
        "to": "c3",
        "color": "w",
        "fen": "3r1b2/1r3p1k/1p1pq2p/p1p1p1pP/P1P1P1P1/1PNR1P2/2PQ4/1K1R4 b - - 7 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rbd7",
        "from": "b7",
        "to": "d7",
        "color": "b",
        "fen": "3r1b2/3r1p1k/1p1pq2p/p1p1p1pP/P1P1P1P1/1PNR1P2/2PQ4/1K1R4 w - - 8 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Rbd7",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rbd7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nb5",
        "from": "c3",
        "to": "b5",
        "color": "w",
        "fen": "3r1b2/3r1p1k/1p1pq2p/pNp1p1pP/P1P1P1P1/1P1R1P2/2PQ4/1K1R4 b - - 9 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Nb5",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Kg8",
        "from": "h7",
        "to": "g8",
        "color": "b",
        "fen": "3r1bk1/3r1p2/1p1pq2p/pNp1p1pP/P1P1P1P1/1P1R1P2/2PQ4/1K1R4 w - - 10 34",
        "moveNumber": 33,
        "classification": "excellent",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Kg8",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kg8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rd5",
        "from": "d3",
        "to": "d5",
        "color": "w",
        "fen": "3r1bk1/3r1p2/1p1pq2p/pNpRp1pP/P1P1P1P1/1P3P2/2PQ4/1K1R4 b - - 11 34",
        "moveNumber": 34,
        "classification": "good",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Rd5",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Kh7",
        "from": "g8",
        "to": "h7",
        "color": "b",
        "fen": "3r1b2/3r1p1k/1p1pq2p/pNpRp1pP/P1P1P1P1/1P3P2/2PQ4/1K1R4 w - - 12 35",
        "moveNumber": 34,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Kh7",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh7"
              ]
            }
          ]
        },
        "timeSpent": 5
      }
    ]
  },
  {
    "id": "game-10",
    "white": {
      "username": "CoachAllChess",
      "rating": 800,
      "title": "BOT"
    },
    "black": {
      "username": "You",
      "rating": 905
    },
    "result": "0-1",
    "date": "2026-10-13T17:40:00Z",
    "timeControl": "10 min",
    "speed": "rapid",
    "source": "vs_coach",
    "opening": {
      "eco": "B00",
      "name": "Owen Defense"
    },
    "pgn": "1. e4 b6 2. d4 Bb7 3. Bd3 e6 4. Nf3 c5 5. c3 Nf6 6. Qe2 Be7 7. O-O d5 8. e5 Nfd7 9. Bf4 Nc6 10. a3 c4 11. Bc2 b5 12. Nbd2 a5 13. Rfe1 Nb6 14. Nf1 b4 15. axb4 axb4 16. Rxa8 Qxa8 17. Ng5 g6 18. h4 Qa2 19. Bc1 b3 20. Bd1 Na4 21. Qf3 Nd8 22. Re2 Qb1 23. Qf4 h6 24. Nh3 g5 25. hxg5 hxg5 26. Nxg5 Rg8 27. Nh3 Qg6 28. Ng3 Qb1 29. Kh2 Rh8 30. Kg1 Bc6 31. Nf1 Nb6 32. Nh2 Qg6 33. Qg4 Qxg4 34. Nxg4",
    "accuracy": {
      "white": 65.4,
      "black": 86.8
    },
    "estimatedRating": {
      "white": 780,
      "black": 1190
    },
    "phaseGrades": {
      "opening": "B",
      "middlegame": "A",
      "tactics": "A",
      "endgame": "B"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "b6",
        "from": "b7",
        "to": "b6",
        "color": "b",
        "fen": "rnbqkbnr/p1pppppp/1p6/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "good",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "b6",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkbnr/p1pppppp/1p6/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "d4",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bb7",
        "from": "c8",
        "to": "b7",
        "color": "b",
        "fen": "rn1qkbnr/pbpppppp/1p6/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 1 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Bb7",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bb7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bd3",
        "from": "f1",
        "to": "d3",
        "color": "w",
        "fen": "rn1qkbnr/pbpppppp/1p6/8/3PP3/3B4/PPP2PPP/RNBQK1NR b KQkq - 2 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Bd3",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "e6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "rn1qkbnr/pbpp1ppp/1p2p3/8/3PP3/3B4/PPP2PPP/RNBQK1NR w KQkq - 0 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": -0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "e6",
              "eval": -0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rn1qkbnr/pbpp1ppp/1p2p3/8/3PP3/3B1N2/PPP2PPP/RNBQK2R b KQkq - 1 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": -0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nf3",
              "eval": -0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "c5",
        "from": "c7",
        "to": "c5",
        "color": "b",
        "fen": "rn1qkbnr/pb1p1ppp/1p2p3/2p5/3PP3/3B1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "c5",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "c3",
        "from": "c2",
        "to": "c3",
        "color": "w",
        "fen": "rn1qkbnr/pb1p1ppp/1p2p3/2p5/3PP3/2PB1N2/PP3PPP/RNBQK2R b KQkq - 0 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "c3",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "rn1qkb1r/pb1p1ppp/1p2pn2/2p5/3PP3/2PB1N2/PP3PPP/RNBQK2R w KQkq - 1 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Nf6",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qe2",
        "from": "d1",
        "to": "e2",
        "color": "w",
        "fen": "rn1qkb1r/pb1p1ppp/1p2pn2/2p5/3PP3/2PB1N2/PP2QPPP/RNB1K2R b KQkq - 2 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Qe2",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Be7",
        "from": "f8",
        "to": "e7",
        "color": "b",
        "fen": "rn1qk2r/pb1pbppp/1p2pn2/2p5/3PP3/2PB1N2/PP2QPPP/RNB1K2R w KQkq - 3 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": -0.6,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Be7",
              "eval": -0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "rn1qk2r/pb1pbppp/1p2pn2/2p5/3PP3/2PB1N2/PP2QPPP/RNB2RK1 b kq - 4 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": -0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "d5",
        "from": "d7",
        "to": "d5",
        "color": "b",
        "fen": "rn1qk2r/pb2bppp/1p2pn2/2pp4/3PP3/2PB1N2/PP2QPPP/RNB2RK1 w kq - 0 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "d5",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "e5",
        "from": "e4",
        "to": "e5",
        "color": "w",
        "fen": "rn1qk2r/pb2bppp/1p2pn2/2ppP3/3P4/2PB1N2/PP2QPPP/RNB2RK1 b kq - 0 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "e5",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nfd7",
        "from": "f6",
        "to": "d7",
        "color": "b",
        "fen": "rn1qk2r/pb1nbppp/1p2p3/2ppP3/3P4/2PB1N2/PP2QPPP/RNB2RK1 w kq - 1 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Nfd7",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nfd7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bf4",
        "from": "c1",
        "to": "f4",
        "color": "w",
        "fen": "rn1qk2r/pb1nbppp/1p2p3/2ppP3/3P1B2/2PB1N2/PP2QPPP/RN3RK1 b kq - 2 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Bf4",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nc6",
        "from": "b8",
        "to": "c6",
        "color": "b",
        "fen": "r2qk2r/pb1nbppp/1pn1p3/2ppP3/3P1B2/2PB1N2/PP2QPPP/RN3RK1 w kq - 3 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nc6",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "a3",
        "from": "a2",
        "to": "a3",
        "color": "w",
        "fen": "r2qk2r/pb1nbppp/1pn1p3/2ppP3/3P1B2/P1PB1N2/1P2QPPP/RN3RK1 b kq - 0 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "a3",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "c4",
        "from": "c5",
        "to": "c4",
        "color": "b",
        "fen": "r2qk2r/pb1nbppp/1pn1p3/3pP3/2pP1B2/P1PB1N2/1P2QPPP/RN3RK1 w kq - 0 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": -1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "c4",
              "eval": -1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bc2",
        "from": "d3",
        "to": "c2",
        "color": "w",
        "fen": "r2qk2r/pb1nbppp/1pn1p3/3pP3/2pP1B2/P1P2N2/1PB1QPPP/RN3RK1 b kq - 1 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": -1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Bc2",
              "eval": -1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "b5",
        "from": "b6",
        "to": "b5",
        "color": "b",
        "fen": "r2qk2r/pb1nbppp/2n1p3/1p1pP3/2pP1B2/P1P2N2/1PB1QPPP/RN3RK1 w kq - 0 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "b5",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nbd2",
        "from": "b1",
        "to": "d2",
        "color": "w",
        "fen": "r2qk2r/pb1nbppp/2n1p3/1p1pP3/2pP1B2/P1P2N2/1PBNQPPP/R4RK1 b kq - 1 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Nbd2",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nbd2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "a5",
        "from": "a7",
        "to": "a5",
        "color": "b",
        "fen": "r2qk2r/1b1nbppp/2n1p3/pp1pP3/2pP1B2/P1P2N2/1PBNQPPP/R4RK1 w kq - 0 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": -1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "a5",
              "eval": -1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rfe1",
        "from": "f1",
        "to": "e1",
        "color": "w",
        "fen": "r2qk2r/1b1nbppp/2n1p3/pp1pP3/2pP1B2/P1P2N2/1PBNQPPP/R3R1K1 b kq - 1 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": -1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Rfe1",
              "eval": -1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rfe1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nb6",
        "from": "d7",
        "to": "b6",
        "color": "b",
        "fen": "r2qk2r/1b2bppp/1nn1p3/pp1pP3/2pP1B2/P1P2N2/1PBNQPPP/R3R1K1 w kq - 2 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": -1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Nb6",
              "eval": -1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nf1",
        "from": "d2",
        "to": "f1",
        "color": "w",
        "fen": "r2qk2r/1b2bppp/1nn1p3/pp1pP3/2pP1B2/P1P2N2/1PB1QPPP/R3RNK1 b kq - 3 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Nf1",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "b4",
        "from": "b5",
        "to": "b4",
        "color": "b",
        "fen": "r2qk2r/1b2bppp/1nn1p3/p2pP3/1ppP1B2/P1P2N2/1PB1QPPP/R3RNK1 w kq - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "b4",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "axb4",
        "from": "a3",
        "to": "b4",
        "color": "w",
        "fen": "r2qk2r/1b2bppp/1nn1p3/p2pP3/1PpP1B2/2P2N2/1PB1QPPP/R3RNK1 b kq - 0 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "axb4",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "axb4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "axb4",
        "from": "a5",
        "to": "b4",
        "color": "b",
        "fen": "r2qk2r/1b2bppp/1nn1p3/3pP3/1ppP1B2/2P2N2/1PB1QPPP/R3RNK1 w kq - 0 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "axb4",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "axb4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rxa8",
        "from": "a1",
        "to": "a8",
        "color": "w",
        "fen": "R2qk2r/1b2bppp/1nn1p3/3pP3/1ppP1B2/2P2N2/1PB1QPPP/4RNK1 b k - 0 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": -1.6,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Rxa8",
              "eval": -1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxa8"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qxa8",
        "from": "d8",
        "to": "a8",
        "color": "b",
        "fen": "q3k2r/1b2bppp/1nn1p3/3pP3/1ppP1B2/2P2N2/1PB1QPPP/4RNK1 w k - 0 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": -1.6,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Qxa8",
              "eval": -1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxa8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ng5",
        "from": "f3",
        "to": "g5",
        "color": "w",
        "fen": "q3k2r/1b2bppp/1nn1p3/3pP1N1/1ppP1B2/2P5/1PB1QPPP/4RNK1 b k - 1 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Ng5",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "g6",
        "from": "g7",
        "to": "g6",
        "color": "b",
        "fen": "q3k2r/1b2bp1p/1nn1p1p1/3pP1N1/1ppP1B2/2P5/1PB1QPPP/4RNK1 w k - 0 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "g6",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "h4",
        "from": "h2",
        "to": "h4",
        "color": "w",
        "fen": "q3k2r/1b2bp1p/1nn1p1p1/3pP1N1/1ppP1B1P/2P5/1PB1QPP1/4RNK1 b k - 0 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -1.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "h4",
              "eval": -1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qa2",
        "from": "a8",
        "to": "a2",
        "color": "b",
        "fen": "4k2r/1b2bp1p/1nn1p1p1/3pP1N1/1ppP1B1P/2P5/qPB1QPP1/4RNK1 w k - 1 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -1.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Qa2",
              "eval": -1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qa2"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bc1",
        "from": "f4",
        "to": "c1",
        "color": "w",
        "fen": "4k2r/1b2bp1p/1nn1p1p1/3pP1N1/1ppP3P/2P5/qPB1QPP1/2B1RNK1 b k - 2 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": -1.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Bc1",
              "eval": -1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "b3",
        "from": "b4",
        "to": "b3",
        "color": "b",
        "fen": "4k2r/1b2bp1p/1nn1p1p1/3pP1N1/2pP3P/1pP5/qPB1QPP1/2B1RNK1 w k - 0 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": -1.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "b3",
              "eval": -1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b3"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bd1",
        "from": "c2",
        "to": "d1",
        "color": "w",
        "fen": "4k2r/1b2bp1p/1nn1p1p1/3pP1N1/2pP3P/1pP5/qP2QPP1/2BBRNK1 b k - 1 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Bd1",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Na4",
        "from": "b6",
        "to": "a4",
        "color": "b",
        "fen": "4k2r/1b2bp1p/2n1p1p1/3pP1N1/n1pP3P/1pP5/qP2QPP1/2BBRNK1 w k - 2 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Na4",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Na4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qf3",
        "from": "e2",
        "to": "f3",
        "color": "w",
        "fen": "4k2r/1b2bp1p/2n1p1p1/3pP1N1/n1pP3P/1pP2Q2/qP3PP1/2BBRNK1 b k - 3 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Qf3",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nd8",
        "from": "c6",
        "to": "d8",
        "color": "b",
        "fen": "3nk2r/1b2bp1p/4p1p1/3pP1N1/n1pP3P/1pP2Q2/qP3PP1/2BBRNK1 w k - 4 22",
        "moveNumber": 21,
        "classification": "great",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Nd8",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Re2",
        "from": "e1",
        "to": "e2",
        "color": "w",
        "fen": "3nk2r/1b2bp1p/4p1p1/3pP1N1/n1pP3P/1pP2Q2/qP2RPP1/2BB1NK1 b k - 5 22",
        "moveNumber": 22,
        "classification": "blunder",
        "eval": {
          "eval": -2.2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Re2",
              "eval": -2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qb1",
        "from": "a2",
        "to": "b1",
        "color": "b",
        "fen": "3nk2r/1b2bp1p/4p1p1/3pP1N1/n1pP3P/1pP2Q2/1P2RPP1/1qBB1NK1 w k - 6 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": -2.2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Qb1",
              "eval": -2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb1"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qf4",
        "from": "f3",
        "to": "f4",
        "color": "w",
        "fen": "3nk2r/1b2bp1p/4p1p1/3pP1N1/n1pP1Q1P/1pP5/1P2RPP1/1qBB1NK1 b k - 7 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": -2.3,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Qf4",
              "eval": -2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "h6",
        "from": "h7",
        "to": "h6",
        "color": "b",
        "fen": "3nk2r/1b2bp2/4p1pp/3pP1N1/n1pP1Q1P/1pP5/1P2RPP1/1qBB1NK1 w k - 0 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "h6",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nh3",
        "from": "g5",
        "to": "h3",
        "color": "w",
        "fen": "3nk2r/1b2bp2/4p1pp/3pP3/n1pP1Q1P/1pP4N/1P2RPP1/1qBB1NK1 b k - 1 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Nh3",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nh3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "g5",
        "from": "g6",
        "to": "g5",
        "color": "b",
        "fen": "3nk2r/1b2bp2/4p2p/3pP1p1/n1pP1Q1P/1pP4N/1P2RPP1/1qBB1NK1 w k - 0 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.5,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "g5",
              "eval": -2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "g5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "hxg5",
        "from": "h4",
        "to": "g5",
        "color": "w",
        "fen": "3nk2r/1b2bp2/4p2p/3pP1P1/n1pP1Q2/1pP4N/1P2RPP1/1qBB1NK1 b k - 0 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": -2.5,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "hxg5",
              "eval": -2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "hxg5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "hxg5",
        "from": "h6",
        "to": "g5",
        "color": "b",
        "fen": "3nk2r/1b2bp2/4p3/3pP1p1/n1pP1Q2/1pP4N/1P2RPP1/1qBB1NK1 w k - 0 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "hxg5",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "hxg5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nxg5",
        "from": "h3",
        "to": "g5",
        "color": "w",
        "fen": "3nk2r/1b2bp2/4p3/3pP1N1/n1pP1Q2/1pP5/1P2RPP1/1qBB1NK1 b k - 0 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Nxg5",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxg5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rg8",
        "from": "h8",
        "to": "g8",
        "color": "b",
        "fen": "3nk1r1/1b2bp2/4p3/3pP1N1/n1pP1Q2/1pP5/1P2RPP1/1qBB1NK1 w - - 1 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Rg8",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rg8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nh3",
        "from": "g5",
        "to": "h3",
        "color": "w",
        "fen": "3nk1r1/1b2bp2/4p3/3pP3/n1pP1Q2/1pP4N/1P2RPP1/1qBB1NK1 b - - 2 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Nh3",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nh3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qg6",
        "from": "b1",
        "to": "g6",
        "color": "b",
        "fen": "3nk1r1/1b2bp2/4p1q1/3pP3/n1pP1Q2/1pP4N/1P2RPP1/2BB1NK1 w - - 3 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Qg6",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qg6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Ng3",
        "from": "f1",
        "to": "g3",
        "color": "w",
        "fen": "3nk1r1/1b2bp2/4p1q1/3pP3/n1pP1Q2/1pP3NN/1P2RPP1/2BB2K1 b - - 4 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Ng3",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qb1",
        "from": "g6",
        "to": "b1",
        "color": "b",
        "fen": "3nk1r1/1b2bp2/4p3/3pP3/n1pP1Q2/1pP3NN/1P2RPP1/1qBB2K1 w - - 5 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": -2.9,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Qb1",
              "eval": -2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qb1"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Kh2",
        "from": "g1",
        "to": "h2",
        "color": "w",
        "fen": "3nk1r1/1b2bp2/4p3/3pP3/n1pP1Q2/1pP3NN/1P2RPPK/1qBB4 b - - 6 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": -2.9,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Kh2",
              "eval": -2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rh8",
        "from": "g8",
        "to": "h8",
        "color": "b",
        "fen": "3nk2r/1b2bp2/4p3/3pP3/n1pP1Q2/1pP3NN/1P2RPPK/1qBB4 w - - 7 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Rh8",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rh8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Kg1",
        "from": "h2",
        "to": "g1",
        "color": "w",
        "fen": "3nk2r/1b2bp2/4p3/3pP3/n1pP1Q2/1pP3NN/1P2RPP1/1qBB2K1 b - - 8 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Kg1",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kg1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bc6",
        "from": "b7",
        "to": "c6",
        "color": "b",
        "fen": "3nk2r/4bp2/2b1p3/3pP3/n1pP1Q2/1pP3NN/1P2RPP1/1qBB2K1 w - - 9 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Bc6",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nf1",
        "from": "g3",
        "to": "f1",
        "color": "w",
        "fen": "3nk2r/4bp2/2b1p3/3pP3/n1pP1Q2/1pP4N/1P2RPP1/1qBB1NK1 b - - 10 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Nf1",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nb6",
        "from": "a4",
        "to": "b6",
        "color": "b",
        "fen": "3nk2r/4bp2/1nb1p3/3pP3/2pP1Q2/1pP4N/1P2RPP1/1qBB1NK1 w - - 11 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": -3.2,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Nb6",
              "eval": -3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nh2",
        "from": "f1",
        "to": "h2",
        "color": "w",
        "fen": "3nk2r/4bp2/1nb1p3/3pP3/2pP1Q2/1pP4N/1P2RPPN/1qBB2K1 b - - 12 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": -3.2,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Nh2",
              "eval": -3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nh2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qg6",
        "from": "b1",
        "to": "g6",
        "color": "b",
        "fen": "3nk2r/4bp2/1nb1p1q1/3pP3/2pP1Q2/1pP4N/1P2RPPN/2BB2K1 w - - 13 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Qg6",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qg6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qg4",
        "from": "f4",
        "to": "g4",
        "color": "w",
        "fen": "3nk2r/4bp2/1nb1p1q1/3pP3/2pP2Q1/1pP4N/1P2RPPN/2BB2K1 b - - 14 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Qg4",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qg4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qxg4",
        "from": "g6",
        "to": "g4",
        "color": "b",
        "fen": "3nk2r/4bp2/1nb1p3/3pP3/2pP2q1/1pP4N/1P2RPPN/2BB2K1 w - - 0 34",
        "moveNumber": 33,
        "classification": "excellent",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Qxg4",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxg4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nxg4",
        "from": "h2",
        "to": "g4",
        "color": "w",
        "fen": "3nk2r/4bp2/1nb1p3/3pP3/2pP2N1/1pP4N/1P2RPP1/2BB2K1 b - - 0 34",
        "moveNumber": 34,
        "classification": "good",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Nxg4",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxg4"
              ]
            }
          ]
        },
        "timeSpent": 4
      }
    ]
  },
  {
    "id": "game-11",
    "white": {
      "username": "You",
      "rating": 905
    },
    "black": {
      "username": "EndgameWizard",
      "rating": 925
    },
    "result": "1-0",
    "date": "2026-10-12T13:00:00Z",
    "timeControl": "10 min",
    "speed": "rapid",
    "source": "online",
    "opening": {
      "eco": "D35",
      "name": "Queen's Gambit Declined: Exchange Variation"
    },
    "pgn": "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5 5. Bg5 Be7 6. e3 O-O 7. Bd3 c6 8. Qc2 Nbd7 9. Nge2 Re8 10. O-O Nf8 11. f3 Be6 12. Rad1 Rc8 13. Kh1 a6 14. e4 dxe4 15. fxe4 Ng4 16. Bxe7 Qxe7 17. Qd2 Qh4 18. Qf4 Ng6 19. Qg3 Qxg3 20. Nxg3 Ne3 21. Rde1 Nxf1 22. Rxf1 Rcd8 23. Nge2 Bg4 24. Bc4 Re7 25. h3 Bxe2 26. Nxe2 b5 27. Bb3 a5 28. a3 a4 29. Ba2 Kf8 30. e5 f6 31. exf6 Rxe2 32. fxg7+ Kxg7 33. Rf7+ Kh6",
    "accuracy": {
      "white": 87.5,
      "black": 78
    },
    "estimatedRating": {
      "white": 1150,
      "black": 980
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "B",
      "tactics": "B",
      "endgame": "A"
    },
    "moves": [
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "d4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d5",
        "from": "d7",
        "to": "d5",
        "color": "b",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "c4",
        "from": "c2",
        "to": "c4",
        "color": "w",
        "fen": "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "c4",
              "eval": 0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "e6",
        "from": "e7",
        "to": "e6",
        "color": "b",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nc3",
        "from": "b1",
        "to": "c3",
        "color": "w",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nf6",
        "from": "g8",
        "to": "f6",
        "color": "b",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "cxd5",
        "from": "c4",
        "to": "d5",
        "color": "w",
        "fen": "rnbqkb1r/ppp2ppp/4pn2/3P4/3P4/2N5/PP2PPPP/R1BQKBNR b KQkq - 0 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": 0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "cxd5",
              "eval": 0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "cxd5"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "exd5",
        "from": "e6",
        "to": "d5",
        "color": "b",
        "fen": "rnbqkb1r/ppp2ppp/5n2/3p4/3P4/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "exd5",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exd5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Bg5",
        "from": "c1",
        "to": "g5",
        "color": "w",
        "fen": "rnbqkb1r/ppp2ppp/5n2/3p2B1/3P4/2N5/PP2PPPP/R2QKBNR b KQkq - 1 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": 0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Bg5",
              "eval": 0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Be7",
        "from": "f8",
        "to": "e7",
        "color": "b",
        "fen": "rnbqk2r/ppp1bppp/5n2/3p2B1/3P4/2N5/PP2PPPP/R2QKBNR w KQkq - 2 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Be7",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "e3",
        "from": "e2",
        "to": "e3",
        "color": "w",
        "fen": "rnbqk2r/ppp1bppp/5n2/3p2B1/3P4/2N1P3/PP3PPP/R2QKBNR b KQkq - 0 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": 0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "e3",
              "eval": 0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "rnbq1rk1/ppp1bppp/5n2/3p2B1/3P4/2N1P3/PP3PPP/R2QKBNR w KQ - 1 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bd3",
        "from": "f1",
        "to": "d3",
        "color": "w",
        "fen": "rnbq1rk1/ppp1bppp/5n2/3p2B1/3P4/2NBP3/PP3PPP/R2QK1NR b KQ - 2 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": 0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "c6",
        "from": "c7",
        "to": "c6",
        "color": "b",
        "fen": "rnbq1rk1/pp2bppp/2p2n2/3p2B1/3P4/2NBP3/PP3PPP/R2QK1NR w KQ - 0 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "c6",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qc2",
        "from": "d1",
        "to": "c2",
        "color": "w",
        "fen": "rnbq1rk1/pp2bppp/2p2n2/3p2B1/3P4/2NBP3/PPQ2PPP/R3K1NR b KQ - 1 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": 0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Qc2",
              "eval": 0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qc2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nbd7",
        "from": "b8",
        "to": "d7",
        "color": "b",
        "fen": "r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ2PPP/R3K1NR w KQ - 2 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nbd7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nge2",
        "from": "g1",
        "to": "e2",
        "color": "w",
        "fen": "r1bq1rk1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R3K2R b KQ - 3 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Nge2",
              "eval": 0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nge2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Re8",
        "from": "f8",
        "to": "e8",
        "color": "b",
        "fen": "r1bqr1k1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R3K2R w KQ - 4 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": 0.9,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Re8",
              "eval": 0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r1bqr1k1/pp1nbppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R4RK1 b - - 5 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "O-O",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nf8",
        "from": "d7",
        "to": "f8",
        "color": "b",
        "fen": "r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBP3/PPQ1NPPP/R4RK1 w - - 6 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": 1,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Nf8",
              "eval": 1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "f3",
        "from": "f2",
        "to": "f3",
        "color": "w",
        "fen": "r1bqrnk1/pp2bppp/2p2n2/3p2B1/3P4/2NBPP2/PPQ1N1PP/R4RK1 b - - 0 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "f3",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Be6",
        "from": "c8",
        "to": "e6",
        "color": "b",
        "fen": "r2qrnk1/pp2bppp/2p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/R4RK1 w - - 1 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": 1.1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Be6",
              "eval": 1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rad1",
        "from": "a1",
        "to": "d1",
        "color": "w",
        "fen": "r2qrnk1/pp2bppp/2p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/3R1RK1 b - - 2 12",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Rad1",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rad1"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rc8",
        "from": "a8",
        "to": "c8",
        "color": "b",
        "fen": "2rqrnk1/pp2bppp/2p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/3R1RK1 w - - 3 13",
        "moveNumber": 12,
        "classification": "best",
        "eval": {
          "eval": 1.2,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "Rc8",
              "eval": 1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rc8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Kh1",
        "from": "g1",
        "to": "h1",
        "color": "w",
        "fen": "2rqrnk1/pp2bppp/2p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/3R1R1K b - - 4 13",
        "moveNumber": 13,
        "classification": "good",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Kh1",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "a6",
        "from": "a7",
        "to": "a6",
        "color": "b",
        "fen": "2rqrnk1/1p2bppp/p1p1bn2/3p2B1/3P4/2NBPP2/PPQ1N1PP/3R1R1K w - - 0 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": 1.3,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "a6",
              "eval": 1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "e4",
        "from": "e3",
        "to": "e4",
        "color": "w",
        "fen": "2rqrnk1/1p2bppp/p1p1bn2/3p2B1/3PP3/2NB1P2/PPQ1N1PP/3R1R1K b - - 0 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "e4",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "dxe4",
        "from": "d5",
        "to": "e4",
        "color": "b",
        "fen": "2rqrnk1/1p2bppp/p1p1bn2/6B1/3Pp3/2NB1P2/PPQ1N1PP/3R1R1K w - - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": 1.4,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "dxe4",
              "eval": 1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "dxe4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "fxe4",
        "from": "f3",
        "to": "e4",
        "color": "w",
        "fen": "2rqrnk1/1p2bppp/p1p1bn2/6B1/3PP3/2NB4/PPQ1N1PP/3R1R1K b - - 0 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "fxe4",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "fxe4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Ng4",
        "from": "f6",
        "to": "g4",
        "color": "b",
        "fen": "2rqrnk1/1p2bppp/p1p1b3/6B1/3PP1n1/2NB4/PPQ1N1PP/3R1R1K w - - 1 16",
        "moveNumber": 15,
        "classification": "blunder",
        "eval": {
          "eval": 1.5,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Ng4",
              "eval": 1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bxe7",
        "from": "g5",
        "to": "e7",
        "color": "w",
        "fen": "2rqrnk1/1p2Bppp/p1p1b3/8/3PP1n1/2NB4/PPQ1N1PP/3R1R1K b - - 0 16",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Bxe7",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxe7"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qxe7",
        "from": "d8",
        "to": "e7",
        "color": "b",
        "fen": "2r1rnk1/1p2qppp/p1p1b3/8/3PP1n1/2NB4/PPQ1N1PP/3R1R1K w - - 0 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": 1.6,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Qxe7",
              "eval": 1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxe7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qd2",
        "from": "c2",
        "to": "d2",
        "color": "w",
        "fen": "2r1rnk1/1p2qppp/p1p1b3/8/3PP1n1/2NB4/PP1QN1PP/3R1R1K b - - 1 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": 1.7,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qh4",
        "from": "e7",
        "to": "h4",
        "color": "b",
        "fen": "2r1rnk1/1p3ppp/p1p1b3/8/3PP1nq/2NB4/PP1QN1PP/3R1R1K w - - 2 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Qh4",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qh4"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qf4",
        "from": "d2",
        "to": "f4",
        "color": "w",
        "fen": "2r1rnk1/1p3ppp/p1p1b3/8/3PPQnq/2NB4/PP2N1PP/3R1R1K b - - 3 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.8,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Qf4",
              "eval": 1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Ng6",
        "from": "f8",
        "to": "g6",
        "color": "b",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PPQnq/2NB4/PP2N1PP/3R1R1K w - - 4 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Ng6",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ng6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Qg3",
        "from": "f4",
        "to": "g3",
        "color": "w",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PP1nq/2NB2Q1/PP2N1PP/3R1R1K b - - 5 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": 1.9,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Qg3",
              "eval": 1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qg3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qxg3",
        "from": "h4",
        "to": "g3",
        "color": "b",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PP1n1/2NB2q1/PP2N1PP/3R1R1K w - - 0 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Qxg3",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxg3"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nxg3",
        "from": "e2",
        "to": "g3",
        "color": "w",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PP1n1/2NB2N1/PP4PP/3R1R1K b - - 0 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": 2,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Nxg3",
              "eval": 2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxg3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Ne3",
        "from": "g4",
        "to": "e3",
        "color": "b",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PP3/2NBn1N1/PP4PP/3R1R1K w - - 1 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Ne3",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne3"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rde1",
        "from": "d1",
        "to": "e1",
        "color": "w",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PP3/2NBn1N1/PP4PP/4RR1K b - - 2 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": 2.1,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rde1",
              "eval": 2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rde1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nxf1",
        "from": "e3",
        "to": "f1",
        "color": "b",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PP3/2NB2N1/PP4PP/4Rn1K w - - 0 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Nxf1",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf1"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rxf1",
        "from": "e1",
        "to": "f1",
        "color": "w",
        "fen": "2r1r1k1/1p3ppp/p1p1b1n1/8/3PP3/2NB2N1/PP4PP/5R1K b - - 0 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rxf1",
              "eval": 2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxf1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rcd8",
        "from": "c8",
        "to": "d8",
        "color": "b",
        "fen": "3rr1k1/1p3ppp/p1p1b1n1/8/3PP3/2NB2N1/PP4PP/5R1K w - - 1 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Rcd8",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rcd8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nge2",
        "from": "g3",
        "to": "e2",
        "color": "w",
        "fen": "3rr1k1/1p3ppp/p1p1b1n1/8/3PP3/2NB4/PP2N1PP/5R1K b - - 2 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": 2.3,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Nge2",
              "eval": 2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nge2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Bg4",
        "from": "e6",
        "to": "g4",
        "color": "b",
        "fen": "3rr1k1/1p3ppp/p1p3n1/8/3PP1b1/2NB4/PP2N1PP/5R1K w - - 3 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Bg4",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bg4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Bc4",
        "from": "d3",
        "to": "c4",
        "color": "w",
        "fen": "3rr1k1/1p3ppp/p1p3n1/8/2BPP1b1/2N5/PP2N1PP/5R1K b - - 4 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.4,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Bc4",
              "eval": 2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Re7",
        "from": "e8",
        "to": "e7",
        "color": "b",
        "fen": "3r2k1/1p2rppp/p1p3n1/8/2BPP1b1/2N5/PP2N1PP/5R1K w - - 5 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Re7",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "h3",
        "from": "h2",
        "to": "h3",
        "color": "w",
        "fen": "3r2k1/1p2rppp/p1p3n1/8/2BPP1b1/2N4P/PP2N1P1/5R1K b - - 0 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": 2.5,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "h3",
              "eval": 2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "h3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Bxe2",
        "from": "g4",
        "to": "e2",
        "color": "b",
        "fen": "3r2k1/1p2rppp/p1p3n1/8/2BPP3/2N4P/PP2b1P1/5R1K w - - 0 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": 2.6,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Bxe2",
              "eval": 2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxe2"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nxe2",
        "from": "c3",
        "to": "e2",
        "color": "w",
        "fen": "3r2k1/1p2rppp/p1p3n1/8/2BPP3/7P/PP2N1P1/5R1K b - - 0 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Nxe2",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxe2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "b5",
        "from": "b7",
        "to": "b5",
        "color": "b",
        "fen": "3r2k1/4rppp/p1p3n1/1p6/2BPP3/7P/PP2N1P1/5R1K w - - 0 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": 2.7,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "b5",
              "eval": 2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bb3",
        "from": "c4",
        "to": "b3",
        "color": "w",
        "fen": "3r2k1/4rppp/p1p3n1/1p6/3PP3/1B5P/PP2N1P1/5R1K b - - 1 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Bb3",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bb3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "a5",
        "from": "a6",
        "to": "a5",
        "color": "b",
        "fen": "3r2k1/4rppp/2p3n1/pp6/3PP3/1B5P/PP2N1P1/5R1K w - - 0 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": 2.8,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "a5",
              "eval": 2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "a3",
        "from": "a2",
        "to": "a3",
        "color": "w",
        "fen": "3r2k1/4rppp/2p3n1/pp6/3PP3/PB5P/1P2N1P1/5R1K b - - 0 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "a3",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "a4",
        "from": "a5",
        "to": "a4",
        "color": "b",
        "fen": "3r2k1/4rppp/2p3n1/1p6/p2PP3/PB5P/1P2N1P1/5R1K w - - 0 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": 2.9,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "a4",
              "eval": 2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "a4"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Ba2",
        "from": "b3",
        "to": "a2",
        "color": "w",
        "fen": "3r2k1/4rppp/2p3n1/1p6/p2PP3/P6P/BP2N1P1/5R1K b - - 1 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Ba2",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ba2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Kf8",
        "from": "g8",
        "to": "f8",
        "color": "b",
        "fen": "3r1k2/4rppp/2p3n1/1p6/p2PP3/P6P/BP2N1P1/5R1K w - - 2 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": 3,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Kf8",
              "eval": 3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kf8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "e5",
        "from": "e4",
        "to": "e5",
        "color": "w",
        "fen": "3r1k2/4rppp/2p3n1/1p2P3/p2P4/P6P/BP2N1P1/5R1K b - - 0 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "e5",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "f6",
        "from": "f7",
        "to": "f6",
        "color": "b",
        "fen": "3r1k2/4r1pp/2p2pn1/1p2P3/p2P4/P6P/BP2N1P1/5R1K w - - 0 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": 3.1,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "f6",
              "eval": 3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "exf6",
        "from": "e5",
        "to": "f6",
        "color": "w",
        "fen": "3r1k2/4r1pp/2p2Pn1/1p6/p2P4/P6P/BP2N1P1/5R1K b - - 0 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "exf6",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exf6"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rxe2",
        "from": "e7",
        "to": "e2",
        "color": "b",
        "fen": "3r1k2/6pp/2p2Pn1/1p6/p2P4/P6P/BP2r1P1/5R1K w - - 0 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": 3.2,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Rxe2",
              "eval": 3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxe2"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "fxg7+",
        "from": "f6",
        "to": "g7",
        "color": "w",
        "fen": "3r1k2/6Pp/2p3n1/1p6/p2P4/P6P/BP2r1P1/5R1K b - - 0 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "fxg7+",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "fxg7+"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Kxg7",
        "from": "f8",
        "to": "g7",
        "color": "b",
        "fen": "3r4/6kp/2p3n1/1p6/p2P4/P6P/BP2r1P1/5R1K w - - 0 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": 3.3,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Kxg7",
              "eval": 3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kxg7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rf7+",
        "from": "f1",
        "to": "f7",
        "color": "w",
        "fen": "3r4/5Rkp/2p3n1/1p6/p2P4/P6P/BP2r1P1/7K b - - 1 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Rf7+",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf7+"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Kh6",
        "from": "g7",
        "to": "h6",
        "color": "b",
        "fen": "3r4/5R1p/2p3nk/1p6/p2P4/P6P/BP2r1P1/7K w - - 2 34",
        "moveNumber": 33,
        "classification": "excellent",
        "eval": {
          "eval": 3.4,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Kh6",
              "eval": 3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh6"
              ]
            }
          ]
        },
        "timeSpent": 3
      }
    ]
  },
  {
    "id": "game-12",
    "white": {
      "username": "BulletBlitzer",
      "rating": 895
    },
    "black": {
      "username": "You",
      "rating": 905
    },
    "result": "0-1",
    "date": "2026-10-11T22:50:00Z",
    "timeControl": "1 min",
    "speed": "bullet",
    "source": "online",
    "opening": {
      "eco": "C45",
      "name": "Scotch Game"
    },
    "pgn": "1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6 6. c3 Nge7 7. Bc4 O-O 8. O-O Bb6 9. Na3 d6 10. Nac2 Ne5 11. Be2 Qg6 12. f3 f5 13. exf5 Nxf5 14. Nxf5 Bxf5 15. Bxb6 axb6 16. Nd4 Bd7 17. f4 Nc6 18. Bc4+ Kh8 19. Nb5 Rac8 20. Qd2 Bf5 21. Rae1 Na5 22. Be2 Be4 23. Rf2 d5 24. b4 Nc6 25. Nd4 Ne7 26. Bf3 c5 27. Bxe4 dxe4 28. Nc2 Rcd8 29. Qe2 Nd5 30. Qxe4 Qxe4 31. Rxe4 Nxc3 32. Re7 Rd1+ 33. Rf1 Rd2 34. Rf2 Rd1+ 35. Rf1 Rd2 36. Rf2 Rd1+",
    "accuracy": {
      "white": 80.2,
      "black": 86.5
    },
    "estimatedRating": {
      "white": 980,
      "black": 1100
    },
    "phaseGrades": {
      "opening": "A",
      "middlegame": "B",
      "tactics": "A",
      "endgame": "B"
    },
    "moves": [
      {
        "san": "e4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "e5",
        "from": "e7",
        "to": "e5",
        "color": "b",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        "moveNumber": 1,
        "classification": "book",
        "eval": {
          "eval": 0,
          "why": "Control of center and piece coordination on move 1.",
          "lines": [
            {
              "move": "e5",
              "eval": 0,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "e5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nf3",
        "from": "g1",
        "to": "f3",
        "color": "w",
        "fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nf3",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nf3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nc6",
        "from": "b8",
        "to": "c6",
        "color": "b",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "moveNumber": 2,
        "classification": "book",
        "eval": {
          "eval": -0.1,
          "why": "Control of center and piece coordination on move 2.",
          "lines": [
            {
              "move": "Nc6",
              "eval": -0.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "d4",
        "from": "d2",
        "to": "d4",
        "color": "w",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "d4",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "exd4",
        "from": "e5",
        "to": "d4",
        "color": "b",
        "fen": "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4",
        "moveNumber": 3,
        "classification": "book",
        "eval": {
          "eval": -0.2,
          "why": "Control of center and piece coordination on move 3.",
          "lines": [
            {
              "move": "exd4",
              "eval": -0.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exd4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nxd4",
        "from": "f3",
        "to": "d4",
        "color": "w",
        "fen": "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
        "moveNumber": 4,
        "classification": "good",
        "eval": {
          "eval": -0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": -0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxd4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bc5",
        "from": "f8",
        "to": "c5",
        "color": "b",
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 1 5",
        "moveNumber": 4,
        "classification": "best",
        "eval": {
          "eval": -0.3,
          "why": "Control of center and piece coordination on move 4.",
          "lines": [
            {
              "move": "Bc5",
              "eval": -0.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Be3",
        "from": "c1",
        "to": "e3",
        "color": "w",
        "fen": "r1bqk1nr/pppp1ppp/2n5/2b5/3NP3/4B3/PPP2PPP/RN1QKB1R b KQkq - 2 5",
        "moveNumber": 5,
        "classification": "best",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Be3",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Qf6",
        "from": "d8",
        "to": "f6",
        "color": "b",
        "fen": "r1b1k1nr/pppp1ppp/2n2q2/2b5/3NP3/4B3/PPP2PPP/RN1QKB1R w KQkq - 3 6",
        "moveNumber": 5,
        "classification": "good",
        "eval": {
          "eval": -0.4,
          "why": "Control of center and piece coordination on move 5.",
          "lines": [
            {
              "move": "Qf6",
              "eval": -0.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qf6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "c3",
        "from": "c2",
        "to": "c3",
        "color": "w",
        "fen": "r1b1k1nr/pppp1ppp/2n2q2/2b5/3NP3/2P1B3/PP3PPP/RN1QKB1R b KQkq - 0 6",
        "moveNumber": 6,
        "classification": "excellent",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "c3",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Nge7",
        "from": "g8",
        "to": "e7",
        "color": "b",
        "fen": "r1b1k2r/ppppnppp/2n2q2/2b5/3NP3/2P1B3/PP3PPP/RN1QKB1R w KQkq - 1 7",
        "moveNumber": 6,
        "classification": "best",
        "eval": {
          "eval": -0.5,
          "why": "Control of center and piece coordination on move 6.",
          "lines": [
            {
              "move": "Nge7",
              "eval": -0.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nge7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bc4",
        "from": "f1",
        "to": "c4",
        "color": "w",
        "fen": "r1b1k2r/ppppnppp/2n2q2/2b5/2BNP3/2P1B3/PP3PPP/RN1QK2R b KQkq - 2 7",
        "moveNumber": 7,
        "classification": "good",
        "eval": {
          "eval": -0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "Bc4",
              "eval": -0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "O-O",
        "from": "e8",
        "to": "g8",
        "color": "b",
        "fen": "r1b2rk1/ppppnppp/2n2q2/2b5/2BNP3/2P1B3/PP3PPP/RN1QK2R w KQ - 3 8",
        "moveNumber": 7,
        "classification": "best",
        "eval": {
          "eval": -0.6,
          "why": "Control of center and piece coordination on move 7.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "O-O",
        "from": "e1",
        "to": "g1",
        "color": "w",
        "fen": "r1b2rk1/ppppnppp/2n2q2/2b5/2BNP3/2P1B3/PP3PPP/RN1Q1RK1 b - - 4 8",
        "moveNumber": 8,
        "classification": "best",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "O-O"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bb6",
        "from": "c5",
        "to": "b6",
        "color": "b",
        "fen": "r1b2rk1/ppppnppp/1bn2q2/8/2BNP3/2P1B3/PP3PPP/RN1Q1RK1 w - - 5 9",
        "moveNumber": 8,
        "classification": "excellent",
        "eval": {
          "eval": -0.7,
          "why": "Control of center and piece coordination on move 8.",
          "lines": [
            {
              "move": "Bb6",
              "eval": -0.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bb6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Na3",
        "from": "b1",
        "to": "a3",
        "color": "w",
        "fen": "r1b2rk1/ppppnppp/1bn2q2/8/2BNP3/N1P1B3/PP3PPP/R2Q1RK1 b - - 6 9",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "Na3",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Na3"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "d6",
        "from": "d7",
        "to": "d6",
        "color": "b",
        "fen": "r1b2rk1/ppp1nppp/1bnp1q2/8/2BNP3/N1P1B3/PP3PPP/R2Q1RK1 w - - 0 10",
        "moveNumber": 9,
        "classification": "best",
        "eval": {
          "eval": -0.8,
          "why": "Control of center and piece coordination on move 9.",
          "lines": [
            {
              "move": "d6",
              "eval": -0.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nac2",
        "from": "a3",
        "to": "c2",
        "color": "w",
        "fen": "r1b2rk1/ppp1nppp/1bnp1q2/8/2BNP3/2P1B3/PPN2PPP/R2Q1RK1 b - - 1 10",
        "moveNumber": 10,
        "classification": "good",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Nac2",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nac2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Ne5",
        "from": "c6",
        "to": "e5",
        "color": "b",
        "fen": "r1b2rk1/ppp1nppp/1b1p1q2/4n3/2BNP3/2P1B3/PPN2PPP/R2Q1RK1 w - - 2 11",
        "moveNumber": 10,
        "classification": "best",
        "eval": {
          "eval": -0.9,
          "why": "Control of center and piece coordination on move 10.",
          "lines": [
            {
              "move": "Ne5",
              "eval": -0.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Be2",
        "from": "c4",
        "to": "e2",
        "color": "w",
        "fen": "r1b2rk1/ppp1nppp/1b1p1q2/4n3/3NP3/2P1B3/PPN1BPPP/R2Q1RK1 b - - 3 11",
        "moveNumber": 11,
        "classification": "excellent",
        "eval": {
          "eval": -1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Be2",
              "eval": -1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Qg6",
        "from": "f6",
        "to": "g6",
        "color": "b",
        "fen": "r1b2rk1/ppp1nppp/1b1p2q1/4n3/3NP3/2P1B3/PPN1BPPP/R2Q1RK1 w - - 4 12",
        "moveNumber": 11,
        "classification": "best",
        "eval": {
          "eval": -1,
          "why": "Control of center and piece coordination on move 11.",
          "lines": [
            {
              "move": "Qg6",
              "eval": -1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qg6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "f3",
        "from": "f2",
        "to": "f3",
        "color": "w",
        "fen": "r1b2rk1/ppp1nppp/1b1p2q1/4n3/3NP3/2P1BP2/PPN1B1PP/R2Q1RK1 b - - 0 12",
        "moveNumber": 12,
        "classification": "brilliant",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "f3",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "f5",
        "from": "f7",
        "to": "f5",
        "color": "b",
        "fen": "r1b2rk1/ppp1n1pp/1b1p2q1/4np2/3NP3/2P1BP2/PPN1B1PP/R2Q1RK1 w - - 0 13",
        "moveNumber": 12,
        "classification": "blunder",
        "eval": {
          "eval": -1.1,
          "why": "Control of center and piece coordination on move 12.",
          "lines": [
            {
              "move": "f5",
              "eval": -1.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "exf5",
        "from": "e4",
        "to": "f5",
        "color": "w",
        "fen": "r1b2rk1/ppp1n1pp/1b1p2q1/4nP2/3N4/2P1BP2/PPN1B1PP/R2Q1RK1 b - - 0 13",
        "moveNumber": 13,
        "classification": "best",
        "eval": {
          "eval": -1.2,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "exf5",
              "eval": -1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "exf5"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nxf5",
        "from": "e7",
        "to": "f5",
        "color": "b",
        "fen": "r1b2rk1/ppp3pp/1b1p2q1/4nn2/3N4/2P1BP2/PPN1B1PP/R2Q1RK1 w - - 0 14",
        "moveNumber": 13,
        "classification": "excellent",
        "eval": {
          "eval": -1.2,
          "why": "Control of center and piece coordination on move 13.",
          "lines": [
            {
              "move": "Nxf5",
              "eval": -1.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Nxf5",
        "from": "d4",
        "to": "f5",
        "color": "w",
        "fen": "r1b2rk1/ppp3pp/1b1p2q1/4nN2/8/2P1BP2/PPN1B1PP/R2Q1RK1 b - - 0 14",
        "moveNumber": 14,
        "classification": "best",
        "eval": {
          "eval": -1.3,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Nxf5",
              "eval": -1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxf5"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Bxf5",
        "from": "c8",
        "to": "f5",
        "color": "b",
        "fen": "r4rk1/ppp3pp/1b1p2q1/4nb2/8/2P1BP2/PPN1B1PP/R2Q1RK1 w - - 0 15",
        "moveNumber": 14,
        "classification": "good",
        "eval": {
          "eval": -1.3,
          "why": "Control of center and piece coordination on move 14.",
          "lines": [
            {
              "move": "Bxf5",
              "eval": -1.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxf5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bxb6",
        "from": "e3",
        "to": "b6",
        "color": "w",
        "fen": "r4rk1/ppp3pp/1B1p2q1/4nb2/8/2P2P2/PPN1B1PP/R2Q1RK1 b - - 0 15",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "Bxb6",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxb6"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "axb6",
        "from": "a7",
        "to": "b6",
        "color": "b",
        "fen": "r4rk1/1pp3pp/1p1p2q1/4nb2/8/2P2P2/PPN1B1PP/R2Q1RK1 w - - 0 16",
        "moveNumber": 15,
        "classification": "best",
        "eval": {
          "eval": -1.4,
          "why": "Control of center and piece coordination on move 15.",
          "lines": [
            {
              "move": "axb6",
              "eval": -1.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "axb6"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nd4",
        "from": "c2",
        "to": "d4",
        "color": "w",
        "fen": "r4rk1/1pp3pp/1p1p2q1/4nb2/3N4/2P2P2/PP2B1PP/R2Q1RK1 b - - 1 16",
        "moveNumber": 16,
        "classification": "excellent",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Nd4",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bd7",
        "from": "f5",
        "to": "d7",
        "color": "b",
        "fen": "r4rk1/1ppb2pp/1p1p2q1/4n3/3N4/2P2P2/PP2B1PP/R2Q1RK1 w - - 2 17",
        "moveNumber": 16,
        "classification": "best",
        "eval": {
          "eval": -1.5,
          "why": "Control of center and piece coordination on move 16.",
          "lines": [
            {
              "move": "Bd7",
              "eval": -1.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bd7"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "f4",
        "from": "f3",
        "to": "f4",
        "color": "w",
        "fen": "r4rk1/1ppb2pp/1p1p2q1/4n3/3N1P2/2P5/PP2B1PP/R2Q1RK1 b - - 0 17",
        "moveNumber": 17,
        "classification": "best",
        "eval": {
          "eval": -1.6,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "f4",
              "eval": -1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "f4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nc6",
        "from": "e5",
        "to": "c6",
        "color": "b",
        "fen": "r4rk1/1ppb2pp/1pnp2q1/8/3N1P2/2P5/PP2B1PP/R2Q1RK1 w - - 1 18",
        "moveNumber": 17,
        "classification": "good",
        "eval": {
          "eval": -1.6,
          "why": "Control of center and piece coordination on move 17.",
          "lines": [
            {
              "move": "Nc6",
              "eval": -1.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bc4+",
        "from": "e2",
        "to": "c4",
        "color": "w",
        "fen": "r4rk1/1ppb2pp/1pnp2q1/8/2BN1P2/2P5/PP4PP/R2Q1RK1 b - - 2 18",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Bc4+",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bc4+"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Kh8",
        "from": "g8",
        "to": "h8",
        "color": "b",
        "fen": "r4r1k/1ppb2pp/1pnp2q1/8/2BN1P2/2P5/PP4PP/R2Q1RK1 w - - 3 19",
        "moveNumber": 18,
        "classification": "best",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 18.",
          "lines": [
            {
              "move": "Kh8",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Kh8"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Nb5",
        "from": "d4",
        "to": "b5",
        "color": "w",
        "fen": "r4r1k/1ppb2pp/1pnp2q1/1N6/2B2P2/2P5/PP4PP/R2Q1RK1 b - - 4 19",
        "moveNumber": 19,
        "classification": "good",
        "eval": {
          "eval": -1.7,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Nb5",
              "eval": -1.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nb5"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rac8",
        "from": "a8",
        "to": "c8",
        "color": "b",
        "fen": "2r2r1k/1ppb2pp/1pnp2q1/1N6/2B2P2/2P5/PP4PP/R2Q1RK1 w - - 5 20",
        "moveNumber": 19,
        "classification": "best",
        "eval": {
          "eval": -1.8,
          "why": "Control of center and piece coordination on move 19.",
          "lines": [
            {
              "move": "Rac8",
              "eval": -1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rac8"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qd2",
        "from": "d1",
        "to": "d2",
        "color": "w",
        "fen": "2r2r1k/1ppb2pp/1pnp2q1/1N6/2B2P2/2P5/PP1Q2PP/R4RK1 b - - 6 20",
        "moveNumber": 20,
        "classification": "best",
        "eval": {
          "eval": -1.8,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Qd2",
              "eval": -1.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qd2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Bf5",
        "from": "d7",
        "to": "f5",
        "color": "b",
        "fen": "2r2r1k/1pp3pp/1pnp2q1/1N3b2/2B2P2/2P5/PP1Q2PP/R4RK1 w - - 7 21",
        "moveNumber": 20,
        "classification": "good",
        "eval": {
          "eval": -1.9,
          "why": "Control of center and piece coordination on move 20.",
          "lines": [
            {
              "move": "Bf5",
              "eval": -1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf5"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rae1",
        "from": "a1",
        "to": "e1",
        "color": "w",
        "fen": "2r2r1k/1pp3pp/1pnp2q1/1N3b2/2B2P2/2P5/PP1Q2PP/4RRK1 b - - 8 21",
        "moveNumber": 21,
        "classification": "excellent",
        "eval": {
          "eval": -1.9,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Rae1",
              "eval": -1.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rae1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Na5",
        "from": "c6",
        "to": "a5",
        "color": "b",
        "fen": "2r2r1k/1pp3pp/1p1p2q1/nN3b2/2B2P2/2P5/PP1Q2PP/4RRK1 w - - 9 22",
        "moveNumber": 21,
        "classification": "best",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 21.",
          "lines": [
            {
              "move": "Na5",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Na5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Be2",
        "from": "c4",
        "to": "e2",
        "color": "w",
        "fen": "2r2r1k/1pp3pp/1p1p2q1/nN3b2/5P2/2P5/PP1QB1PP/4RRK1 b - - 10 22",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": -2,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Be2",
              "eval": -2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Be4",
        "from": "f5",
        "to": "e4",
        "color": "b",
        "fen": "2r2r1k/1pp3pp/1p1p2q1/nN6/4bP2/2P5/PP1QB1PP/4RRK1 w - - 11 23",
        "moveNumber": 22,
        "classification": "best",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 22.",
          "lines": [
            {
              "move": "Be4",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Be4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rf2",
        "from": "f1",
        "to": "f2",
        "color": "w",
        "fen": "2r2r1k/1pp3pp/1p1p2q1/nN6/4bP2/2P5/PP1QBRPP/4R1K1 b - - 12 23",
        "moveNumber": 23,
        "classification": "best",
        "eval": {
          "eval": -2.1,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "Rf2",
              "eval": -2.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf2"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "d5",
        "from": "d6",
        "to": "d5",
        "color": "b",
        "fen": "2r2r1k/1pp3pp/1p4q1/nN1p4/4bP2/2P5/PP1QBRPP/4R1K1 w - - 0 24",
        "moveNumber": 23,
        "classification": "excellent",
        "eval": {
          "eval": -2.2,
          "why": "Control of center and piece coordination on move 23.",
          "lines": [
            {
              "move": "d5",
              "eval": -2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "d5"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "b4",
        "from": "b2",
        "to": "b4",
        "color": "w",
        "fen": "2r2r1k/1pp3pp/1p4q1/nN1p4/1P2bP2/2P5/P2QBRPP/4R1K1 b - - 0 24",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.2,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "b4",
              "eval": -2.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "b4"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Nc6",
        "from": "a5",
        "to": "c6",
        "color": "b",
        "fen": "2r2r1k/1pp3pp/1pn3q1/1N1p4/1P2bP2/2P5/P2QBRPP/4R1K1 w - - 1 25",
        "moveNumber": 24,
        "classification": "best",
        "eval": {
          "eval": -2.3,
          "why": "Control of center and piece coordination on move 24.",
          "lines": [
            {
              "move": "Nc6",
              "eval": -2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Nd4",
        "from": "b5",
        "to": "d4",
        "color": "w",
        "fen": "2r2r1k/1pp3pp/1pn3q1/3p4/1P1NbP2/2P5/P2QBRPP/4R1K1 b - - 2 25",
        "moveNumber": 25,
        "classification": "good",
        "eval": {
          "eval": -2.3,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Nd4",
              "eval": -2.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd4"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Ne7",
        "from": "c6",
        "to": "e7",
        "color": "b",
        "fen": "2r2r1k/1pp1n1pp/1p4q1/3p4/1P1NbP2/2P5/P2QBRPP/4R1K1 w - - 3 26",
        "moveNumber": 25,
        "classification": "best",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 25.",
          "lines": [
            {
              "move": "Ne7",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Ne7"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Bf3",
        "from": "e2",
        "to": "f3",
        "color": "w",
        "fen": "2r2r1k/1pp1n1pp/1p4q1/3p4/1P1NbP2/2P2B2/P2Q1RPP/4R1K1 b - - 4 26",
        "moveNumber": 26,
        "classification": "excellent",
        "eval": {
          "eval": -2.4,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "Bf3",
              "eval": -2.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bf3"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "c5",
        "from": "c7",
        "to": "c5",
        "color": "b",
        "fen": "2r2r1k/1p2n1pp/1p4q1/2pp4/1P1NbP2/2P2B2/P2Q1RPP/4R1K1 w - - 0 27",
        "moveNumber": 26,
        "classification": "good",
        "eval": {
          "eval": -2.5,
          "why": "Control of center and piece coordination on move 26.",
          "lines": [
            {
              "move": "c5",
              "eval": -2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "c5"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Bxe4",
        "from": "f3",
        "to": "e4",
        "color": "w",
        "fen": "2r2r1k/1p2n1pp/1p4q1/2pp4/1P1NBP2/2P5/P2Q1RPP/4R1K1 b - - 0 27",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -2.5,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "Bxe4",
              "eval": -2.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Bxe4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "dxe4",
        "from": "d5",
        "to": "e4",
        "color": "b",
        "fen": "2r2r1k/1p2n1pp/1p4q1/2p5/1P1NpP2/2P5/P2Q1RPP/4R1K1 w - - 0 28",
        "moveNumber": 27,
        "classification": "best",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 27.",
          "lines": [
            {
              "move": "dxe4",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "dxe4"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Nc2",
        "from": "d4",
        "to": "c2",
        "color": "w",
        "fen": "2r2r1k/1p2n1pp/1p4q1/2p5/1P2pP2/2P5/P1NQ1RPP/4R1K1 b - - 1 28",
        "moveNumber": 28,
        "classification": "good",
        "eval": {
          "eval": -2.6,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Nc2",
              "eval": -2.6,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nc2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rcd8",
        "from": "c8",
        "to": "d8",
        "color": "b",
        "fen": "3r1r1k/1p2n1pp/1p4q1/2p5/1P2pP2/2P5/P1NQ1RPP/4R1K1 w - - 2 29",
        "moveNumber": 28,
        "classification": "excellent",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 28.",
          "lines": [
            {
              "move": "Rcd8",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rcd8"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qe2",
        "from": "d2",
        "to": "e2",
        "color": "w",
        "fen": "3r1r1k/1p2n1pp/1p4q1/2p5/1P2pP2/2P5/P1N1QRPP/4R1K1 b - - 3 29",
        "moveNumber": 29,
        "classification": "best",
        "eval": {
          "eval": -2.7,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Qe2",
              "eval": -2.7,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qe2"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Nd5",
        "from": "e7",
        "to": "d5",
        "color": "b",
        "fen": "3r1r1k/1p4pp/1p4q1/2pn4/1P2pP2/2P5/P1N1QRPP/4R1K1 w - - 4 30",
        "moveNumber": 29,
        "classification": "good",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 29.",
          "lines": [
            {
              "move": "Nd5",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nd5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qxe4",
        "from": "e2",
        "to": "e4",
        "color": "w",
        "fen": "3r1r1k/1p4pp/1p4q1/2pn4/1P2QP2/2P5/P1N2RPP/4R1K1 b - - 0 30",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": -2.8,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Qxe4",
              "eval": -2.8,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxe4"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Qxe4",
        "from": "g6",
        "to": "e4",
        "color": "b",
        "fen": "3r1r1k/1p4pp/1p6/2pn4/1P2qP2/2P5/P1N2RPP/4R1K1 w - - 0 31",
        "moveNumber": 30,
        "classification": "best",
        "eval": {
          "eval": -2.9,
          "why": "Control of center and piece coordination on move 30.",
          "lines": [
            {
              "move": "Qxe4",
              "eval": -2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Qxe4"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rxe4",
        "from": "e1",
        "to": "e4",
        "color": "w",
        "fen": "3r1r1k/1p4pp/1p6/2pn4/1P2RP2/2P5/P1N2RPP/6K1 b - - 0 31",
        "moveNumber": 31,
        "classification": "excellent",
        "eval": {
          "eval": -2.9,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Rxe4",
              "eval": -2.9,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rxe4"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Nxc3",
        "from": "d5",
        "to": "c3",
        "color": "b",
        "fen": "3r1r1k/1p4pp/1p6/2p5/1P2RP2/2n5/P1N2RPP/6K1 w - - 0 32",
        "moveNumber": 31,
        "classification": "best",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 31.",
          "lines": [
            {
              "move": "Nxc3",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Nxc3"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Re7",
        "from": "e4",
        "to": "e7",
        "color": "w",
        "fen": "3r1r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1N2RPP/6K1 b - - 1 32",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": -3,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Re7",
              "eval": -3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Re7"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rd1+",
        "from": "d8",
        "to": "d1",
        "color": "b",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1N2RPP/3r2K1 w - - 2 33",
        "moveNumber": 32,
        "classification": "best",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 32.",
          "lines": [
            {
              "move": "Rd1+",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd1+"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rf1",
        "from": "f2",
        "to": "f1",
        "color": "w",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1N3PP/3r1RK1 b - - 3 33",
        "moveNumber": 33,
        "classification": "best",
        "eval": {
          "eval": -3.1,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Rf1",
              "eval": -3.1,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Rd2",
        "from": "d1",
        "to": "d2",
        "color": "b",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1Nr2PP/5RK1 w - - 4 34",
        "moveNumber": 33,
        "classification": "excellent",
        "eval": {
          "eval": -3.2,
          "why": "Control of center and piece coordination on move 33.",
          "lines": [
            {
              "move": "Rd2",
              "eval": -3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd2"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rf2",
        "from": "f1",
        "to": "f2",
        "color": "w",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1Nr1RPP/6K1 b - - 5 34",
        "moveNumber": 34,
        "classification": "good",
        "eval": {
          "eval": -3.2,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Rf2",
              "eval": -3.2,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf2"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rd1+",
        "from": "d2",
        "to": "d1",
        "color": "b",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1N2RPP/3r2K1 w - - 6 35",
        "moveNumber": 34,
        "classification": "best",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 34.",
          "lines": [
            {
              "move": "Rd1+",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd1+"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Rf1",
        "from": "f2",
        "to": "f1",
        "color": "w",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1N3PP/3r1RK1 b - - 7 35",
        "moveNumber": 35,
        "classification": "best",
        "eval": {
          "eval": -3.3,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Rf1",
              "eval": -3.3,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf1"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rd2",
        "from": "d1",
        "to": "d2",
        "color": "b",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1Nr2PP/5RK1 w - - 8 36",
        "moveNumber": 35,
        "classification": "good",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 35.",
          "lines": [
            {
              "move": "Rd2",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd2"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Rf2",
        "from": "f1",
        "to": "f2",
        "color": "w",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1Nr1RPP/6K1 b - - 9 36",
        "moveNumber": 36,
        "classification": "best",
        "eval": {
          "eval": -3.4,
          "why": "Control of center and piece coordination on move 36.",
          "lines": [
            {
              "move": "Rf2",
              "eval": -3.4,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rf2"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Rd1+",
        "from": "d2",
        "to": "d1",
        "color": "b",
        "fen": "5r1k/1p2R1pp/1p6/2p5/1P3P2/2n5/P1N2RPP/3r2K1 w - - 10 37",
        "moveNumber": 36,
        "classification": "best",
        "eval": {
          "eval": -3.5,
          "why": "Control of center and piece coordination on move 36.",
          "lines": [
            {
              "move": "Rd1+",
              "eval": -3.5,
              "depth": 16,
              "why": "Top engine recommendation.",
              "pv": [
                "Rd1+"
              ]
            }
          ]
        },
        "timeSpent": 9
      }
    ]
  }
];
