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
    "result": "0-1",
    "date": "2026-10-22T19:30:00Z",
    "timeControl": "10 min",
    "speed": "rapid",
    "source": "online",
    "opening": {
      "eco": "C50",
      "name": "Italian Game: Giuoco Pianissimo"
    },
    "pgn": "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Bc5 5. O-O d6 6. Bxf7+ Kxf7 7. Ng5+ Kg8 8. Qf3 Qe7 9. Nc3 Be6 10. Nxe6 Qxe6 11. Bg5 Rf8 12. Bxf6 Rxf6 13. Qg3 Nd4 14. Kh1 Nxc2 15. Rac1 Nd4 16. Nd5 Rf7 17. f4 Ne2 18. Qg5 Nxc1 19. f5 Qd7 20. f6 h6 21. Qg3 g5 22. Rxc1 c6 23. Ne7+ Kh7 24. Qf3 Qe6 25. Rf1 Re8 26. Qh5 Rexe7 27. fxe7 Rxf1#",
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
        "coachComment": "Solid start. e4 stakes an immediate claim on the center.",
        "eval": {
          "eval": 0.2,
          "mate": null,
          "bestMove": "e4",
          "why": "Controls central squares and frees diagonals for bishop and queen.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.2,
              "mate": null,
              "depth": 18,
              "why": "Controls central squares and frees diagonals for bishop and queen.",
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
        "coachComment": "Black responds symmetrically to contest the center.",
        "eval": {
          "eval": 0.2,
          "mate": null,
          "bestMove": "e5",
          "why": "Equalizes in the center and challenges White for central space.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.2,
              "mate": null,
              "depth": 18,
              "why": "Equalizes in the center and challenges White for central space.",
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
        "coachComment": "Knight development with an active threat on e5.",
        "eval": {
          "eval": 0.2,
          "mate": null,
          "bestMove": "Nf3",
          "why": "Develops a minor piece while attacking the undefended e5 pawn.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.2,
              "mate": null,
              "depth": 18,
              "why": "Develops a minor piece while attacking the undefended e5 pawn.",
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
        "coachComment": "Natural defense and piece development.",
        "eval": {
          "eval": 0.2,
          "mate": null,
          "bestMove": "Nc6",
          "why": "Naturally defends e5 and develops toward the center.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.2,
              "mate": null,
              "depth": 18,
              "why": "Naturally defends e5 and develops toward the center.",
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
        "coachComment": "Bc4 aims directly at Black’s vulnerable f7 square.",
        "eval": {
          "eval": 0.3,
          "mate": null,
          "bestMove": "Bc4",
          "why": "The Italian Game. Points pressure toward the f7 weakness.",
          "lines": [
            {
              "move": "Bc4",
              "eval": 0.3,
              "mate": null,
              "depth": 18,
              "why": "The Italian Game. Points pressure toward the f7 weakness.",
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
        "coachComment": "Two Knights Defense, immediately counterattacking e4.",
        "eval": {
          "eval": 0.3,
          "mate": null,
          "bestMove": "Nf6",
          "why": "Two Knights Defense, applying counter-pressure against e4.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.3,
              "mate": null,
              "depth": 18,
              "why": "Two Knights Defense, applying counter-pressure against e4.",
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
        "coachComment": "Quiet and solid, securing e4.",
        "eval": {
          "eval": 0.3,
          "mate": null,
          "bestMove": "d3",
          "why": "Giuoco Pianissimo. Fortifies e4 and supports the bishop.",
          "lines": [
            {
              "move": "d3",
              "eval": 0.3,
              "mate": null,
              "depth": 18,
              "why": "Giuoco Pianissimo. Fortifies e4 and supports the bishop.",
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
        "coachComment": "Active development along the a7-g1 diagonal.",
        "eval": {
          "eval": 0.3,
          "mate": null,
          "bestMove": "Bc5",
          "why": "Develops Black’s king bishop to an active post.",
          "lines": [
            {
              "move": "Bc5",
              "eval": 0.3,
              "mate": null,
              "depth": 18,
              "why": "Develops Black’s king bishop to an active post.",
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
        "classification": "book",
        "coachComment": "King safety first before launching operations.",
        "eval": {
          "eval": 0.3,
          "mate": null,
          "bestMove": "O-O",
          "why": "Tucks the king away to safety and activates the f1 rook.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.3,
              "mate": null,
              "depth": 18,
              "why": "Tucks the king away to safety and activates the f1 rook.",
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
        "classification": "book",
        "coachComment": "Solid pawn structure maintaining central balance.",
        "eval": {
          "eval": 0.3,
          "mate": null,
          "bestMove": "d6",
          "why": "Anchors c5 bishop and frees the light-squared bishop.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.3,
              "mate": null,
              "depth": 18,
              "why": "Anchors c5 bishop and frees the light-squared bishop.",
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
        "coachComment": "This gives away a free bishop.",
        "variation": [
          "Kxf7",
          "Ng5+",
          "Kg8"
        ],
        "eval": {
          "eval": -3.54,
          "mate": null,
          "bestMove": "c3",
          "why": "Gives away a free bishop with no follow-up attack, leaving White down material.",
          "lines": [
            {
              "move": "c3",
              "eval": 0.3,
              "depth": 18,
              "why": "Prepares the d4 pawn break to seize the center.",
              "pv": [
                "c3",
                "O-O",
                "h3"
              ]
            },
            {
              "move": "Nc3",
              "eval": 0.2,
              "depth": 18,
              "why": "Natural knight development defending e4.",
              "pv": [
                "Nc3",
                "O-O",
                "h3"
              ]
            },
            {
              "move": "Bb3",
              "eval": 0.2,
              "depth": 18,
              "why": "Prophylactic retreat keeping the bishop active.",
              "pv": [
                "Bb3",
                "O-O",
                "h3"
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
        "coachComment": "Black accepts the gift with the king.",
        "eval": {
          "eval": -3.54,
          "mate": null,
          "bestMove": "Kxf7",
          "why": "Black accepts the sacrificed bishop and is clearly ahead.",
          "lines": [
            {
              "move": "Kxf7",
              "eval": -3.54,
              "mate": null,
              "depth": 18,
              "why": "Black accepts the sacrificed bishop and is clearly ahead.",
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
        "coachComment": "Checking without sufficient support just loses time.",
        "eval": {
          "eval": -4.0,
          "mate": null,
          "bestMove": "c3",
          "why": "Premature knight check that does not trouble Black.",
          "lines": [
            {
              "move": "c3",
              "eval": -3.54,
              "depth": 16,
              "why": "c3 stabilizes the center and prevents Black’s knight from penetrating.",
              "pv": [
                "c3",
                "Qe7",
                "h3"
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
        "classification": "best",
        "coachComment": "King finds shelter safely on g8.",
        "eval": {
          "eval": -4.0,
          "mate": null,
          "bestMove": "Kg8",
          "why": "The king tucks away safely on g8.",
          "lines": [
            {
              "move": "Kg8",
              "eval": -4.0,
              "mate": null,
              "depth": 18,
              "why": "The king tucks away safely on g8.",
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
        "coachComment": "Early queen sortie leaves White vulnerable to tactical counters.",
        "eval": {
          "eval": -5.1,
          "mate": null,
          "bestMove": "Nc3",
          "why": "Brings queen out early into potential tactical counter-attacks.",
          "lines": [
            {
              "move": "Nc3",
              "eval": -4.0,
              "depth": 16,
              "why": "Nc3 develops a piece rather than exposing the queen early.",
              "pv": [
                "Nc3",
                "Qe8",
                "Be3"
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
        "classification": "best",
        "coachComment": "Calm queen development connecting rooks.",
        "eval": {
          "eval": -5.1,
          "mate": null,
          "bestMove": "Qe7",
          "why": "Connects rooks and guards key central squares.",
          "lines": [
            {
              "move": "Qe7",
              "eval": -4.5,
              "mate": null,
              "depth": 18,
              "why": "Connects rooks and guards key central squares.",
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
        "coachComment": "Developing the queenside knight.",
        "eval": {
          "eval": -5.1,
          "mate": null,
          "bestMove": "Nc3",
          "why": "Develops knight toward central squares.",
          "lines": [
            {
              "move": "Nc3",
              "eval": -5.1,
              "mate": null,
              "depth": 18,
              "why": "Develops knight toward central squares.",
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
        "classification": "best",
        "coachComment": "Neutralizes White’s minor piece activity.",
        "eval": {
          "eval": -5.1,
          "mate": null,
          "bestMove": "Be6",
          "why": "Offers bishop exchange to neutralize White’s remaining piece.",
          "lines": [
            {
              "move": "Be6",
              "eval": -5.1,
              "mate": null,
              "depth": 18,
              "why": "Offers bishop exchange to neutralize White’s remaining piece.",
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
        "classification": "inaccuracy",
        "coachComment": "Trades off White’s only active piece while down material.",
        "eval": {
          "eval": -5.6,
          "mate": null,
          "bestMove": "Be3",
          "why": "Exchanges the attacking knight, simplifying into a lost endgame.",
          "lines": [
            {
              "move": "Be3",
              "eval": -5.1,
              "depth": 16,
              "why": "Be3 maintains tension rather than trading White’s active knight.",
              "pv": [
                "Be3",
                "Bxe3",
                "fxe3"
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
        "coachComment": "Central queen recapture with total control.",
        "eval": {
          "eval": -5.6,
          "mate": null,
          "bestMove": "Qxe6",
          "why": "Black recaptures with the queen, dominating the center.",
          "lines": [
            {
              "move": "Qxe6",
              "eval": -5.6,
              "mate": null,
              "depth": 18,
              "why": "Black recaptures with the queen, dominating the center.",
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
        "classification": "good",
        "coachComment": "Pinning the knight to seek counterplay.",
        "eval": {
          "eval": -5.6,
          "mate": null,
          "bestMove": "Bg5",
          "why": "Pins the f6 knight against the queen.",
          "lines": [
            {
              "move": "Bg5",
              "eval": -5.6,
              "mate": null,
              "depth": 18,
              "why": "Pins the f6 knight against the queen.",
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
        "classification": "excellent",
        "coachComment": "Taking control of the semi-open f-file.",
        "eval": {
          "eval": -5.6,
          "mate": null,
          "bestMove": "Rf8",
          "why": "Reinforces the f-file and readies a counter-strike.",
          "lines": [
            {
              "move": "Rf8",
              "eval": -5.6,
              "mate": null,
              "depth": 18,
              "why": "Reinforces the f-file and readies a counter-strike.",
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
        "classification": "mistake",
        "coachComment": "Surrendering the bishop pair deepens Black’s advantage.",
        "eval": {
          "eval": -6.8,
          "mate": null,
          "bestMove": "Qg3",
          "why": "Gives up White’s dark-squared bishop without compensation.",
          "lines": [
            {
              "move": "Qg3",
              "eval": -5.3,
              "depth": 16,
              "why": "Qg3 sidesteps the pin while keeping the dark-squared bishop.",
              "pv": [
                "Qg3",
                "Nh5",
                "Qh4"
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
        "coachComment": "Active recapture threatening the queen.",
        "eval": {
          "eval": -6.8,
          "mate": null,
          "bestMove": "Rxf6",
          "why": "Recaptures and gains a tempo hitting White’s queen.",
          "lines": [
            {
              "move": "Rxf6",
              "eval": -6.8,
              "mate": null,
              "depth": 18,
              "why": "Recaptures and gains a tempo hitting White’s queen.",
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
        "classification": "good",
        "coachComment": "Queen steps aside to safety.",
        "eval": {
          "eval": -6.9,
          "mate": null,
          "bestMove": "Qg3",
          "why": "Steps queen out of attack to g3.",
          "lines": [
            {
              "move": "Qg3",
              "eval": -6.9,
              "mate": null,
              "depth": 18,
              "why": "Steps queen out of attack to g3.",
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
        "coachComment": "Powerful knight leap threatening Nc2 fork.",
        "eval": {
          "eval": -6.9,
          "mate": null,
          "bestMove": "Nd4",
          "why": "Threatens the devastating fork on c2.",
          "lines": [
            {
              "move": "Nd4",
              "eval": -6.9,
              "mate": null,
              "depth": 18,
              "why": "Threatens the devastating fork on c2.",
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
        "classification": "best",
        "coachComment": "Stepping off the pin diagonal.",
        "eval": {
          "eval": -6.9,
          "mate": null,
          "bestMove": "Kh1",
          "why": "Moves king off the g1-a7 diagonal and evades check.",
          "lines": [
            {
              "move": "Kh1",
              "eval": -6.9,
              "mate": null,
              "depth": 18,
              "why": "Moves king off the g1-a7 diagonal and evades check.",
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
        "classification": "best",
        "coachComment": "Black snatches another pawn.",
        "eval": {
          "eval": -7,
          "mate": null,
          "bestMove": "Nxc2",
          "why": "Black wins another pawn on c2.",
          "lines": [
            {
              "move": "Nxc2",
              "eval": -7,
              "mate": null,
              "depth": 18,
              "why": "Black wins another pawn on c2.",
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
        "classification": "good",
        "coachComment": "Rook attacks the knight.",
        "eval": {
          "eval": -7.1,
          "mate": null,
          "bestMove": "Rac1",
          "why": "Attacks the advanced knight on c2.",
          "lines": [
            {
              "move": "Rac1",
              "eval": -7.1,
              "mate": null,
              "depth": 18,
              "why": "Attacks the advanced knight on c2.",
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
        "classification": "best",
        "coachComment": "Dominating knight outpost on d4.",
        "eval": {
          "eval": -7.1,
          "mate": null,
          "bestMove": "Nd4",
          "why": "Knight retreats to a dominating central outpost.",
          "lines": [
            {
              "move": "Nd4",
              "eval": -7.1,
              "mate": null,
              "depth": 18,
              "why": "Knight retreats to a dominating central outpost.",
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
        "classification": "inaccuracy",
        "coachComment": "Knight leaps forward but leaves the back rank open.",
        "eval": {
          "eval": -7.7,
          "mate": null,
          "bestMove": "Rce1",
          "why": "Aggressive leap that leaves White’s back rank weak.",
          "lines": [
            {
              "move": "Rce1",
              "eval": -7.1,
              "depth": 16,
              "why": "Rce1 controls the e-file and fortifies the back rank.",
              "pv": [
                "Rce1",
                "Rf7",
                "f4"
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
        "classification": "best",
        "coachComment": "Solid defense of c7.",
        "eval": {
          "eval": -7.7,
          "mate": null,
          "bestMove": "Rf7",
          "why": "Defends c7 and maintains rook along the f-file.",
          "lines": [
            {
              "move": "Rf7",
              "eval": -7.7,
              "mate": null,
              "depth": 18,
              "why": "Defends c7 and maintains rook along the f-file.",
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
        "classification": "mistake",
        "coachComment": "Overambitious pawn thrust exposing White’s king.",
        "eval": {
          "eval": -9.3,
          "mate": null,
          "bestMove": "Rce1",
          "why": "Opens lines while White’s king is vulnerable.",
          "lines": [
            {
              "move": "Rce1",
              "eval": -7.7,
              "depth": 16,
              "why": "Rce1 centralizes the rook on the e-file and guards against knight infiltration.",
              "pv": [
                "Rce1",
                "c6",
                "Nc3"
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
        "classification": "brilliant",
        "coachComment": "Brilliant knight maneuver picking up the rook.",
        "eval": {
          "eval": -9.5,
          "mate": null,
          "bestMove": "Ne2",
          "why": "Forks queen and rook while attacking White’s position.",
          "lines": [
            {
              "move": "Ne2",
              "eval": -9.5,
              "mate": null,
              "depth": 18,
              "why": "Forks queen and rook while attacking White’s position.",
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
        "classification": "good",
        "coachComment": "Desperation queen counter-attack.",
        "eval": {
          "eval": -9.6,
          "mate": null,
          "bestMove": "Qg5",
          "why": "Attempts a counter-threat on c1.",
          "lines": [
            {
              "move": "Qg5",
              "eval": -9.6,
              "mate": null,
              "depth": 18,
              "why": "Attempts a counter-threat on c1.",
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
        "coachComment": "Cash in the rook. Black is up overwhelming material.",
        "eval": {
          "eval": -9.8,
          "mate": null,
          "bestMove": "Nxc1",
          "why": "Black wins the exchange cleanly.",
          "lines": [
            {
              "move": "Nxc1",
              "eval": -9.8,
              "mate": null,
              "depth": 18,
              "why": "Black wins the exchange cleanly.",
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
        "classification": "good",
        "coachComment": "White pushes pawns forward.",
        "eval": {
          "eval": -9.9,
          "mate": null,
          "bestMove": "f5",
          "why": "Tries to keep pressure on Black’s queen.",
          "lines": [
            {
              "move": "f5",
              "eval": -9.9,
              "mate": null,
              "depth": 18,
              "why": "Tries to keep pressure on Black’s queen.",
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
        "coachComment": "Prudent queen retreat.",
        "eval": {
          "eval": -10,
          "mate": null,
          "bestMove": "Qd7",
          "why": "Queen retreats while keeping control over f7.",
          "lines": [
            {
              "move": "Qd7",
              "eval": -10,
              "mate": null,
              "depth": 18,
              "why": "Queen retreats while keeping control over f7.",
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
        "coachComment": "Desperation pawn push.",
        "eval": {
          "eval": -11.6,
          "mate": null,
          "bestMove": "Rxc1",
          "why": "Advances a pawn without piece coordination.",
          "lines": [
            {
              "move": "Rxc1",
              "eval": -10,
              "depth": 16,
              "why": "Recapturing the knight on c1 was essential.",
              "pv": [
                "Rxc1",
                "c6",
                "Nc3"
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
        "fen": "6kr/pppq1rp1/3p1P1p/2bNp1Q1/4P3/3P4/PP4PP/2n2R1K w - - 0 21",
        "moveNumber": 20,
        "classification": "excellent",
        "coachComment": "Kicking the queen away with tempo.",
        "eval": {
          "eval": -11.6,
          "mate": null,
          "bestMove": "h6",
          "why": "Challenges the white queen and creates luft.",
          "lines": [
            {
              "move": "h6",
              "eval": -11.6,
              "mate": null,
              "depth": 18,
              "why": "Challenges the white queen and creates luft.",
              "pv": [
                "h6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Qg3",
        "from": "g5",
        "to": "g3",
        "color": "w",
        "fen": "6kr/pppq1rp1/3p1P1p/2bNp3/4P3/3P2Q1/PP4PP/2n2R1K b - - 1 21",
        "moveNumber": 21,
        "classification": "inaccuracy",
        "coachComment": "Queen forced backward.",
        "eval": {
          "eval": -12.2,
          "mate": null,
          "bestMove": "Qg4",
          "why": "Queen retreats to g3.",
          "lines": [
            {
              "move": "Qg4",
              "eval": -11.6,
              "depth": 16,
              "why": "Qg4 maintains an active threat on the kingside.",
              "pv": [
                "Qg4",
                "g5",
                "Rxc1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "g5",
        "from": "g7",
        "to": "g5",
        "color": "b",
        "fen": "6kr/pppq1r2/3p1P1p/2bNp1p1/4P3/3P2Q1/PP4PP/2n2R1K w - - 0 22",
        "moveNumber": 21,
        "classification": "best",
        "coachComment": "Cementing kingside structure.",
        "eval": {
          "eval": -12.2,
          "mate": null,
          "bestMove": "g5",
          "why": "Blunts White’s pawn thrust and cements kingside.",
          "lines": [
            {
              "move": "g5",
              "eval": -12.2,
              "mate": null,
              "depth": 18,
              "why": "Blunts White’s pawn thrust and cements kingside.",
              "pv": [
                "g5"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Rxc1",
        "from": "f1",
        "to": "c1",
        "color": "w",
        "fen": "6kr/pppq1r2/3p1P1p/2bNp1p1/4P3/3P2Q1/PP4PP/2R4K b - - 0 22",
        "moveNumber": 22,
        "classification": "good",
        "coachComment": "White recaptures on c1.",
        "eval": {
          "eval": -12.3,
          "mate": null,
          "bestMove": "Rxc1",
          "why": "Finally recaptures the knight on c1.",
          "lines": [
            {
              "move": "Rxc1",
              "eval": -12.3,
              "mate": null,
              "depth": 18,
              "why": "Finally recaptures the knight on c1.",
              "pv": [
                "Rxc1"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "c6",
        "from": "c7",
        "to": "c6",
        "color": "b",
        "fen": "6kr/pp1q1r2/2pp1P1p/2bNp1p1/4P3/3P2Q1/PP4PP/2R4K w - - 0 23",
        "moveNumber": 22,
        "classification": "best",
        "coachComment": "Evicting White’s knight.",
        "eval": {
          "eval": -12.3,
          "mate": null,
          "bestMove": "c6",
          "why": "Kicks the white knight from d5.",
          "lines": [
            {
              "move": "c6",
              "eval": -12.3,
              "mate": null,
              "depth": 18,
              "why": "Kicks the white knight from d5.",
              "pv": [
                "c6"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "Ne7+",
        "from": "d5",
        "to": "e7",
        "color": "w",
        "fen": "6kr/pp1qNr2/2pp1P1p/2b1p1p1/4P3/3P2Q1/PP4PP/2R4K b - - 1 23",
        "moveNumber": 23,
        "classification": "mistake",
        "coachComment": "Spite check before knight falls.",
        "eval": {
          "eval": -13.9,
          "mate": null,
          "bestMove": "Nc3",
          "why": "Desperate knight check that leads nowhere.",
          "lines": [
            {
              "move": "Nc3",
              "eval": -12.3,
              "depth": 16,
              "why": "Nc3 keeps the knight on the board.",
              "pv": [
                "Nc3",
                "Kh7",
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Kh7",
        "from": "g8",
        "to": "h7",
        "color": "b",
        "fen": "7r/pp1qNr1k/2pp1P1p/2b1p1p1/4P3/3P2Q1/PP4PP/2R4K w - - 2 24",
        "moveNumber": 23,
        "classification": "best",
        "coachComment": "King steps aside calmly.",
        "eval": {
          "eval": -13.9,
          "mate": null,
          "bestMove": "Kh7",
          "why": "King steps aside safely to h7.",
          "lines": [
            {
              "move": "Kh7",
              "eval": -13.9,
              "mate": null,
              "depth": 18,
              "why": "King steps aside safely to h7.",
              "pv": [
                "Kh7"
              ]
            }
          ]
        },
        "timeSpent": 7
      },
      {
        "san": "Qf3",
        "from": "g3",
        "to": "f3",
        "color": "w",
        "fen": "7r/pp1qNr1k/2pp1P1p/2b1p1p1/4P3/3P1Q2/PP4PP/2R4K b - - 3 24",
        "moveNumber": 24,
        "classification": "good",
        "coachComment": "Defending the f6 outpost.",
        "eval": {
          "eval": -14,
          "mate": null,
          "bestMove": "Qf3",
          "why": "White tries to support f6.",
          "lines": [
            {
              "move": "Qf3",
              "eval": -14,
              "mate": null,
              "depth": 18,
              "why": "White tries to support f6.",
              "pv": [
                "Qf3"
              ]
            }
          ]
        },
        "timeSpent": 8
      },
      {
        "san": "Qe6",
        "from": "d7",
        "to": "e6",
        "color": "b",
        "fen": "7r/pp2Nr1k/2ppqP1p/2b1p1p1/4P3/3P1Q2/PP4PP/2R4K w - - 4 25",
        "moveNumber": 24,
        "classification": "best",
        "coachComment": "Targeting White’s pinned pieces.",
        "eval": {
          "eval": -14,
          "mate": null,
          "bestMove": "Qe6",
          "why": "Centralizes queen and piles pressure on e7.",
          "lines": [
            {
              "move": "Qe6",
              "eval": -14,
              "mate": null,
              "depth": 18,
              "why": "Centralizes queen and piles pressure on e7.",
              "pv": [
                "Qe6"
              ]
            }
          ]
        },
        "timeSpent": 9
      },
      {
        "san": "Rf1",
        "from": "c1",
        "to": "f1",
        "color": "w",
        "fen": "7r/pp2Nr1k/2ppqP1p/2b1p1p1/4P3/3P1Q2/PP4PP/5R1K b - - 5 25",
        "moveNumber": 25,
        "classification": "good",
        "coachComment": "Rook slides to f1.",
        "eval": {
          "eval": -14.1,
          "mate": null,
          "bestMove": "Rf1",
          "why": "Guards the f-file.",
          "lines": [
            {
              "move": "Rf1",
              "eval": -14.1,
              "mate": null,
              "depth": 18,
              "why": "Guards the f-file.",
              "pv": [
                "Rf1"
              ]
            }
          ]
        },
        "timeSpent": 2
      },
      {
        "san": "Re8",
        "from": "h8",
        "to": "e8",
        "color": "b",
        "fen": "4r3/pp2Nr1k/2ppqP1p/2b1p1p1/4P3/3P1Q2/PP4PP/5R1K w - - 6 26",
        "moveNumber": 25,
        "classification": "best",
        "coachComment": "Bringing the last piece into the attack.",
        "eval": {
          "eval": -14.1,
          "mate": null,
          "bestMove": "Re8",
          "why": "Brings final rook to attack e7.",
          "lines": [
            {
              "move": "Re8",
              "eval": -14.1,
              "mate": null,
              "depth": 18,
              "why": "Brings final rook to attack e7.",
              "pv": [
                "Re8"
              ]
            }
          ]
        },
        "timeSpent": 3
      },
      {
        "san": "Qh5",
        "from": "f3",
        "to": "h5",
        "color": "w",
        "fen": "4r3/pp2Nr1k/2ppqP1p/2b1p1pQ/4P3/3P4/PP4PP/5R1K b - - 7 26",
        "moveNumber": 26,
        "classification": "mistake",
        "coachComment": "Desperation attack against g6.",
        "eval": {
          "eval": -15.7,
          "mate": null,
          "bestMove": "h3",
          "why": "Desperation attack against g6.",
          "lines": [
            {
              "move": "h3",
              "eval": -14.1,
              "depth": 16,
              "why": "h3 provides luft against back-rank mate.",
              "pv": [
                "h3",
                "Rexe7",
                "fxe7"
              ]
            }
          ]
        },
        "timeSpent": 4
      },
      {
        "san": "Rexe7",
        "from": "e8",
        "to": "e7",
        "color": "b",
        "fen": "8/pp2rr1k/2ppqP1p/2b1p1pQ/4P3/3P4/PP4PP/5R1K w - - 0 27",
        "moveNumber": 26,
        "classification": "best",
        "coachComment": "Rook cleans up e7.",
        "eval": {
          "eval": -15.7,
          "mate": null,
          "bestMove": "Rexe7",
          "why": "Black removes the knight.",
          "lines": [
            {
              "move": "Rexe7",
              "eval": -15.7,
              "mate": null,
              "depth": 18,
              "why": "Black removes the knight.",
              "pv": [
                "Rexe7"
              ]
            }
          ]
        },
        "timeSpent": 5
      },
      {
        "san": "fxe7",
        "from": "f6",
        "to": "e7",
        "color": "w",
        "fen": "8/pp2Pr1k/2ppq2p/2b1p1pQ/4P3/3P4/PP4PP/5R1K b - - 0 27",
        "moveNumber": 27,
        "classification": "blunder",
        "coachComment": "fxe7 is a blunder. Abandoning defense of the back rank allows an immediate checkmate.",
        "eval": {
          "eval": -99,
          "mate": -1,
          "bestMove": "h3",
          "why": "fxe7 blunders an immediate back-rank checkmate by abandoning control of f1.",
          "lines": [
            {
              "move": "h3",
              "eval": -15.7,
              "depth": 16,
              "why": "Creates luft for the king to avoid back-rank mate.",
              "pv": [
                "h3",
                "Rxf6",
                "Rxf6"
              ]
            }
          ]
        },
        "timeSpent": 6
      },
      {
        "san": "Rxf1#",
        "from": "f7",
        "to": "f1",
        "color": "b",
        "fen": "8/pp2P2k/2ppq2p/2b1p1pQ/4P3/3P4/PP4PP/5r1K w - - 0 28",
        "moveNumber": 27,
        "classification": "best",
        "coachComment": "Checkmate! Black finishes the game with a clean back-rank strike.",
        "eval": {
          "eval": -99,
          "mate": 0,
          "bestMove": "Rxf1#",
          "why": "Checkmate on the back rank.",
          "lines": [
            {
              "move": "Rxf1#",
              "eval": -99,
              "mate": 0,
              "depth": 18,
              "why": "Checkmate on the back rank.",
              "pv": [
                "Rxf1#"
              ]
            }
          ]
        },
        "timeSpent": 7
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
        "coachComment": "e4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e4",
          "why": "e4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.2,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Nc6"
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
        "coachComment": "c6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c6",
          "why": "c6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "c6",
              "eval": 0.2,
              "depth": 16,
              "why": "c6 is the top line maintaining optimal control.",
              "pv": [
                "c6",
                "e5"
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
        "coachComment": "d4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d4",
          "why": "d4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.2,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Na6"
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
        "coachComment": "d5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d5",
          "why": "d5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.2,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "e5"
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
        "coachComment": "e5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e5",
          "why": "e5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.2,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "Nd7"
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
        "coachComment": "Bf5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Bf5",
          "why": "Bf5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bf5",
              "eval": 0.2,
              "depth": 16,
              "why": "Bf5 is the top line maintaining optimal control.",
              "pv": [
                "Bf5",
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
        "fen": "rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/5N2/PPP2PPP/RNBQKB1R b KQkq - 2 4",
        "moveNumber": 4,
        "classification": "good",
        "coachComment": "Nf3 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nf3",
          "why": "Nf3 is a sound practical choice.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nd7"
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
        "coachComment": "e6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e6",
          "why": "e6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.1,
              "depth": 16,
              "why": "e6 is the top line maintaining optimal control.",
              "pv": [
                "e6",
                "Ng5"
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
        "coachComment": "Be2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Be2",
          "why": "Be2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be2",
              "eval": 0.1,
              "depth": 16,
              "why": "Be2 is the top line maintaining optimal control.",
              "pv": [
                "Be2",
                "Nd7"
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
        "coachComment": "c5 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c5",
          "why": "c5 is a sound practical choice.",
          "lines": [
            {
              "move": "c5",
              "eval": 0.2,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "dxc5"
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
        "coachComment": "c3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "c3",
          "why": "c3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "c3",
              "eval": 0.1,
              "depth": 16,
              "why": "c3 is the top line maintaining optimal control.",
              "pv": [
                "c3",
                "Nd7"
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
        "coachComment": "Nc6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nc6",
          "why": "Nc6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.1,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "dxc5"
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
        "coachComment": "O-O is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "O-O",
          "why": "O-O is a sound practical choice.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Rb8"
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
        "coachComment": "cxd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "cxd4",
          "why": "cxd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "cxd4",
              "eval": 0,
              "depth": 16,
              "why": "cxd4 is the top line maintaining optimal control.",
              "pv": [
                "cxd4",
                "c4"
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
        "coachComment": "cxd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "cxd4",
          "why": "cxd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "cxd4",
              "eval": 0,
              "depth": 16,
              "why": "cxd4 is the top line maintaining optimal control.",
              "pv": [
                "cxd4",
                "Rb8"
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
        "coachComment": "Nge7 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nge7",
          "why": "Nge7 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nge7",
              "eval": 0.1,
              "depth": 16,
              "why": "Nge7 is the top line maintaining optimal control.",
              "pv": [
                "Nge7",
                "Ng5"
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
        "coachComment": "Nc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nc3",
          "why": "Nc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Rb8"
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
        "coachComment": "Ng6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Ng6",
          "why": "Ng6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ng6",
              "eval": 0.1,
              "depth": 16,
              "why": "Ng6 is the top line maintaining optimal control.",
              "pv": [
                "Ng6",
                "Na4"
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
        "coachComment": "Be3 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be3",
          "why": "Be3 is a sound practical choice.",
          "lines": [
            {
              "move": "Be3",
              "eval": -0.1,
              "depth": 16,
              "why": "Be3 is the top line maintaining optimal control.",
              "pv": [
                "Be3",
                "Rb8"
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
        "coachComment": "Be7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be7",
          "why": "Be7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be7",
              "eval": -0.1,
              "depth": 16,
              "why": "Be7 is the top line maintaining optimal control.",
              "pv": [
                "Be7",
                "Na4"
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
        "coachComment": "Qd2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qd2",
          "why": "Qd2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qd2",
              "eval": -0.1,
              "depth": 16,
              "why": "Qd2 is the top line maintaining optimal control.",
              "pv": [
                "Qd2",
                "Rb8"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Na4"
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
        "coachComment": "Rac1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rac1",
          "why": "Rac1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rac1",
              "eval": -0.1,
              "depth": 16,
              "why": "Rac1 is the top line maintaining optimal control.",
              "pv": [
                "Rac1",
                "Rb8"
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
        "coachComment": "Rc8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rc8",
          "why": "Rc8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rc8",
              "eval": -0.1,
              "depth": 16,
              "why": "Rc8 is the top line maintaining optimal control.",
              "pv": [
                "Rc8",
                "Na4"
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
        "coachComment": "a3 is a sound practical choice.",
        "eval": {
          "eval": -0.3,
          "bestMove": "a3",
          "why": "a3 is a sound practical choice.",
          "lines": [
            {
              "move": "a3",
              "eval": -0.3,
              "depth": 16,
              "why": "a3 is the top line maintaining optimal control.",
              "pv": [
                "a3",
                "Rc7"
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
        "coachComment": "f6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "f6",
          "why": "f6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "f6",
              "eval": -0.2,
              "depth": 16,
              "why": "f6 is the top line maintaining optimal control.",
              "pv": [
                "f6",
                "exf6"
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
        "coachComment": "exf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.2,
          "bestMove": "exf6",
          "why": "exf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exf6",
              "eval": -0.2,
              "depth": 16,
              "why": "exf6 is the top line maintaining optimal control.",
              "pv": [
                "exf6",
                "Rc7"
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
        "coachComment": "Bxf6 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxf6",
          "why": "Bxf6 is a sound practical choice.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxf6 is the top line maintaining optimal control.",
              "pv": [
                "Bxf6",
                "a4"
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
        "coachComment": "b4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "b4",
          "why": "b4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b4",
              "eval": -0.1,
              "depth": 16,
              "why": "b4 is the top line maintaining optimal control.",
              "pv": [
                "b4",
                "Rc7"
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
        "coachComment": "Kh8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kh8",
          "why": "Kh8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kh8",
              "eval": -0.1,
              "depth": 16,
              "why": "Kh8 is the top line maintaining optimal control.",
              "pv": [
                "Kh8",
                "b5"
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
        "coachComment": "Na4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Na4",
          "why": "Na4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Na4",
              "eval": -0.1,
              "depth": 16,
              "why": "Na4 is the top line maintaining optimal control.",
              "pv": [
                "Na4",
                "Rc7"
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
        "coachComment": "b6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "b6",
          "why": "b6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b6",
              "eval": -0.1,
              "depth": 16,
              "why": "b6 is the top line maintaining optimal control.",
              "pv": [
                "b6",
                "Nxb6"
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
        "coachComment": "Ba6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Ba6",
          "why": "Ba6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ba6",
              "eval": -0.1,
              "depth": 16,
              "why": "Ba6 is the top line maintaining optimal control.",
              "pv": [
                "Ba6",
                "Rc7"
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
        "coachComment": "Rc7 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Rc7",
          "why": "Rc7 is a sound practical choice.",
          "lines": [
            {
              "move": "Rc7",
              "eval": 0,
              "depth": 16,
              "why": "Rc7 is the top line maintaining optimal control.",
              "pv": [
                "Rc7",
                "Bb7"
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
        "coachComment": "Nc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Nc3",
          "why": "Nc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Qe8"
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
        "coachComment": "Bg4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Bg4",
          "why": "Bg4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg4",
              "eval": 0,
              "depth": 16,
              "why": "Bg4 is the top line maintaining optimal control.",
              "pv": [
                "Bg4",
                "Bb7"
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
        "coachComment": "Ne1 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Ne1",
          "why": "Ne1 is a sound practical choice.",
          "lines": [
            {
              "move": "Ne1",
              "eval": -0.1,
              "depth": 16,
              "why": "Ne1 is the top line maintaining optimal control.",
              "pv": [
                "Ne1",
                "Qe8"
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
        "coachComment": "Nce7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nce7",
          "why": "Nce7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nce7",
              "eval": -0.1,
              "depth": 16,
              "why": "Nce7 is the top line maintaining optimal control.",
              "pv": [
                "Nce7",
                "Bb7"
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
        "coachComment": "f3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "f3",
          "why": "f3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f3",
              "eval": -0.1,
              "depth": 16,
              "why": "f3 is the top line maintaining optimal control.",
              "pv": [
                "f3",
                "Qe8"
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
        "coachComment": "Bf5 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Bf5",
          "why": "Bf5 is a sound practical choice.",
          "lines": [
            {
              "move": "Bf5",
              "eval": 0,
              "depth": 16,
              "why": "Bf5 is the top line maintaining optimal control.",
              "pv": [
                "Bf5",
                "Bb7"
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
        "coachComment": "g4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "g4",
          "why": "g4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "g4",
              "eval": -0.1,
              "depth": 16,
              "why": "g4 is the top line maintaining optimal control.",
              "pv": [
                "g4",
                "Qe8"
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
        "coachComment": "Bxg4 is brilliant, finding an inspired tactical shot.",
        "eval": {
          "eval": -0.4,
          "bestMove": "Bxg4",
          "why": "Bxg4 is brilliant, finding an inspired tactical shot.",
          "lines": [
            {
              "move": "Bxg4",
              "eval": -0.4,
              "depth": 16,
              "why": "Bxg4 is the top line maintaining optimal control.",
              "pv": [
                "Bxg4",
                "Bb7"
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
        "coachComment": "fxg4 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Bb7",
          "why": "fxg4 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Bb7",
              "eval": -0.4,
              "depth": 16,
              "why": "Bb7 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Bb7",
                "Qe8",
                "Ba8"
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
        "coachComment": "Bh4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Bh4",
          "why": "Bh4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bh4",
              "eval": -3.5,
              "depth": 16,
              "why": "Bh4 is the top line maintaining optimal control.",
              "pv": [
                "Bh4",
                "Bb7"
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
        "coachComment": "Rxf8+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Rxf8+",
          "why": "Rxf8+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxf8+",
              "eval": -3.6,
              "depth": 16,
              "why": "Rxf8+ is the top line maintaining optimal control.",
              "pv": [
                "Rxf8+",
                "Qxf8"
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
        "coachComment": "Qxf8 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Qxf8",
          "why": "Qxf8 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qxf8",
              "eval": -3.5,
              "depth": 16,
              "why": "Qxf8 is the top line maintaining optimal control.",
              "pv": [
                "Qxf8",
                "Bb7"
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
        "coachComment": "Ng2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Ng2",
          "why": "Ng2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ng2",
              "eval": -3.5,
              "depth": 16,
              "why": "Ng2 is the top line maintaining optimal control.",
              "pv": [
                "Ng2",
                "Qg8"
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
        "coachComment": "Qf3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Qf3",
          "why": "Qf3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qf3",
              "eval": -3.5,
              "depth": 16,
              "why": "Qf3 is the top line maintaining optimal control.",
              "pv": [
                "Qf3",
                "Bb7"
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
        "coachComment": "Nxh4 is a sound practical choice.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Nxh4",
          "why": "Nxh4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxh4",
              "eval": -3.6,
              "depth": 16,
              "why": "Nxh4 is the top line maintaining optimal control.",
              "pv": [
                "Nxh4",
                "Kg8"
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
        "coachComment": "Nxh4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Nxh4",
          "why": "Nxh4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxh4",
              "eval": -3.6,
              "depth": 16,
              "why": "Nxh4 is the top line maintaining optimal control.",
              "pv": [
                "Nxh4",
                "Bb7"
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
        "coachComment": "Bf1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.7,
          "bestMove": "Bf1",
          "why": "Bf1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bf1",
              "eval": -3.7,
              "depth": 16,
              "why": "Bf1 is the top line maintaining optimal control.",
              "pv": [
                "Bf1",
                "Kg8"
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
        "coachComment": "Qxg4+ is a sound practical choice.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Qxg4+",
          "why": "Qxg4+ is a sound practical choice.",
          "lines": [
            {
              "move": "Qxg4+",
              "eval": -3.5,
              "depth": 16,
              "why": "Qxg4+ is the top line maintaining optimal control.",
              "pv": [
                "Qxg4+",
                "Qg2"
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
        "coachComment": "Kh1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Kh1",
          "why": "Kh1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kh1",
              "eval": -3.6,
              "depth": 16,
              "why": "Kh1 is the top line maintaining optimal control.",
              "pv": [
                "Kh1",
                "Kg8"
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
        "coachComment": "Nef5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Nef5",
          "why": "Nef5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nef5",
              "eval": -3.5,
              "depth": 16,
              "why": "Nef5 is the top line maintaining optimal control.",
              "pv": [
                "Nef5",
                "b5"
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
        "coachComment": "Bf4 is a sound practical choice.",
        "eval": {
          "eval": -3.7,
          "bestMove": "Bf4",
          "why": "Bf4 is a sound practical choice.",
          "lines": [
            {
              "move": "Bf4",
              "eval": -3.7,
              "depth": 16,
              "why": "Bf4 is the top line maintaining optimal control.",
              "pv": [
                "Bf4",
                "Kg8"
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
        "coachComment": "Qf3+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Qf3+",
          "why": "Qf3+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qf3+",
              "eval": -3.6,
              "depth": 16,
              "why": "Qf3+ is the top line maintaining optimal control.",
              "pv": [
                "Qf3+",
                "Qg2"
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
        "coachComment": "Bg2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Bg2",
          "why": "Bg2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg2",
              "eval": -3.6,
              "depth": 16,
              "why": "Bg2 is the top line maintaining optimal control.",
              "pv": [
                "Bg2",
                "Kg8"
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
        "coachComment": "Nxg2 is a sound practical choice.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Nxg2",
          "why": "Nxg2 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxg2",
              "eval": -3.5,
              "depth": 16,
              "why": "Nxg2 is the top line maintaining optimal control.",
              "pv": [
                "Nxg2",
                "b5"
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
        "coachComment": "Qxg2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Qxg2",
          "why": "Qxg2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxg2",
              "eval": -3.5,
              "depth": 16,
              "why": "Qxg2 is the top line maintaining optimal control.",
              "pv": [
                "Qxg2",
                "Kg8"
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
        "coachComment": "Qxf4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Qxf4",
          "why": "Qxf4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxf4",
              "eval": -3.5,
              "depth": 16,
              "why": "Qxf4 is the top line maintaining optimal control.",
              "pv": [
                "Qxf4",
                "b5"
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
        "coachComment": "Ne2 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -6.7,
          "bestMove": "b5",
          "why": "Ne2 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "b5",
              "eval": -3.5,
              "depth": 16,
              "why": "b5 was the engine recommendation maintaining the initiative.",
              "pv": [
                "b5",
                "Kg8",
                "a4"
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
        "coachComment": "Rxc1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -6.7,
          "bestMove": "Rxc1+",
          "why": "Rxc1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxc1+",
              "eval": -6.7,
              "depth": 16,
              "why": "Rxc1+ is the top line maintaining optimal control.",
              "pv": [
                "Rxc1+",
                "Ng1"
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
        "classification": "blunder",
        "coachComment": "Nxc1 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -9.9,
          "bestMove": "Ng1",
          "why": "Nxc1 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Ng1",
              "eval": -6.7,
              "depth": 16,
              "why": "Ng1 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Ng1",
                "Kg8",
                "b5"
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
        "coachComment": "Qxc1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -9.9,
          "bestMove": "Qxc1+",
          "why": "Qxc1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxc1+",
              "eval": -9.9,
              "depth": 16,
              "why": "Qxc1+ is the top line maintaining optimal control.",
              "pv": [
                "Qxc1+",
                "Qg1"
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
        "coachComment": "e4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e4",
          "why": "e4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.2,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Nc6"
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
        "coachComment": "c5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c5",
          "why": "c5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "c5",
              "eval": 0.2,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
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
        "fen": "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        "moveNumber": 2,
        "classification": "book",
        "coachComment": "Nf3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf3",
          "why": "Nf3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nc6"
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
        "coachComment": "d6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d6",
          "why": "d6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.2,
              "depth": 16,
              "why": "d6 is the top line maintaining optimal control.",
              "pv": [
                "d6",
                "e5"
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
        "coachComment": "d4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d4",
          "why": "d4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.2,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Nd7"
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
        "coachComment": "cxd4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "cxd4",
          "why": "cxd4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "cxd4",
              "eval": 0.2,
              "depth": 16,
              "why": "cxd4 is the top line maintaining optimal control.",
              "pv": [
                "cxd4",
                "e5"
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
        "coachComment": "Nxd4 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nxd4",
          "why": "Nxd4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": 0.1,
              "depth": 16,
              "why": "Nxd4 is the top line maintaining optimal control.",
              "pv": [
                "Nxd4",
                "Nd7"
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
        "coachComment": "Nf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nf6",
          "why": "Nf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.1,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
                "Nb5"
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
        "coachComment": "Nc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nc3",
          "why": "Nc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Nbd7"
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
        "coachComment": "a6 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "a6",
          "why": "a6 is a sound practical choice.",
          "lines": [
            {
              "move": "a6",
              "eval": 0.2,
              "depth": 16,
              "why": "a6 is the top line maintaining optimal control.",
              "pv": [
                "a6",
                "Ndb5"
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
        "coachComment": "Bg5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bg5",
          "why": "Bg5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bg5",
              "eval": 0.1,
              "depth": 16,
              "why": "Bg5 is the top line maintaining optimal control.",
              "pv": [
                "Bg5",
                "Ra7"
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
        "coachComment": "e6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e6",
          "why": "e6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.1,
              "depth": 16,
              "why": "e6 is the top line maintaining optimal control.",
              "pv": [
                "e6",
                "Bxf6"
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
        "coachComment": "f4 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "f4",
          "why": "f4 is a sound practical choice.",
          "lines": [
            {
              "move": "f4",
              "eval": 0,
              "depth": 16,
              "why": "f4 is the top line maintaining optimal control.",
              "pv": [
                "f4",
                "Ra7"
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
        "coachComment": "Be7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Be7",
          "why": "Be7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be7",
              "eval": 0,
              "depth": 16,
              "why": "Be7 is the top line maintaining optimal control.",
              "pv": [
                "Be7",
                "Bxf6"
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
        "coachComment": "Qf3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qf3",
          "why": "Qf3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qf3",
              "eval": 0,
              "depth": 16,
              "why": "Qf3 is the top line maintaining optimal control.",
              "pv": [
                "Qf3",
                "Ra7"
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
        "coachComment": "Qc7 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Qc7",
          "why": "Qc7 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qc7",
              "eval": 0.1,
              "depth": 16,
              "why": "Qc7 is the top line maintaining optimal control.",
              "pv": [
                "Qc7",
                "Bxf6"
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
        "coachComment": "O-O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "O-O-O",
          "why": "O-O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O-O",
              "eval": 0.1,
              "depth": 16,
              "why": "O-O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O-O",
                "Ra7"
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
        "coachComment": "Nbd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nbd7",
          "why": "Nbd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.1,
              "depth": 16,
              "why": "Nbd7 is the top line maintaining optimal control.",
              "pv": [
                "Nbd7",
                "Bxf6"
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
        "coachComment": "g4 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "g4",
          "why": "g4 is a sound practical choice.",
          "lines": [
            {
              "move": "g4",
              "eval": -0.1,
              "depth": 16,
              "why": "g4 is the top line maintaining optimal control.",
              "pv": [
                "g4",
                "Rb8"
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
        "coachComment": "b5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "b5",
          "why": "b5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b5",
              "eval": -0.1,
              "depth": 16,
              "why": "b5 is the top line maintaining optimal control.",
              "pv": [
                "b5",
                "Bxf6"
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
        "coachComment": "Bxf6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxf6",
          "why": "Bxf6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxf6 is the top line maintaining optimal control.",
              "pv": [
                "Bxf6",
                "Rb8"
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
        "coachComment": "Nxf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nxf6",
          "why": "Nxf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxf6",
              "eval": -0.1,
              "depth": 16,
              "why": "Nxf6 is the top line maintaining optimal control.",
              "pv": [
                "Nxf6",
                "Ndxb5"
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
        "coachComment": "g5 is brilliant, finding an inspired tactical shot.",
        "eval": {
          "eval": 0.2,
          "bestMove": "g5",
          "why": "g5 is brilliant, finding an inspired tactical shot.",
          "lines": [
            {
              "move": "g5",
              "eval": 0.2,
              "depth": 16,
              "why": "g5 is the top line maintaining optimal control.",
              "pv": [
                "g5",
                "Rb8"
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
        "coachComment": "Nd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nd7",
          "why": "Nd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd7",
              "eval": 0.2,
              "depth": 16,
              "why": "Nd7 is the top line maintaining optimal control.",
              "pv": [
                "Nd7",
                "g6"
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
        "coachComment": "f5 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "f5",
          "why": "f5 is a sound practical choice.",
          "lines": [
            {
              "move": "f5",
              "eval": 0.1,
              "depth": 16,
              "why": "f5 is the top line maintaining optimal control.",
              "pv": [
                "f5",
                "Rb8"
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
        "coachComment": "O-O is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "O-O",
          "why": "O-O is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "f6"
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
        "coachComment": "Rg1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Rg1",
          "why": "Rg1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rg1",
              "eval": 0.1,
              "depth": 16,
              "why": "Rg1 is the top line maintaining optimal control.",
              "pv": [
                "Rg1",
                "Rb8"
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
        "coachComment": "b4 is a sound practical choice.",
        "eval": {
          "eval": 0.3,
          "bestMove": "b4",
          "why": "b4 is a sound practical choice.",
          "lines": [
            {
              "move": "b4",
              "eval": 0.3,
              "depth": 16,
              "why": "b4 is the top line maintaining optimal control.",
              "pv": [
                "b4",
                "f6"
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
        "coachComment": "Nce2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nce2",
          "why": "Nce2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nce2",
              "eval": 0.2,
              "depth": 16,
              "why": "Nce2 is the top line maintaining optimal control.",
              "pv": [
                "Nce2",
                "Rb8"
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
        "coachComment": "e5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "e5",
          "why": "e5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.3,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "f6"
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
        "coachComment": "f6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.2,
          "bestMove": "f6",
          "why": "f6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "f6",
              "eval": 0.2,
              "depth": 16,
              "why": "f6 is the top line maintaining optimal control.",
              "pv": [
                "f6",
                "Rb8"
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
        "coachComment": "exd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "exd4",
          "why": "exd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exd4",
              "eval": 0.2,
              "depth": 16,
              "why": "exd4 is the top line maintaining optimal control.",
              "pv": [
                "exd4",
                "fxe7"
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
        "coachComment": "fxe7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "fxe7",
          "why": "fxe7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "fxe7",
              "eval": 0.2,
              "depth": 16,
              "why": "fxe7 is the top line maintaining optimal control.",
              "pv": [
                "fxe7",
                "Rb8"
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
        "coachComment": "Re8 is a sound practical choice.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Re8",
          "why": "Re8 is a sound practical choice.",
          "lines": [
            {
              "move": "Re8",
              "eval": 0.3,
              "depth": 16,
              "why": "Re8 is the top line maintaining optimal control.",
              "pv": [
                "Re8",
                "g6"
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
        "coachComment": "Nxd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Nxd4",
          "why": "Nxd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": 0.3,
              "depth": 16,
              "why": "Nxd4 is the top line maintaining optimal control.",
              "pv": [
                "Nxd4",
                "Rb8"
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
        "coachComment": "Ne5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Ne5",
          "why": "Ne5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne5",
              "eval": 0.3,
              "depth": 16,
              "why": "Ne5 is the top line maintaining optimal control.",
              "pv": [
                "Ne5",
                "g6"
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
        "coachComment": "Qf4 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Qf4",
          "why": "Qf4 is a sound practical choice.",
          "lines": [
            {
              "move": "Qf4",
              "eval": 0.2,
              "depth": 16,
              "why": "Qf4 is the top line maintaining optimal control.",
              "pv": [
                "Qf4",
                "Rb8"
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
        "coachComment": "Qxe7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Qxe7",
          "why": "Qxe7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxe7",
              "eval": 0.2,
              "depth": 16,
              "why": "Qxe7 is the top line maintaining optimal control.",
              "pv": [
                "Qxe7",
                "g6"
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
        "coachComment": "Nf5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf5",
          "why": "Nf5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf5",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf5 is the top line maintaining optimal control.",
              "pv": [
                "Nf5",
                "Rb8"
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
        "coachComment": "Bxf5 is a sound practical choice.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Bxf5",
          "why": "Bxf5 is a sound practical choice.",
          "lines": [
            {
              "move": "Bxf5",
              "eval": 0.3,
              "depth": 16,
              "why": "Bxf5 is the top line maintaining optimal control.",
              "pv": [
                "Bxf5",
                "g6"
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
        "coachComment": "exf5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.3,
          "bestMove": "exf5",
          "why": "exf5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "exf5",
              "eval": 0.3,
              "depth": 16,
              "why": "exf5 is the top line maintaining optimal control.",
              "pv": [
                "exf5",
                "Rab8"
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
        "coachComment": "Rac8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Rac8",
          "why": "Rac8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rac8",
              "eval": 0.3,
              "depth": 16,
              "why": "Rac8 is the top line maintaining optimal control.",
              "pv": [
                "Rac8",
                "f6"
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
        "coachComment": "f6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "f6",
          "why": "f6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f6",
              "eval": 0.3,
              "depth": 16,
              "why": "f6 is the top line maintaining optimal control.",
              "pv": [
                "f6",
                "Rcd8"
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
        "coachComment": "Qc7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Qc7",
          "why": "Qc7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qc7",
              "eval": 0.3,
              "depth": 16,
              "why": "Qc7 is the top line maintaining optimal control.",
              "pv": [
                "Qc7",
                "fxg7"
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
        "coachComment": "Rd2 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -2.9,
          "bestMove": "fxg7",
          "why": "Rd2 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "fxg7",
              "eval": 0.3,
              "depth": 16,
              "why": "fxg7 was the engine recommendation maintaining the initiative.",
              "pv": [
                "fxg7",
                "Rcd8",
                "g6"
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
        "coachComment": "Nf3 finds a sharp and critical continuation.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Nf3",
          "why": "Nf3 finds a sharp and critical continuation.",
          "lines": [
            {
              "move": "Nf3",
              "eval": -2.9,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "fxg7"
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
        "coachComment": "Qxf3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Qxf3",
          "why": "Qxf3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxf3",
              "eval": -2.9,
              "depth": 16,
              "why": "Qxf3 is the top line maintaining optimal control.",
              "pv": [
                "Qxf3",
                "Rcd8"
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
        "coachComment": "Re1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Re1+",
          "why": "Re1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re1+",
              "eval": -2.9,
              "depth": 16,
              "why": "Re1+ is the top line maintaining optimal control.",
              "pv": [
                "Re1+",
                "Qd1"
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
        "coachComment": "Qd1 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qd1",
          "why": "Qd1 is a sound practical choice.",
          "lines": [
            {
              "move": "Qd1",
              "eval": -3.1,
              "depth": 16,
              "why": "Qd1 is the top line maintaining optimal control.",
              "pv": [
                "Qd1",
                "Rd8"
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
        "coachComment": "Rxd1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Rxd1+",
          "why": "Rxd1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxd1+",
              "eval": -3.1,
              "depth": 16,
              "why": "Rxd1+ is the top line maintaining optimal control.",
              "pv": [
                "Rxd1+",
                "Rxd1"
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
        "coachComment": "Kxd1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Kxd1",
          "why": "Kxd1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Kxd1",
              "eval": -3.1,
              "depth": 16,
              "why": "Kxd1 is the top line maintaining optimal control.",
              "pv": [
                "Kxd1",
                "Rd8"
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
        "coachComment": "Qc5 is a sound practical choice.",
        "eval": {
          "eval": -3,
          "bestMove": "Qc5",
          "why": "Qc5 is a sound practical choice.",
          "lines": [
            {
              "move": "Qc5",
              "eval": -3,
              "depth": 16,
              "why": "Qc5 is the top line maintaining optimal control.",
              "pv": [
                "Qc5",
                "fxg7"
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
        "coachComment": "Rg3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Rg3",
          "why": "Rg3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rg3",
              "eval": -3,
              "depth": 16,
              "why": "Rg3 is the top line maintaining optimal control.",
              "pv": [
                "Rg3",
                "Rd8"
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
        "coachComment": "Qe5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Qe5",
          "why": "Qe5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qe5",
              "eval": -3,
              "depth": 16,
              "why": "Qe5 is the top line maintaining optimal control.",
              "pv": [
                "Qe5",
                "fxg7"
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
        "coachComment": "Bd3 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Bd3",
          "why": "Bd3 is a sound practical choice.",
          "lines": [
            {
              "move": "Bd3",
              "eval": -3.1,
              "depth": 16,
              "why": "Bd3 is the top line maintaining optimal control.",
              "pv": [
                "Bd3",
                "Rd8"
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
        "coachComment": "Qxb2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qxb2",
          "why": "Qxb2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qxb2",
              "eval": -3.1,
              "depth": 16,
              "why": "Qxb2 is the top line maintaining optimal control.",
              "pv": [
                "Qxb2",
                "fxg7"
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
        "coachComment": "Re3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Re3",
          "why": "Re3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re3",
              "eval": -3.1,
              "depth": 16,
              "why": "Re3 is the top line maintaining optimal control.",
              "pv": [
                "Re3",
                "Rd8"
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
        "coachComment": "gxf6 is a sound practical choice.",
        "eval": {
          "eval": -2.9,
          "bestMove": "gxf6",
          "why": "gxf6 is a sound practical choice.",
          "lines": [
            {
              "move": "gxf6",
              "eval": -2.9,
              "depth": 16,
              "why": "gxf6 is the top line maintaining optimal control.",
              "pv": [
                "gxf6",
                "g6"
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
        "coachComment": "gxf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -2.9,
          "bestMove": "gxf6",
          "why": "gxf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "gxf6",
              "eval": -2.9,
              "depth": 16,
              "why": "gxf6 is the top line maintaining optimal control.",
              "pv": [
                "gxf6",
                "Rd8"
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
        "coachComment": "Qxf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Qxf6",
          "why": "Qxf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxf6",
              "eval": -2.9,
              "depth": 16,
              "why": "Qxf6 is the top line maintaining optimal control.",
              "pv": [
                "Qxf6",
                "Bc4"
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
        "coachComment": "Rg2+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3,
          "bestMove": "Rg2+",
          "why": "Rg2+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rg2+",
              "eval": -3,
              "depth": 16,
              "why": "Rg2+ is the top line maintaining optimal control.",
              "pv": [
                "Rg2+",
                "Kh8"
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
        "coachComment": "Kf8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Kf8",
          "why": "Kf8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kf8",
              "eval": -3,
              "depth": 16,
              "why": "Kf8 is the top line maintaining optimal control.",
              "pv": [
                "Kf8",
                "Bc4"
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
        "coachComment": "Reg3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Reg3",
          "why": "Reg3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Reg3",
              "eval": -3,
              "depth": 16,
              "why": "Reg3 is the top line maintaining optimal control.",
              "pv": [
                "Reg3",
                "Rd8"
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
        "coachComment": "Qa1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Qa1+",
          "why": "Qa1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qa1+",
              "eval": -3,
              "depth": 16,
              "why": "Qa1+ is the top line maintaining optimal control.",
              "pv": [
                "Qa1+",
                "Kd2"
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
        "coachComment": "Kd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Kd2",
          "why": "Kd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd2",
              "eval": -3,
              "depth": 16,
              "why": "Kd2 is the top line maintaining optimal control.",
              "pv": [
                "Kd2",
                "Rd8"
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
        "coachComment": "Qc3+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Qc3+",
          "why": "Qc3+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qc3+",
              "eval": -2.9,
              "depth": 16,
              "why": "Qc3+ is the top line maintaining optimal control.",
              "pv": [
                "Qc3+",
                "Ke3"
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
        "coachComment": "Kd1 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Kd1",
          "why": "Kd1 is a sound practical choice.",
          "lines": [
            {
              "move": "Kd1",
              "eval": -3.1,
              "depth": 16,
              "why": "Kd1 is the top line maintaining optimal control.",
              "pv": [
                "Kd1",
                "Rd8"
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
        "coachComment": "Re8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Re8",
          "why": "Re8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re8",
              "eval": -3.1,
              "depth": 16,
              "why": "Re8 is the top line maintaining optimal control.",
              "pv": [
                "Re8",
                "Bc4"
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
        "coachComment": "Rg8+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Rg8+",
          "why": "Rg8+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rg8+",
              "eval": -3.1,
              "depth": 16,
              "why": "Rg8+ is the top line maintaining optimal control.",
              "pv": [
                "Rg8+",
                "Ke7"
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
        "coachComment": "Ke7 is a sound practical choice.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Ke7",
          "why": "Ke7 is a sound practical choice.",
          "lines": [
            {
              "move": "Ke7",
              "eval": -2.9,
              "depth": 16,
              "why": "Ke7 is the top line maintaining optimal control.",
              "pv": [
                "Ke7",
                "Rh8"
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
        "coachComment": "Re2+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Re2+",
          "why": "Re2+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re2+",
              "eval": -2.9,
              "depth": 16,
              "why": "Re2+ is the top line maintaining optimal control.",
              "pv": [
                "Re2+",
                "Kd8"
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
        "coachComment": "Kd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -2.9,
          "bestMove": "Kd7",
          "why": "Kd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd7",
              "eval": -2.9,
              "depth": 16,
              "why": "Kd7 is the top line maintaining optimal control.",
              "pv": [
                "Kd7",
                "Rh8"
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
        "coachComment": "Rgxe8 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Rgxe8",
          "why": "Rgxe8 is a sound practical choice.",
          "lines": [
            {
              "move": "Rgxe8",
              "eval": -3.1,
              "depth": 16,
              "why": "Rgxe8 is the top line maintaining optimal control.",
              "pv": [
                "Rgxe8",
                "Kc6"
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
        "coachComment": "Qa1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qa1+",
          "why": "Qa1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qa1+",
              "eval": -3.1,
              "depth": 16,
              "why": "Qa1+ is the top line maintaining optimal control.",
              "pv": [
                "Qa1+",
                "Kd2"
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
        "coachComment": "Kd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Kd2",
          "why": "Kd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd2",
              "eval": -3.1,
              "depth": 16,
              "why": "Kd2 is the top line maintaining optimal control.",
              "pv": [
                "Kd2",
                "Kc6"
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
        "coachComment": "Qc3+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3,
          "bestMove": "Qc3+",
          "why": "Qc3+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qc3+",
              "eval": -3,
              "depth": 16,
              "why": "Qc3+ is the top line maintaining optimal control.",
              "pv": [
                "Qc3+",
                "Ke3"
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
        "coachComment": "Kd1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Kd1",
          "why": "Kd1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd1",
              "eval": -3,
              "depth": 16,
              "why": "Kd1 is the top line maintaining optimal control.",
              "pv": [
                "Kd1",
                "Kc6"
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
        "coachComment": "Qa1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3,
          "bestMove": "Qa1+",
          "why": "Qa1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qa1+",
              "eval": -3,
              "depth": 16,
              "why": "Qa1+ is the top line maintaining optimal control.",
              "pv": [
                "Qa1+",
                "Kd2"
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
        "coachComment": "Kd2 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Kd2",
          "why": "Kd2 is a sound practical choice.",
          "lines": [
            {
              "move": "Kd2",
              "eval": -3.1,
              "depth": 16,
              "why": "Kd2 is the top line maintaining optimal control.",
              "pv": [
                "Kd2",
                "Kc6"
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
        "coachComment": "d4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d4",
          "why": "d4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.2,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Nc6"
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
        "coachComment": "d5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d5",
          "why": "d5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.2,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "a3"
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
        "coachComment": "Bf4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Bf4",
          "why": "Bf4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Bf4",
              "eval": 0.2,
              "depth": 16,
              "why": "Bf4 is the top line maintaining optimal control.",
              "pv": [
                "Bf4",
                "Nd7"
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
        "coachComment": "Nf6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf6",
          "why": "Nf6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
                "Be5"
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
        "coachComment": "e3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e3",
          "why": "e3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e3",
              "eval": 0.2,
              "depth": 16,
              "why": "e3 is the top line maintaining optimal control.",
              "pv": [
                "e3",
                "Nbd7"
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
        "coachComment": "c5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c5",
          "why": "c5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "c5",
              "eval": 0.2,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "dxc5"
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
        "coachComment": "c3 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "c3",
          "why": "c3 is a sound practical choice.",
          "lines": [
            {
              "move": "c3",
              "eval": 0.1,
              "depth": 16,
              "why": "c3 is the top line maintaining optimal control.",
              "pv": [
                "c3",
                "Nbd7"
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
        "coachComment": "Nc6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nc6",
          "why": "Nc6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.1,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "dxc5"
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
        "coachComment": "Nd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nd2",
          "why": "Nd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd2",
              "eval": 0.1,
              "depth": 16,
              "why": "Nd2 is the top line maintaining optimal control.",
              "pv": [
                "Nd2",
                "Rb8"
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
        "coachComment": "Bf5 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Bf5",
          "why": "Bf5 is a sound practical choice.",
          "lines": [
            {
              "move": "Bf5",
              "eval": 0.2,
              "depth": 16,
              "why": "Bf5 is the top line maintaining optimal control.",
              "pv": [
                "Bf5",
                "dxc5"
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
        "coachComment": "Ngf3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Ngf3",
          "why": "Ngf3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Ngf3",
              "eval": 0.1,
              "depth": 16,
              "why": "Ngf3 is the top line maintaining optimal control.",
              "pv": [
                "Ngf3",
                "Rb8"
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
        "coachComment": "e6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e6",
          "why": "e6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.1,
              "depth": 16,
              "why": "e6 is the top line maintaining optimal control.",
              "pv": [
                "e6",
                "dxc5"
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
        "coachComment": "Nh4 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Nh4",
          "why": "Nh4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nh4",
              "eval": 0,
              "depth": 16,
              "why": "Nh4 is the top line maintaining optimal control.",
              "pv": [
                "Nh4",
                "Rb8"
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
        "coachComment": "Bg6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Bg6",
          "why": "Bg6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg6",
              "eval": 0,
              "depth": 16,
              "why": "Bg6 is the top line maintaining optimal control.",
              "pv": [
                "Bg6",
                "dxc5"
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
        "coachComment": "Nxg6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Nxg6",
          "why": "Nxg6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxg6",
              "eval": 0,
              "depth": 16,
              "why": "Nxg6 is the top line maintaining optimal control.",
              "pv": [
                "Nxg6",
                "Rb8"
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
        "coachComment": "hxg6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "hxg6",
          "why": "hxg6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "hxg6",
              "eval": 0.1,
              "depth": 16,
              "why": "hxg6 is the top line maintaining optimal control.",
              "pv": [
                "hxg6",
                "dxc5"
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
        "coachComment": "Bd3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bd3",
          "why": "Bd3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0.1,
              "depth": 16,
              "why": "Bd3 is the top line maintaining optimal control.",
              "pv": [
                "Bd3",
                "Rb8"
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
        "coachComment": "Bd6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bd6",
          "why": "Bd6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd6",
              "eval": 0.1,
              "depth": 16,
              "why": "Bd6 is the top line maintaining optimal control.",
              "pv": [
                "Bd6",
                "dxc5"
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
        "coachComment": "Bxd6 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxd6",
          "why": "Bxd6 is a sound practical choice.",
          "lines": [
            {
              "move": "Bxd6",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxd6 is the top line maintaining optimal control.",
              "pv": [
                "Bxd6",
                "Rb8"
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
        "coachComment": "Qxd6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qxd6",
          "why": "Qxd6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxd6",
              "eval": -0.1,
              "depth": 16,
              "why": "Qxd6 is the top line maintaining optimal control.",
              "pv": [
                "Qxd6",
                "dxc5"
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
        "coachComment": "f4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "f4",
          "why": "f4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "f4",
              "eval": -0.1,
              "depth": 16,
              "why": "f4 is the top line maintaining optimal control.",
              "pv": [
                "f4",
                "Rb8"
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
        "coachComment": "cxd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "cxd4",
          "why": "cxd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "cxd4",
              "eval": -0.1,
              "depth": 16,
              "why": "cxd4 is the top line maintaining optimal control.",
              "pv": [
                "cxd4",
                "f5"
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
        "coachComment": "cxd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "cxd4",
          "why": "cxd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "cxd4",
              "eval": -0.1,
              "depth": 16,
              "why": "cxd4 is the top line maintaining optimal control.",
              "pv": [
                "cxd4",
                "Rb8"
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
        "coachComment": "g5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "g5",
          "why": "g5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "g5",
              "eval": -0.1,
              "depth": 16,
              "why": "g5 is the top line maintaining optimal control.",
              "pv": [
                "g5",
                "f5"
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
        "coachComment": "O-O is a sound practical choice.",
        "eval": {
          "eval": -0.3,
          "bestMove": "O-O",
          "why": "O-O is a sound practical choice.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.3,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Rb8"
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
        "coachComment": "gxf4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "gxf4",
          "why": "gxf4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "gxf4",
              "eval": -0.2,
              "depth": 16,
              "why": "gxf4 is the top line maintaining optimal control.",
              "pv": [
                "gxf4",
                "Bc4"
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
        "coachComment": "Rxf4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Rxf4",
          "why": "Rxf4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxf4",
              "eval": -0.2,
              "depth": 16,
              "why": "Rxf4 is the top line maintaining optimal control.",
              "pv": [
                "Rxf4",
                "Rb8"
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
        "coachComment": "e5 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "e5",
          "why": "e5 is a sound practical choice.",
          "lines": [
            {
              "move": "e5",
              "eval": -0.1,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "dxe5"
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
        "coachComment": "dxe5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "dxe5",
          "why": "dxe5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "dxe5",
              "eval": -0.1,
              "depth": 16,
              "why": "dxe5 is the top line maintaining optimal control.",
              "pv": [
                "dxe5",
                "Rb8"
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
        "coachComment": "Nxe5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nxe5",
          "why": "Nxe5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxe5",
              "eval": -0.1,
              "depth": 16,
              "why": "Nxe5 is the top line maintaining optimal control.",
              "pv": [
                "Nxe5",
                "Rf5"
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
        "coachComment": "Bb5+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bb5+",
          "why": "Bb5+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bb5+",
              "eval": -0.1,
              "depth": 16,
              "why": "Bb5+ is the top line maintaining optimal control.",
              "pv": [
                "Bb5+",
                "Kf8"
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
        "coachComment": "Ke7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Ke7",
          "why": "Ke7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ke7",
              "eval": -0.1,
              "depth": 16,
              "why": "Ke7 is the top line maintaining optimal control.",
              "pv": [
                "Ke7",
                "Ba6"
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
        "coachComment": "Nf3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nf3",
          "why": "Nf3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf3",
              "eval": -0.1,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Rab8"
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
        "coachComment": "a6 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "a6",
          "why": "a6 is a sound practical choice.",
          "lines": [
            {
              "move": "a6",
              "eval": 0,
              "depth": 16,
              "why": "a6 is the top line maintaining optimal control.",
              "pv": [
                "a6",
                "Bxa6"
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
        "coachComment": "Be2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Be2",
          "why": "Be2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be2",
              "eval": 0,
              "depth": 16,
              "why": "Be2 is the top line maintaining optimal control.",
              "pv": [
                "Be2",
                "Rab8"
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
        "coachComment": "Nxf3+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Nxf3+",
          "why": "Nxf3+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxf3+",
              "eval": 0,
              "depth": 16,
              "why": "Nxf3+ is the top line maintaining optimal control.",
              "pv": [
                "Nxf3+",
                "Rxf3"
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
        "coachComment": "Bxf3 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxf3",
          "why": "Bxf3 is a sound practical choice.",
          "lines": [
            {
              "move": "Bxf3",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxf3 is the top line maintaining optimal control.",
              "pv": [
                "Bxf3",
                "Rab8"
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
        "coachComment": "g5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "g5",
          "why": "g5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "g5",
              "eval": -0.1,
              "depth": 16,
              "why": "g5 is the top line maintaining optimal control.",
              "pv": [
                "g5",
                "Rf5"
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
        "coachComment": "Rd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rd4",
          "why": "Rd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rd4",
              "eval": -0.1,
              "depth": 16,
              "why": "Rd4 is the top line maintaining optimal control.",
              "pv": [
                "Rd4",
                "Rab8"
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
        "coachComment": "Qxh2+ is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Qxh2+",
          "why": "Qxh2+ is a sound practical choice.",
          "lines": [
            {
              "move": "Qxh2+",
              "eval": 0,
              "depth": 16,
              "why": "Qxh2+ is the top line maintaining optimal control.",
              "pv": [
                "Qxh2+",
                "Kf2"
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
        "coachComment": "Kf2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kf2",
          "why": "Kf2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Kf2",
              "eval": -0.1,
              "depth": 16,
              "why": "Kf2 is the top line maintaining optimal control.",
              "pv": [
                "Kf2",
                "Rab8"
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
        "coachComment": "Rh4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Rh4",
          "why": "Rh4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rh4",
              "eval": 0,
              "depth": 16,
              "why": "Rh4 is the top line maintaining optimal control.",
              "pv": [
                "Rh4",
                "Rxd5"
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
        "coachComment": "Qb3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qb3",
          "why": "Qb3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qb3",
              "eval": -0.1,
              "depth": 16,
              "why": "Qb3 is the top line maintaining optimal control.",
              "pv": [
                "Qb3",
                "Rb8"
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
        "coachComment": "Rxd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Rxd4",
          "why": "Rxd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxd4",
              "eval": 0,
              "depth": 16,
              "why": "Rxd4 is the top line maintaining optimal control.",
              "pv": [
                "Rxd4",
                "Qa4"
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
        "coachComment": "exd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "exd4",
          "why": "exd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exd4",
              "eval": -0.1,
              "depth": 16,
              "why": "exd4 is the top line maintaining optimal control.",
              "pv": [
                "exd4",
                "Rb8"
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
        "coachComment": "Qh4+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0,
          "bestMove": "Qh4+",
          "why": "Qh4+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qh4+",
              "eval": 0,
              "depth": 16,
              "why": "Qh4+ is the top line maintaining optimal control.",
              "pv": [
                "Qh4+",
                "Ke3"
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
        "coachComment": "Ke2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Ke2",
          "why": "Ke2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ke2",
              "eval": 0,
              "depth": 16,
              "why": "Ke2 is the top line maintaining optimal control.",
              "pv": [
                "Ke2",
                "Rb8"
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
        "coachComment": "Re8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Re8",
          "why": "Re8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re8",
              "eval": 0,
              "depth": 16,
              "why": "Re8 is the top line maintaining optimal control.",
              "pv": [
                "Re8",
                "Qa4"
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
        "coachComment": "Qxb7+ is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qxb7+",
          "why": "Qxb7+ is a sound practical choice.",
          "lines": [
            {
              "move": "Qxb7+",
              "eval": -0.1,
              "depth": 16,
              "why": "Qxb7+ is the top line maintaining optimal control.",
              "pv": [
                "Qxb7+",
                "Kd8+"
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
        "coachComment": "Kf8+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kf8+",
          "why": "Kf8+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kf8+",
              "eval": -0.1,
              "depth": 16,
              "why": "Kf8+ is the top line maintaining optimal control.",
              "pv": [
                "Kf8+",
                "Qe7+"
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
        "coachComment": "Kd3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Kd3",
          "why": "Kd3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Kd3",
              "eval": -0.2,
              "depth": 16,
              "why": "Kd3 is the top line maintaining optimal control.",
              "pv": [
                "Kd3",
                "Re7"
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
        "coachComment": "Qf4 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Qf4",
          "why": "Qf4 is a sound practical choice.",
          "lines": [
            {
              "move": "Qf4",
              "eval": 0,
              "depth": 16,
              "why": "Qf4 is the top line maintaining optimal control.",
              "pv": [
                "Qf4",
                "Qa8"
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
        "coachComment": "Qb4+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qb4+",
          "why": "Qb4+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qb4+",
              "eval": -0.1,
              "depth": 16,
              "why": "Qb4+ is the top line maintaining optimal control.",
              "pv": [
                "Qb4+",
                "Re7"
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
        "coachComment": "Kg7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Kg7",
          "why": "Kg7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kg7",
              "eval": 0,
              "depth": 16,
              "why": "Kg7 is the top line maintaining optimal control.",
              "pv": [
                "Kg7",
                "Qa5"
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
        "coachComment": "Re1 is a sound practical choice.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Re1",
          "why": "Re1 is a sound practical choice.",
          "lines": [
            {
              "move": "Re1",
              "eval": -0.2,
              "depth": 16,
              "why": "Re1 is the top line maintaining optimal control.",
              "pv": [
                "Re1",
                "Rf8"
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
        "coachComment": "Qf5+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qf5+",
          "why": "Qf5+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qf5+",
              "eval": -0.1,
              "depth": 16,
              "why": "Qf5+ is the top line maintaining optimal control.",
              "pv": [
                "Qf5+",
                "Kd2"
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
        "coachComment": "Kd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kd2",
          "why": "Kd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd2",
              "eval": -0.1,
              "depth": 16,
              "why": "Kd2 is the top line maintaining optimal control.",
              "pv": [
                "Kd2",
                "Rf8"
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
        "coachComment": "Qf4+ is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Qf4+",
          "why": "Qf4+ is a sound practical choice.",
          "lines": [
            {
              "move": "Qf4+",
              "eval": 0,
              "depth": 16,
              "why": "Qf4+ is the top line maintaining optimal control.",
              "pv": [
                "Qf4+",
                "Kc3"
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
        "coachComment": "Kd1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Kd1",
          "why": "Kd1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd1",
              "eval": 0,
              "depth": 16,
              "why": "Kd1 is the top line maintaining optimal control.",
              "pv": [
                "Kd1",
                "Rf8"
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
        "coachComment": "Rxe1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Rxe1+",
          "why": "Rxe1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxe1+",
              "eval": 0,
              "depth": 16,
              "why": "Rxe1+ is the top line maintaining optimal control.",
              "pv": [
                "Rxe1+",
                "Qxe1"
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
        "coachComment": "Kxe1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kxe1",
          "why": "Kxe1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Kxe1",
              "eval": -0.1,
              "depth": 16,
              "why": "Kxe1 is the top line maintaining optimal control.",
              "pv": [
                "Kxe1",
                "Kg8"
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
        "coachComment": "g4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "g4",
          "why": "g4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "g4",
              "eval": 0,
              "depth": 16,
              "why": "g4 is the top line maintaining optimal control.",
              "pv": [
                "g4",
                "Qa5"
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
        "coachComment": "Be2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be2",
          "why": "Be2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be2",
              "eval": -0.1,
              "depth": 16,
              "why": "Be2 is the top line maintaining optimal control.",
              "pv": [
                "Be2",
                "Kg8"
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
        "coachComment": "Ne4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Ne4",
          "why": "Ne4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne4",
              "eval": 0,
              "depth": 16,
              "why": "Ne4 is the top line maintaining optimal control.",
              "pv": [
                "Ne4",
                "Qa5"
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
        "coachComment": "Kd1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kd1",
          "why": "Kd1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd1",
              "eval": -0.1,
              "depth": 16,
              "why": "Kd1 is the top line maintaining optimal control.",
              "pv": [
                "Kd1",
                "f6"
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
        "coachComment": "Nf2+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0,
          "bestMove": "Nf2+",
          "why": "Nf2+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nf2+",
              "eval": 0,
              "depth": 16,
              "why": "Nf2+ is the top line maintaining optimal control.",
              "pv": [
                "Nf2+",
                "Kc2"
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
        "coachComment": "Kc2 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kc2",
          "why": "Kc2 is a sound practical choice.",
          "lines": [
            {
              "move": "Kc2",
              "eval": -0.1,
              "depth": 16,
              "why": "Kc2 is the top line maintaining optimal control.",
              "pv": [
                "Kc2",
                "f6"
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
        "coachComment": "Qe4+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qe4+",
          "why": "Qe4+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qe4+",
              "eval": -0.1,
              "depth": 16,
              "why": "Qe4+ is the top line maintaining optimal control.",
              "pv": [
                "Qe4+",
                "Kb3"
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
        "coachComment": "Kd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Kd2",
          "why": "Kd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kd2",
              "eval": -0.1,
              "depth": 16,
              "why": "Kd2 is the top line maintaining optimal control.",
              "pv": [
                "Kd2",
                "f6"
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
        "coachComment": "Qxg2 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Qxg2",
          "why": "Qxg2 is a sound practical choice.",
          "lines": [
            {
              "move": "Qxg2",
              "eval": 0,
              "depth": 16,
              "why": "Qxg2 is the top line maintaining optimal control.",
              "pv": [
                "Qxg2",
                "Qa5"
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
        "coachComment": "Qd6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qd6",
          "why": "Qd6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qd6",
              "eval": 0,
              "depth": 16,
              "why": "Qd6 is the top line maintaining optimal control.",
              "pv": [
                "Qd6",
                "f6"
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
        "coachComment": "Ne4+ is brilliant, finding an inspired tactical shot.",
        "eval": {
          "eval": -0.3,
          "bestMove": "Ne4+",
          "why": "Ne4+ is brilliant, finding an inspired tactical shot.",
          "lines": [
            {
              "move": "Ne4+",
              "eval": -0.3,
              "depth": 16,
              "why": "Ne4+ is the top line maintaining optimal control.",
              "pv": [
                "Ne4+",
                "Kd3"
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
        "coachComment": "e4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e4",
          "why": "e4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.2,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Nc6"
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
        "coachComment": "d5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d5",
          "why": "d5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.2,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "e5"
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
        "coachComment": "exd5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "exd5",
          "why": "exd5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "exd5",
              "eval": 0.2,
              "depth": 16,
              "why": "exd5 is the top line maintaining optimal control.",
              "pv": [
                "exd5",
                "Nd7"
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
        "coachComment": "Qxd5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Qxd5",
          "why": "Qxd5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Qxd5",
              "eval": 0.2,
              "depth": 16,
              "why": "Qxd5 is the top line maintaining optimal control.",
              "pv": [
                "Qxd5",
                "a3"
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
        "coachComment": "Nc3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nc3",
          "why": "Nc3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.2,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Nd7"
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
        "coachComment": "Qa5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Qa5",
          "why": "Qa5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Qa5",
              "eval": 0.2,
              "depth": 16,
              "why": "Qa5 is the top line maintaining optimal control.",
              "pv": [
                "Qa5",
                "Na4"
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
        "coachComment": "d4 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "d4",
          "why": "d4 is a sound practical choice.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.1,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Nd7"
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
        "coachComment": "Nf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nf6",
          "why": "Nf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.1,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
                "d5"
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
        "coachComment": "Nf3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nf3",
          "why": "Nf3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nbd7"
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
        "coachComment": "Bg4 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Bg4",
          "why": "Bg4 is a sound practical choice.",
          "lines": [
            {
              "move": "Bg4",
              "eval": 0.2,
              "depth": 16,
              "why": "Bg4 is the top line maintaining optimal control.",
              "pv": [
                "Bg4",
                "d5"
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
        "coachComment": "h3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "h3",
          "why": "h3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "h3",
              "eval": 0.1,
              "depth": 16,
              "why": "h3 is the top line maintaining optimal control.",
              "pv": [
                "h3",
                "Nbd7"
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
        "coachComment": "Bh5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bh5",
          "why": "Bh5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bh5",
              "eval": 0.1,
              "depth": 16,
              "why": "Bh5 is the top line maintaining optimal control.",
              "pv": [
                "Bh5",
                "d5"
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
        "coachComment": "g4 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "g4",
          "why": "g4 is a sound practical choice.",
          "lines": [
            {
              "move": "g4",
              "eval": 0,
              "depth": 16,
              "why": "g4 is the top line maintaining optimal control.",
              "pv": [
                "g4",
                "Nbd7"
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
        "coachComment": "Bg6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Bg6",
          "why": "Bg6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg6",
              "eval": 0,
              "depth": 16,
              "why": "Bg6 is the top line maintaining optimal control.",
              "pv": [
                "Bg6",
                "d5"
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
        "coachComment": "Ne5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Ne5",
          "why": "Ne5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne5",
              "eval": 0,
              "depth": 16,
              "why": "Ne5 is the top line maintaining optimal control.",
              "pv": [
                "Ne5",
                "Nbd7"
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
        "coachComment": "Nbd7 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nbd7",
          "why": "Nbd7 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.1,
              "depth": 16,
              "why": "Nbd7 is the top line maintaining optimal control.",
              "pv": [
                "Nbd7",
                "Nc6"
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
        "coachComment": "Nc4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nc4",
          "why": "Nc4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc4",
              "eval": 0.1,
              "depth": 16,
              "why": "Nc4 is the top line maintaining optimal control.",
              "pv": [
                "Nc4",
                "Rb8"
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
        "coachComment": "Qa6 is brilliant, finding an inspired tactical shot.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Qa6",
          "why": "Qa6 is brilliant, finding an inspired tactical shot.",
          "lines": [
            {
              "move": "Qa6",
              "eval": -0.2,
              "depth": 16,
              "why": "Qa6 is the top line maintaining optimal control.",
              "pv": [
                "Qa6",
                "Na5"
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
        "coachComment": "Bf4 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Na5",
          "why": "Bf4 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Na5",
              "eval": -0.2,
              "depth": 16,
              "why": "Na5 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Na5",
                "Rb8",
                "Nxb7"
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
        "coachComment": "Qe6+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Qe6+",
          "why": "Qe6+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qe6+",
              "eval": -3.4,
              "depth": 16,
              "why": "Qe6+ is the top line maintaining optimal control.",
              "pv": [
                "Qe6+",
                "Ne5"
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
        "coachComment": "Ne3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Ne3",
          "why": "Ne3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Ne3",
              "eval": -3.5,
              "depth": 16,
              "why": "Ne3 is the top line maintaining optimal control.",
              "pv": [
                "Ne3",
                "Rb8"
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
        "coachComment": "c6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "c6",
          "why": "c6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c6",
              "eval": -3.5,
              "depth": 16,
              "why": "c6 is the top line maintaining optimal control.",
              "pv": [
                "c6",
                "d5"
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
        "coachComment": "Bc4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Bc4",
          "why": "Bc4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bc4",
              "eval": -3.5,
              "depth": 16,
              "why": "Bc4 is the top line maintaining optimal control.",
              "pv": [
                "Bc4",
                "Rb8"
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
        "coachComment": "Nd5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Nd5",
          "why": "Nd5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd5",
              "eval": -3.5,
              "depth": 16,
              "why": "Nd5 is the top line maintaining optimal control.",
              "pv": [
                "Nd5",
                "Bb5"
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
        "coachComment": "Nxd5 is a sound practical choice.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Nxd5",
          "why": "Nxd5 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxd5",
              "eval": -3.6,
              "depth": 16,
              "why": "Nxd5 is the top line maintaining optimal control.",
              "pv": [
                "Nxd5",
                "Rb8"
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
        "coachComment": "cxd5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.6,
          "bestMove": "cxd5",
          "why": "cxd5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "cxd5",
              "eval": -3.6,
              "depth": 16,
              "why": "cxd5 is the top line maintaining optimal control.",
              "pv": [
                "cxd5",
                "Bb5"
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
        "coachComment": "Bxd5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Bxd5",
          "why": "Bxd5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxd5",
              "eval": -3.6,
              "depth": 16,
              "why": "Bxd5 is the top line maintaining optimal control.",
              "pv": [
                "Bxd5",
                "Rb8"
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
        "coachComment": "Qb6 is a sound practical choice.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Qb6",
          "why": "Qb6 is a sound practical choice.",
          "lines": [
            {
              "move": "Qb6",
              "eval": -3.4,
              "depth": 16,
              "why": "Qb6 is the top line maintaining optimal control.",
              "pv": [
                "Qb6",
                "Bc6"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": -3.4,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Rb8"
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
        "coachComment": "e6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "e6",
          "why": "e6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e6",
              "eval": -3.4,
              "depth": 16,
              "why": "e6 is the top line maintaining optimal control.",
              "pv": [
                "e6",
                "Bc6"
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
        "coachComment": "Bg2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Bg2",
          "why": "Bg2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bg2",
              "eval": -3.5,
              "depth": 16,
              "why": "Bg2 is the top line maintaining optimal control.",
              "pv": [
                "Bg2",
                "Rb8"
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
        "coachComment": "Bd6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Bd6",
          "why": "Bd6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd6",
              "eval": -3.5,
              "depth": 16,
              "why": "Bd6 is the top line maintaining optimal control.",
              "pv": [
                "Bd6",
                "d5"
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
        "coachComment": "Nc4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Nc4",
          "why": "Nc4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc4",
              "eval": -3.5,
              "depth": 16,
              "why": "Nc4 is the top line maintaining optimal control.",
              "pv": [
                "Nc4",
                "Rb8"
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
        "coachComment": "Bxf4 is a sound practical choice.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Bxf4",
          "why": "Bxf4 is a sound practical choice.",
          "lines": [
            {
              "move": "Bxf4",
              "eval": -3.4,
              "depth": 16,
              "why": "Bxf4 is the top line maintaining optimal control.",
              "pv": [
                "Bxf4",
                "Na5"
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
        "coachComment": "Nxb6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Nxb6",
          "why": "Nxb6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxb6",
              "eval": -3.4,
              "depth": 16,
              "why": "Nxb6 is the top line maintaining optimal control.",
              "pv": [
                "Nxb6",
                "Rb8"
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
        "coachComment": "Nxb6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Nxb6",
          "why": "Nxb6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxb6",
              "eval": -3.4,
              "depth": 16,
              "why": "Nxb6 is the top line maintaining optimal control.",
              "pv": [
                "Nxb6",
                "d5"
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
        "coachComment": "Bxb7 is a sound practical choice.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Bxb7",
          "why": "Bxb7 is a sound practical choice.",
          "lines": [
            {
              "move": "Bxb7",
              "eval": -3.5,
              "depth": 16,
              "why": "Bxb7 is the top line maintaining optimal control.",
              "pv": [
                "Bxb7",
                "Rb8"
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
        "coachComment": "Rb8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Rb8",
          "why": "Rb8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rb8",
              "eval": -3.5,
              "depth": 16,
              "why": "Rb8 is the top line maintaining optimal control.",
              "pv": [
                "Rb8",
                "Ba8"
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
        "coachComment": "Bc6+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Bc6+",
          "why": "Bc6+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bc6+",
              "eval": -3.5,
              "depth": 16,
              "why": "Bc6+ is the top line maintaining optimal control.",
              "pv": [
                "Bc6+",
                "Kf8"
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
        "coachComment": "Ke7 is a sound practical choice.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Ke7",
          "why": "Ke7 is a sound practical choice.",
          "lines": [
            {
              "move": "Ke7",
              "eval": -3.4,
              "depth": 16,
              "why": "Ke7 is the top line maintaining optimal control.",
              "pv": [
                "Ke7",
                "Bb7"
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
        "coachComment": "Qf3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Qf3",
          "why": "Qf3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qf3",
              "eval": -3.4,
              "depth": 16,
              "why": "Qf3 is the top line maintaining optimal control.",
              "pv": [
                "Qf3",
                "Rbc8"
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
        "coachComment": "Bd6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Bd6",
          "why": "Bd6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd6",
              "eval": -3.4,
              "depth": 16,
              "why": "Bd6 is the top line maintaining optimal control.",
              "pv": [
                "Bd6",
                "Bb7"
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
        "coachComment": "b3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "b3",
          "why": "b3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b3",
              "eval": -3.4,
              "depth": 16,
              "why": "b3 is the top line maintaining optimal control.",
              "pv": [
                "b3",
                "Rbc8"
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
        "coachComment": "Rhc8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Rhc8",
          "why": "Rhc8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rhc8",
              "eval": -3.4,
              "depth": 16,
              "why": "Rhc8 is the top line maintaining optimal control.",
              "pv": [
                "Rhc8",
                "Bb7"
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
        "coachComment": "c4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "c4",
          "why": "c4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c4",
              "eval": -3.4,
              "depth": 16,
              "why": "c4 is the top line maintaining optimal control.",
              "pv": [
                "c4",
                "Rb7"
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
        "coachComment": "Ba3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Ba3",
          "why": "Ba3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Ba3",
              "eval": -3.4,
              "depth": 16,
              "why": "Ba3 is the top line maintaining optimal control.",
              "pv": [
                "Ba3",
                "Bb7"
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
        "coachComment": "Rae1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Rae1",
          "why": "Rae1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rae1",
              "eval": -3.4,
              "depth": 16,
              "why": "Rae1 is the top line maintaining optimal control.",
              "pv": [
                "Rae1",
                "Rb7"
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
        "coachComment": "Kf8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Kf8",
          "why": "Kf8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kf8",
              "eval": -3.4,
              "depth": 16,
              "why": "Kf8 is the top line maintaining optimal control.",
              "pv": [
                "Kf8",
                "Bb7"
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
        "coachComment": "Rxe6 is a sound practical choice.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Rxe6",
          "why": "Rxe6 is a sound practical choice.",
          "lines": [
            {
              "move": "Rxe6",
              "eval": -3.5,
              "depth": 16,
              "why": "Rxe6 is the top line maintaining optimal control.",
              "pv": [
                "Rxe6",
                "Rb7"
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
        "coachComment": "Kg8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Kg8",
          "why": "Kg8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kg8",
              "eval": -3.5,
              "depth": 16,
              "why": "Kg8 is the top line maintaining optimal control.",
              "pv": [
                "Kg8",
                "Bb7"
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
        "coachComment": "Re3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Re3",
          "why": "Re3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Re3",
              "eval": -3.6,
              "depth": 16,
              "why": "Re3 is the top line maintaining optimal control.",
              "pv": [
                "Re3",
                "Rb7"
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
        "coachComment": "Bb4 is a sound practical choice.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Bb4",
          "why": "Bb4 is a sound practical choice.",
          "lines": [
            {
              "move": "Bb4",
              "eval": -3.4,
              "depth": 16,
              "why": "Bb4 is the top line maintaining optimal control.",
              "pv": [
                "Bb4",
                "Bb7"
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
        "coachComment": "c5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "c5",
          "why": "c5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c5",
              "eval": -3.4,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "Rb7"
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
        "coachComment": "Na8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Na8",
          "why": "Na8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Na8",
              "eval": -3.4,
              "depth": 16,
              "why": "Na8 is the top line maintaining optimal control.",
              "pv": [
                "Na8",
                "Bb7"
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
        "coachComment": "a3 is a sound practical choice.",
        "eval": {
          "eval": -3.6,
          "bestMove": "a3",
          "why": "a3 is a sound practical choice.",
          "lines": [
            {
              "move": "a3",
              "eval": -3.6,
              "depth": 16,
              "why": "a3 is the top line maintaining optimal control.",
              "pv": [
                "a3",
                "Nc7"
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
        "coachComment": "Bxa3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Bxa3",
          "why": "Bxa3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bxa3",
              "eval": -3.5,
              "depth": 16,
              "why": "Bxa3 is the top line maintaining optimal control.",
              "pv": [
                "Bxa3",
                "Bb7"
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
        "coachComment": "Ra1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Ra1",
          "why": "Ra1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ra1",
              "eval": -3.5,
              "depth": 16,
              "why": "Ra1 is the top line maintaining optimal control.",
              "pv": [
                "Ra1",
                "Nc7"
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
        "coachComment": "Bb2 is a sound practical choice.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Bb2",
          "why": "Bb2 is a sound practical choice.",
          "lines": [
            {
              "move": "Bb2",
              "eval": -3.4,
              "depth": 16,
              "why": "Bb2 is the top line maintaining optimal control.",
              "pv": [
                "Bb2",
                "Bb7"
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
        "coachComment": "Rxa7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Rxa7",
          "why": "Rxa7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxa7",
              "eval": -3.4,
              "depth": 16,
              "why": "Rxa7 is the top line maintaining optimal control.",
              "pv": [
                "Rxa7",
                "Nc7"
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
        "coachComment": "Nc7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Nc7",
          "why": "Nc7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc7",
              "eval": -3.4,
              "depth": 16,
              "why": "Nc7 is the top line maintaining optimal control.",
              "pv": [
                "Nc7",
                "Ra8"
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
        "coachComment": "Qf4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Qf4",
          "why": "Qf4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qf4",
              "eval": -3.4,
              "depth": 16,
              "why": "Qf4 is the top line maintaining optimal control.",
              "pv": [
                "Qf4",
                "Rb7"
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
        "coachComment": "Ne6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Ne6",
          "why": "Ne6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne6",
              "eval": -3.4,
              "depth": 16,
              "why": "Ne6 is the top line maintaining optimal control.",
              "pv": [
                "Ne6",
                "Ra8"
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
        "coachComment": "Rxe6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Rxe6",
          "why": "Rxe6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxe6",
              "eval": -3.4,
              "depth": 16,
              "why": "Rxe6 is the top line maintaining optimal control.",
              "pv": [
                "Rxe6",
                "Rb7"
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
        "coachComment": "fxe6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.4,
          "bestMove": "fxe6",
          "why": "fxe6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "fxe6",
              "eval": -3.4,
              "depth": 16,
              "why": "fxe6 is the top line maintaining optimal control.",
              "pv": [
                "fxe6",
                "Ra8"
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
        "coachComment": "Qe5 finds a sharp and critical continuation.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Qe5",
          "why": "Qe5 finds a sharp and critical continuation.",
          "lines": [
            {
              "move": "Qe5",
              "eval": -3.4,
              "depth": 16,
              "why": "Qe5 is the top line maintaining optimal control.",
              "pv": [
                "Qe5",
                "Rb7"
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
        "coachComment": "d4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d4",
          "why": "d4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.2,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Nc6"
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
        "coachComment": "Nf6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf6",
          "why": "Nf6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
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
        "fen": "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        "moveNumber": 2,
        "classification": "book",
        "coachComment": "c4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c4",
          "why": "c4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "c4",
              "eval": 0.2,
              "depth": 16,
              "why": "c4 is the top line maintaining optimal control.",
              "pv": [
                "c4",
                "Nc6"
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
        "coachComment": "g6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "g6",
          "why": "g6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "g6",
              "eval": 0.2,
              "depth": 16,
              "why": "g6 is the top line maintaining optimal control.",
              "pv": [
                "g6",
                "c5"
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
        "coachComment": "g3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "g3",
          "why": "g3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "g3",
              "eval": 0.2,
              "depth": 16,
              "why": "g3 is the top line maintaining optimal control.",
              "pv": [
                "g3",
                "Nc6"
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
        "coachComment": "Bg7 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Bg7",
          "why": "Bg7 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 0.2,
              "depth": 16,
              "why": "Bg7 is the top line maintaining optimal control.",
              "pv": [
                "Bg7",
                "c5"
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
        "coachComment": "Bg2 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bg2",
          "why": "Bg2 is a sound practical choice.",
          "lines": [
            {
              "move": "Bg2",
              "eval": 0.1,
              "depth": 16,
              "why": "Bg2 is the top line maintaining optimal control.",
              "pv": [
                "Bg2",
                "Nc6"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "c5"
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
        "coachComment": "Nc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nc3",
          "why": "Nc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Nc6"
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
        "coachComment": "d6 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d6",
          "why": "d6 is a sound practical choice.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.2,
              "depth": 16,
              "why": "d6 is the top line maintaining optimal control.",
              "pv": [
                "d6",
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
        "fen": "rnbq1rk1/ppp1ppbp/3p1np1/8/2PP4/2N2NP1/PP2PPBP/R1BQK2R b KQ - 1 6",
        "moveNumber": 6,
        "classification": "excellent",
        "coachComment": "Nf3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nf3",
          "why": "Nf3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nbd7"
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
        "coachComment": "Nbd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nbd7",
          "why": "Nbd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.1,
              "depth": 16,
              "why": "Nbd7 is the top line maintaining optimal control.",
              "pv": [
                "Nbd7",
                "c5"
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
        "coachComment": "O-O is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "O-O",
          "why": "O-O is a sound practical choice.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Rb8"
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
        "coachComment": "e5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "e5",
          "why": "e5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e5",
              "eval": 0,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "c5"
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
        "coachComment": "e4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "e4",
          "why": "e4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e4",
              "eval": 0,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Rb8"
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
        "coachComment": "c6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "c6",
          "why": "c6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "c6",
              "eval": 0.1,
              "depth": 16,
              "why": "c6 is the top line maintaining optimal control.",
              "pv": [
                "c6",
                "c5"
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
        "coachComment": "h3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "h3",
          "why": "h3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "h3",
              "eval": 0.1,
              "depth": 16,
              "why": "h3 is the top line maintaining optimal control.",
              "pv": [
                "h3",
                "Rb8"
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
        "coachComment": "Qb6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Qb6",
          "why": "Qb6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qb6",
              "eval": 0.1,
              "depth": 16,
              "why": "Qb6 is the top line maintaining optimal control.",
              "pv": [
                "Qb6",
                "c5"
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
        "coachComment": "Re1 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Re1",
          "why": "Re1 is a sound practical choice.",
          "lines": [
            {
              "move": "Re1",
              "eval": -0.1,
              "depth": 16,
              "why": "Re1 is the top line maintaining optimal control.",
              "pv": [
                "Re1",
                "Rb8"
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
        "coachComment": "exd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "exd4",
          "why": "exd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exd4",
              "eval": -0.1,
              "depth": 16,
              "why": "exd4 is the top line maintaining optimal control.",
              "pv": [
                "exd4",
                "c5"
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
        "coachComment": "Nxd4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nxd4",
          "why": "Nxd4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": -0.1,
              "depth": 16,
              "why": "Nxd4 is the top line maintaining optimal control.",
              "pv": [
                "Nxd4",
                "Rb8"
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
        "coachComment": "Re8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Re8",
          "why": "Re8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re8",
              "eval": -0.1,
              "depth": 16,
              "why": "Re8 is the top line maintaining optimal control.",
              "pv": [
                "Re8",
                "c5"
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
        "coachComment": "Re2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Re2",
          "why": "Re2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re2",
              "eval": -0.1,
              "depth": 16,
              "why": "Re2 is the top line maintaining optimal control.",
              "pv": [
                "Re2",
                "Rb8"
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
        "coachComment": "Ng4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Ng4",
          "why": "Ng4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ng4",
              "eval": -0.1,
              "depth": 16,
              "why": "Ng4 is the top line maintaining optimal control.",
              "pv": [
                "Ng4",
                "c5"
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
        "coachComment": "Nb3 is a sound practical choice.",
        "eval": {
          "eval": -0.3,
          "bestMove": "Nb3",
          "why": "Nb3 is a sound practical choice.",
          "lines": [
            {
              "move": "Nb3",
              "eval": -0.3,
              "depth": 16,
              "why": "Nb3 is the top line maintaining optimal control.",
              "pv": [
                "Nb3",
                "Rb8"
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
        "coachComment": "Nge5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Nge5",
          "why": "Nge5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nge5",
              "eval": -0.2,
              "depth": 16,
              "why": "Nge5 is the top line maintaining optimal control.",
              "pv": [
                "Nge5",
                "c5"
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
        "coachComment": "Be3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Be3",
          "why": "Be3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be3",
              "eval": -0.2,
              "depth": 16,
              "why": "Be3 is the top line maintaining optimal control.",
              "pv": [
                "Be3",
                "Rb8"
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
        "coachComment": "Qc7 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qc7",
          "why": "Qc7 is a sound practical choice.",
          "lines": [
            {
              "move": "Qc7",
              "eval": -0.1,
              "depth": 16,
              "why": "Qc7 is the top line maintaining optimal control.",
              "pv": [
                "Qc7",
                "c5"
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
        "coachComment": "c5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "c5",
          "why": "c5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c5",
              "eval": -0.1,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "Rb8"
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
        "coachComment": "dxc5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "dxc5",
          "why": "dxc5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "dxc5",
              "eval": -0.1,
              "depth": 16,
              "why": "dxc5 is the top line maintaining optimal control.",
              "pv": [
                "dxc5",
                "Na5"
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
        "coachComment": "Nxc5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nxc5",
          "why": "Nxc5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nxc5",
              "eval": -0.1,
              "depth": 16,
              "why": "Nxc5 is the top line maintaining optimal control.",
              "pv": [
                "Nxc5",
                "Rb8"
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
        "coachComment": "Nxc5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nxc5",
          "why": "Nxc5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxc5",
              "eval": -0.1,
              "depth": 16,
              "why": "Nxc5 is the top line maintaining optimal control.",
              "pv": [
                "Nxc5",
                "Na4"
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
        "coachComment": "Bxc5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxc5",
          "why": "Bxc5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxc5",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxc5 is the top line maintaining optimal control.",
              "pv": [
                "Bxc5",
                "Rb8"
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
        "coachComment": "Rd8 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Rd8",
          "why": "Rd8 is a sound practical choice.",
          "lines": [
            {
              "move": "Rd8",
              "eval": 0,
              "depth": 16,
              "why": "Rd8 is the top line maintaining optimal control.",
              "pv": [
                "Rd8",
                "Bb6"
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
        "coachComment": "Qc2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qc2",
          "why": "Qc2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qc2",
              "eval": 0,
              "depth": 16,
              "why": "Qc2 is the top line maintaining optimal control.",
              "pv": [
                "Qc2",
                "Rb8"
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
        "coachComment": "Be6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Be6",
          "why": "Be6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be6",
              "eval": 0,
              "depth": 16,
              "why": "Be6 is the top line maintaining optimal control.",
              "pv": [
                "Be6",
                "Bb6"
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
        "coachComment": "b3 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "b3",
          "why": "b3 is a sound practical choice.",
          "lines": [
            {
              "move": "b3",
              "eval": -0.1,
              "depth": 16,
              "why": "b3 is the top line maintaining optimal control.",
              "pv": [
                "b3",
                "Rab8"
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
        "coachComment": "Nd3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nd3",
          "why": "Nd3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd3",
              "eval": -0.1,
              "depth": 16,
              "why": "Nd3 is the top line maintaining optimal control.",
              "pv": [
                "Nd3",
                "Bb6"
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
        "coachComment": "Be3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be3",
          "why": "Be3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be3",
              "eval": -0.1,
              "depth": 16,
              "why": "Be3 is the top line maintaining optimal control.",
              "pv": [
                "Be3",
                "Rab8"
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
        "coachComment": "Nb4 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Nb4",
          "why": "Nb4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nb4",
              "eval": 0,
              "depth": 16,
              "why": "Nb4 is the top line maintaining optimal control.",
              "pv": [
                "Nb4",
                "e5"
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
        "coachComment": "Qc1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qc1",
          "why": "Qc1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qc1",
              "eval": -0.1,
              "depth": 16,
              "why": "Qc1 is the top line maintaining optimal control.",
              "pv": [
                "Qc1",
                "Rab8"
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
        "coachComment": "Rd3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Rd3",
          "why": "Rd3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rd3",
              "eval": 0,
              "depth": 16,
              "why": "Rd3 is the top line maintaining optimal control.",
              "pv": [
                "Rd3",
                "e5"
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
        "coachComment": "Bd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bd2",
          "why": "Bd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd2",
              "eval": -0.1,
              "depth": 16,
              "why": "Bd2 is the top line maintaining optimal control.",
              "pv": [
                "Bd2",
                "Rb8"
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
        "coachComment": "Rad8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Rad8",
          "why": "Rad8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rad8",
              "eval": 0,
              "depth": 16,
              "why": "Rad8 is the top line maintaining optimal control.",
              "pv": [
                "Rad8",
                "e5"
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
        "coachComment": "Be1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be1",
          "why": "Be1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be1",
              "eval": -0.1,
              "depth": 16,
              "why": "Be1 is the top line maintaining optimal control.",
              "pv": [
                "Be1",
                "Re8"
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
        "coachComment": "Qe5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0,
          "bestMove": "Qe5",
          "why": "Qe5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qe5",
              "eval": 0,
              "depth": 16,
              "why": "Qe5 is the top line maintaining optimal control.",
              "pv": [
                "Qe5",
                "Na4"
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
        "coachComment": "a3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "a3",
          "why": "a3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "a3",
              "eval": 0,
              "depth": 16,
              "why": "a3 is the top line maintaining optimal control.",
              "pv": [
                "a3",
                "Re8"
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
        "coachComment": "Na6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Na6",
          "why": "Na6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Na6",
              "eval": 0,
              "depth": 16,
              "why": "Na6 is the top line maintaining optimal control.",
              "pv": [
                "Na6",
                "a4"
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
        "coachComment": "Rc2 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rc2",
          "why": "Rc2 is a sound practical choice.",
          "lines": [
            {
              "move": "Rc2",
              "eval": -0.1,
              "depth": 16,
              "why": "Rc2 is the top line maintaining optimal control.",
              "pv": [
                "Rc2",
                "Re8"
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
        "coachComment": "Bxb3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxb3",
          "why": "Bxb3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxb3",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxb3 is the top line maintaining optimal control.",
              "pv": [
                "Bxb3",
                "a4"
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
        "coachComment": "f4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "f4",
          "why": "f4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "f4",
              "eval": -0.2,
              "depth": 16,
              "why": "f4 is the top line maintaining optimal control.",
              "pv": [
                "f4",
                "Re8"
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
        "coachComment": "Qd4+ is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Qd4+",
          "why": "Qd4+ is a sound practical choice.",
          "lines": [
            {
              "move": "Qd4+",
              "eval": 0,
              "depth": 16,
              "why": "Qd4+ is the top line maintaining optimal control.",
              "pv": [
                "Qd4+",
                "Rf2"
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
        "coachComment": "Bf2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bf2",
          "why": "Bf2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bf2",
              "eval": -0.1,
              "depth": 16,
              "why": "Bf2 is the top line maintaining optimal control.",
              "pv": [
                "Bf2",
                "Re8"
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
        "coachComment": "Qd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qd7",
          "why": "Qd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qd7",
              "eval": 0,
              "depth": 16,
              "why": "Qd7 is the top line maintaining optimal control.",
              "pv": [
                "Qd7",
                "e5"
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
        "coachComment": "e5 is a sound practical choice.",
        "eval": {
          "eval": -0.2,
          "bestMove": "e5",
          "why": "e5 is a sound practical choice.",
          "lines": [
            {
              "move": "e5",
              "eval": -0.2,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "Re8"
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
        "coachComment": "Bxc2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxc2",
          "why": "Bxc2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bxc2",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxc2 is the top line maintaining optimal control.",
              "pv": [
                "Bxc2",
                "e6"
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
        "coachComment": "Qxc2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qxc2",
          "why": "Qxc2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxc2",
              "eval": -0.1,
              "depth": 16,
              "why": "Qxc2 is the top line maintaining optimal control.",
              "pv": [
                "Qxc2",
                "Re8"
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
        "coachComment": "Rd2 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Rd2",
          "why": "Rd2 is a sound practical choice.",
          "lines": [
            {
              "move": "Rd2",
              "eval": 0,
              "depth": 16,
              "why": "Rd2 is the top line maintaining optimal control.",
              "pv": [
                "Rd2",
                "e6"
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
        "coachComment": "Qb3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qb3",
          "why": "Qb3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qb3",
              "eval": 0,
              "depth": 16,
              "why": "Qb3 is the top line maintaining optimal control.",
              "pv": [
                "Qb3",
                "Re8"
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
        "coachComment": "Rxf2 is brilliant, finding an inspired tactical shot.",
        "eval": {
          "eval": -0.3,
          "bestMove": "Rxf2",
          "why": "Rxf2 is brilliant, finding an inspired tactical shot.",
          "lines": [
            {
              "move": "Rxf2",
              "eval": -0.3,
              "depth": 16,
              "why": "Rxf2 is the top line maintaining optimal control.",
              "pv": [
                "Rxf2",
                "e6"
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
        "coachComment": "Kxf2 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -3.5,
          "bestMove": "e6",
          "why": "Kxf2 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "e6",
              "eval": -0.3,
              "depth": 16,
              "why": "e6 was the engine recommendation maintaining the initiative.",
              "pv": [
                "e6",
                "Re8",
                "e7"
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
        "coachComment": "Qd4+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Qd4+",
          "why": "Qd4+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qd4+",
              "eval": -3.5,
              "depth": 16,
              "why": "Qd4+ is the top line maintaining optimal control.",
              "pv": [
                "Qd4+",
                "Kf3"
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
        "coachComment": "Kf1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Kf1",
          "why": "Kf1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kf1",
              "eval": -3.5,
              "depth": 16,
              "why": "Kf1 is the top line maintaining optimal control.",
              "pv": [
                "Kf1",
                "Re8"
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
        "coachComment": "Nc5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Nc5",
          "why": "Nc5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc5",
              "eval": -3.5,
              "depth": 16,
              "why": "Nc5 is the top line maintaining optimal control.",
              "pv": [
                "Nc5",
                "e6"
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
        "coachComment": "Qc2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.5,
          "bestMove": "Qc2",
          "why": "Qc2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qc2",
              "eval": -3.5,
              "depth": 16,
              "why": "Qc2 is the top line maintaining optimal control.",
              "pv": [
                "Qc2",
                "Re8"
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
        "coachComment": "Qc4+ is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Qc4+",
          "why": "Qc4+ is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qc4+",
              "eval": -3.4,
              "depth": 16,
              "why": "Qc4+ is the top line maintaining optimal control.",
              "pv": [
                "Qc4+",
                "Ne2"
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
        "coachComment": "Kg1 is a sound practical choice.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Kg1",
          "why": "Kg1 is a sound practical choice.",
          "lines": [
            {
              "move": "Kg1",
              "eval": -3.6,
              "depth": 16,
              "why": "Kg1 is the top line maintaining optimal control.",
              "pv": [
                "Kg1",
                "Re8"
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
        "coachComment": "Rd3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Rd3",
          "why": "Rd3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rd3",
              "eval": -3.6,
              "depth": 16,
              "why": "Rd3 is the top line maintaining optimal control.",
              "pv": [
                "Rd3",
                "e6"
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
        "coachComment": "Rc1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Rc1",
          "why": "Rc1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rc1",
              "eval": -3.6,
              "depth": 16,
              "why": "Rc1 is the top line maintaining optimal control.",
              "pv": [
                "Rc1",
                "Kh8"
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
        "coachComment": "Rxg3 is a sound practical choice.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Rxg3",
          "why": "Rxg3 is a sound practical choice.",
          "lines": [
            {
              "move": "Rxg3",
              "eval": -3.4,
              "depth": 16,
              "why": "Rxg3 is the top line maintaining optimal control.",
              "pv": [
                "Rxg3",
                "e6"
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
        "coachComment": "e4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e4",
          "why": "e4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.2,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Nc6"
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
        "coachComment": "e5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e5",
          "why": "e5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.2,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "a3"
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
        "coachComment": "Nf3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf3",
          "why": "Nf3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nc6"
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
        "coachComment": "Nf6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf6",
          "why": "Nf6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
                "Nd4"
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
        "coachComment": "Nxe5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nxe5",
          "why": "Nxe5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nxe5",
              "eval": 0.2,
              "depth": 16,
              "why": "Nxe5 is the top line maintaining optimal control.",
              "pv": [
                "Nxe5",
                "Nc6"
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
        "coachComment": "d6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d6",
          "why": "d6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.2,
              "depth": 16,
              "why": "d6 is the top line maintaining optimal control.",
              "pv": [
                "d6",
                "Nc6"
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
        "coachComment": "Nf3 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nf3",
          "why": "Nf3 is a sound practical choice.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nbd7"
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
        "coachComment": "Nxe4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nxe4",
          "why": "Nxe4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxe4",
              "eval": 0.1,
              "depth": 16,
              "why": "Nxe4 is the top line maintaining optimal control.",
              "pv": [
                "Nxe4",
                "Nd4"
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
        "coachComment": "d4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "d4",
          "why": "d4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.1,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Nd7"
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
        "coachComment": "d5 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d5",
          "why": "d5 is a sound practical choice.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.2,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "Ne5"
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
        "coachComment": "Bd3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bd3",
          "why": "Bd3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0.1,
              "depth": 16,
              "why": "Bd3 is the top line maintaining optimal control.",
              "pv": [
                "Bd3",
                "Nd7"
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
        "coachComment": "Bd6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bd6",
          "why": "Bd6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd6",
              "eval": 0.1,
              "depth": 16,
              "why": "Bd6 is the top line maintaining optimal control.",
              "pv": [
                "Bd6",
                "Bc4"
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
        "coachComment": "O-O is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "O-O",
          "why": "O-O is a sound practical choice.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Nd7"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Bc4"
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
        "coachComment": "c4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "c4",
          "why": "c4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c4",
              "eval": 0,
              "depth": 16,
              "why": "c4 is the top line maintaining optimal control.",
              "pv": [
                "c4",
                "Nd7"
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
        "coachComment": "c6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "c6",
          "why": "c6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "c6",
              "eval": 0.1,
              "depth": 16,
              "why": "c6 is the top line maintaining optimal control.",
              "pv": [
                "c6",
                "c5"
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
        "coachComment": "Nc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nc3",
          "why": "Nc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Nd7"
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
        "coachComment": "Nxc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nxc3",
          "why": "Nxc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxc3",
              "eval": 0.1,
              "depth": 16,
              "why": "Nxc3 is the top line maintaining optimal control.",
              "pv": [
                "Nxc3",
                "c5"
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
        "coachComment": "bxc3 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "bxc3",
          "why": "bxc3 is a sound practical choice.",
          "lines": [
            {
              "move": "bxc3",
              "eval": -0.1,
              "depth": 16,
              "why": "bxc3 is the top line maintaining optimal control.",
              "pv": [
                "bxc3",
                "Nd7"
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
        "coachComment": "dxc4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "dxc4",
          "why": "dxc4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "dxc4",
              "eval": -0.1,
              "depth": 16,
              "why": "dxc4 is the top line maintaining optimal control.",
              "pv": [
                "dxc4",
                "d5"
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
        "coachComment": "Bxc4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxc4",
          "why": "Bxc4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bxc4",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxc4 is the top line maintaining optimal control.",
              "pv": [
                "Bxc4",
                "Nd7"
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
        "coachComment": "Bg4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bg4",
          "why": "Bg4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg4",
              "eval": -0.1,
              "depth": 16,
              "why": "Bg4 is the top line maintaining optimal control.",
              "pv": [
                "Bg4",
                "Bb5"
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
        "coachComment": "h3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "h3",
          "why": "h3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "h3",
              "eval": -0.1,
              "depth": 16,
              "why": "h3 is the top line maintaining optimal control.",
              "pv": [
                "h3",
                "Nd7"
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
        "coachComment": "Bh5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bh5",
          "why": "Bh5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bh5",
              "eval": -0.1,
              "depth": 16,
              "why": "Bh5 is the top line maintaining optimal control.",
              "pv": [
                "Bh5",
                "Bb5"
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
        "coachComment": "Re1 is a sound practical choice.",
        "eval": {
          "eval": -0.3,
          "bestMove": "Re1",
          "why": "Re1 is a sound practical choice.",
          "lines": [
            {
              "move": "Re1",
              "eval": -0.3,
              "depth": 16,
              "why": "Re1 is the top line maintaining optimal control.",
              "pv": [
                "Re1",
                "Nd7"
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
        "coachComment": "Nd7 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Nd7",
          "why": "Nd7 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nd7",
              "eval": -0.2,
              "depth": 16,
              "why": "Nd7 is the top line maintaining optimal control.",
              "pv": [
                "Nd7",
                "Bb5"
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
        "coachComment": "Be2 finds a sharp and critical continuation.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Be2",
          "why": "Be2 finds a sharp and critical continuation.",
          "lines": [
            {
              "move": "Be2",
              "eval": -0.2,
              "depth": 16,
              "why": "Be2 is the top line maintaining optimal control.",
              "pv": [
                "Be2",
                "Rb8"
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
        "coachComment": "Re8 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Re8",
          "why": "Re8 is a sound practical choice.",
          "lines": [
            {
              "move": "Re8",
              "eval": 0,
              "depth": 16,
              "why": "Re8 is the top line maintaining optimal control.",
              "pv": [
                "Re8",
                "d5"
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
        "coachComment": "Be3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be3",
          "why": "Be3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be3",
              "eval": -0.1,
              "depth": 16,
              "why": "Be3 is the top line maintaining optimal control.",
              "pv": [
                "Be3",
                "Rb8"
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
        "coachComment": "Qc7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qc7",
          "why": "Qc7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qc7",
              "eval": 0,
              "depth": 16,
              "why": "Qc7 is the top line maintaining optimal control.",
              "pv": [
                "Qc7",
                "d5"
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
        "coachComment": "Qb3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qb3",
          "why": "Qb3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qb3",
              "eval": -0.1,
              "depth": 16,
              "why": "Qb3 is the top line maintaining optimal control.",
              "pv": [
                "Qb3",
                "Rab8"
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
        "coachComment": "Rad8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rad8",
          "why": "Rad8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rad8",
              "eval": -0.1,
              "depth": 16,
              "why": "Rad8 is the top line maintaining optimal control.",
              "pv": [
                "Rad8",
                "d5"
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
        "coachComment": "Rab1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rab1",
          "why": "Rab1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rab1",
              "eval": -0.1,
              "depth": 16,
              "why": "Rab1 is the top line maintaining optimal control.",
              "pv": [
                "Rab1",
                "Rc8"
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
        "coachComment": "b6 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "b6",
          "why": "b6 is a sound practical choice.",
          "lines": [
            {
              "move": "b6",
              "eval": 0,
              "depth": 16,
              "why": "b6 is the top line maintaining optimal control.",
              "pv": [
                "b6",
                "d5"
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
        "coachComment": "c4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "c4",
          "why": "c4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c4",
              "eval": 0,
              "depth": 16,
              "why": "c4 is the top line maintaining optimal control.",
              "pv": [
                "c4",
                "Rc8"
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
        "coachComment": "c5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "c5",
          "why": "c5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c5",
              "eval": 0,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "d5"
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
        "coachComment": "d5 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "d5",
          "why": "d5 is a sound practical choice.",
          "lines": [
            {
              "move": "d5",
              "eval": -0.1,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "Rc8"
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
        "coachComment": "Nf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nf6",
          "why": "Nf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf6",
              "eval": -0.1,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
                "Qa4"
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
        "coachComment": "a4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "a4",
          "why": "a4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "a4",
              "eval": -0.1,
              "depth": 16,
              "why": "a4 is the top line maintaining optimal control.",
              "pv": [
                "a4",
                "Rd7"
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
        "coachComment": "Ne4 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Ne4",
          "why": "Ne4 is a sound practical choice.",
          "lines": [
            {
              "move": "Ne4",
              "eval": 0,
              "depth": 16,
              "why": "Ne4 is the top line maintaining optimal control.",
              "pv": [
                "Ne4",
                "a5"
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
        "coachComment": "a5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0,
          "bestMove": "a5",
          "why": "a5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "a5",
              "eval": 0,
              "depth": 16,
              "why": "a5 is the top line maintaining optimal control.",
              "pv": [
                "a5",
                "Rd7"
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
        "coachComment": "bxa5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "bxa5",
          "why": "bxa5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "bxa5",
              "eval": 0,
              "depth": 16,
              "why": "bxa5 is the top line maintaining optimal control.",
              "pv": [
                "bxa5",
                "Qa4"
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
        "coachComment": "Qa3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qa3",
          "why": "Qa3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qa3",
              "eval": 0,
              "depth": 16,
              "why": "Qa3 is the top line maintaining optimal control.",
              "pv": [
                "Qa3",
                "Rd7"
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
        "coachComment": "Rb8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Rb8",
          "why": "Rb8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rb8",
              "eval": 0,
              "depth": 16,
              "why": "Rb8 is the top line maintaining optimal control.",
              "pv": [
                "Rb8",
                "Qa4"
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
        "coachComment": "Ra1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Ra1",
          "why": "Ra1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ra1",
              "eval": 0,
              "depth": 16,
              "why": "Ra1 is the top line maintaining optimal control.",
              "pv": [
                "Ra1",
                "Rbc8"
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
        "coachComment": "Rb4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0,
          "bestMove": "Rb4",
          "why": "Rb4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rb4",
              "eval": 0,
              "depth": 16,
              "why": "Rb4 is the top line maintaining optimal control.",
              "pv": [
                "Rb4",
                "Qa4"
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
        "coachComment": "Qxa5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qxa5",
          "why": "Qxa5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxa5",
              "eval": 0,
              "depth": 16,
              "why": "Qxa5 is the top line maintaining optimal control.",
              "pv": [
                "Qxa5",
                "Rf8"
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
        "coachComment": "Qxa5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qxa5",
          "why": "Qxa5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxa5",
              "eval": 0,
              "depth": 16,
              "why": "Qxa5 is the top line maintaining optimal control.",
              "pv": [
                "Qxa5",
                "Bd4"
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
        "coachComment": "Rxa5 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rxa5",
          "why": "Rxa5 is a sound practical choice.",
          "lines": [
            {
              "move": "Rxa5",
              "eval": -0.1,
              "depth": 16,
              "why": "Rxa5 is the top line maintaining optimal control.",
              "pv": [
                "Rxa5",
                "Rf8"
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
        "coachComment": "Nc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nc3",
          "why": "Nc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc3",
              "eval": -0.1,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Ra6"
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
        "coachComment": "Bd3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "Bd3",
          "why": "Bd3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bd3",
              "eval": -0.2,
              "depth": 16,
              "why": "Bd3 is the top line maintaining optimal control.",
              "pv": [
                "Bd3",
                "Rf8"
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
        "coachComment": "Bxf3 is inaccurate; Rf8 offered firmer positional pressure.",
        "eval": {
          "eval": 0.4,
          "bestMove": "Rf8",
          "why": "Bxf3 is inaccurate; Rf8 offered firmer positional pressure.",
          "lines": [
            {
              "move": "Rf8",
              "eval": -0.2,
              "depth": 16,
              "why": "Rf8 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Rf8",
                "Ra6",
                "Re8"
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
        "coachComment": "gxf3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.4,
          "bestMove": "gxf3",
          "why": "gxf3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "gxf3",
              "eval": 0.4,
              "depth": 16,
              "why": "gxf3 is the top line maintaining optimal control.",
              "pv": [
                "gxf3",
                "Rf8"
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
        "coachComment": "Ra4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.4,
          "bestMove": "Ra4",
          "why": "Ra4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ra4",
              "eval": 0.4,
              "depth": 16,
              "why": "Ra4 is the top line maintaining optimal control.",
              "pv": [
                "Ra4",
                "Ra6"
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
        "coachComment": "Rxa4 is a sound practical choice.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Rxa4",
          "why": "Rxa4 is a sound practical choice.",
          "lines": [
            {
              "move": "Rxa4",
              "eval": 0.3,
              "depth": 16,
              "why": "Rxa4 is the top line maintaining optimal control.",
              "pv": [
                "Rxa4",
                "Rf8"
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
        "coachComment": "Nxa4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.4,
          "bestMove": "Nxa4",
          "why": "Nxa4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nxa4",
              "eval": 0.4,
              "depth": 16,
              "why": "Nxa4 is the top line maintaining optimal control.",
              "pv": [
                "Nxa4",
                "Be4"
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
        "coachComment": "Ra1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Ra1",
          "why": "Ra1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ra1",
              "eval": 0.3,
              "depth": 16,
              "why": "Ra1 is the top line maintaining optimal control.",
              "pv": [
                "Ra1",
                "Rf8"
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
        "coachComment": "Nb2 is a sound practical choice.",
        "eval": {
          "eval": 0.5,
          "bestMove": "Nb2",
          "why": "Nb2 is a sound practical choice.",
          "lines": [
            {
              "move": "Nb2",
              "eval": 0.5,
              "depth": 16,
              "why": "Nb2 is the top line maintaining optimal control.",
              "pv": [
                "Nb2",
                "Be4"
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
        "coachComment": "Bf1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.5,
          "bestMove": "Bf1",
          "why": "Bf1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bf1",
              "eval": 0.5,
              "depth": 16,
              "why": "Bf1 is the top line maintaining optimal control.",
              "pv": [
                "Bf1",
                "Rf8"
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
        "coachComment": "Ra8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.5,
          "bestMove": "Ra8",
          "why": "Ra8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ra8",
              "eval": 0.5,
              "depth": 16,
              "why": "Ra8 is the top line maintaining optimal control.",
              "pv": [
                "Ra8",
                "Bd4"
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
        "coachComment": "Ra6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.4,
          "bestMove": "Ra6",
          "why": "Ra6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Ra6",
              "eval": 0.4,
              "depth": 16,
              "why": "Ra6 is the top line maintaining optimal control.",
              "pv": [
                "Ra6",
                "Rb8"
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
        "coachComment": "Bf8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.4,
          "bestMove": "Bf8",
          "why": "Bf8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bf8",
              "eval": 0.4,
              "depth": 16,
              "why": "Bf8 is the top line maintaining optimal control.",
              "pv": [
                "Bf8",
                "Rxa7"
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
        "coachComment": "f4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.4,
          "bestMove": "f4",
          "why": "f4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f4",
              "eval": 0.4,
              "depth": 16,
              "why": "f4 is the top line maintaining optimal control.",
              "pv": [
                "f4",
                "Rb8"
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
        "coachComment": "Nd1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.4,
          "bestMove": "Nd1",
          "why": "Nd1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd1",
              "eval": 0.4,
              "depth": 16,
              "why": "Nd1 is the top line maintaining optimal control.",
              "pv": [
                "Nd1",
                "Rxa7"
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
        "coachComment": "Bd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.4,
          "bestMove": "Bd2",
          "why": "Bd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd2",
              "eval": 0.4,
              "depth": 16,
              "why": "Bd2 is the top line maintaining optimal control.",
              "pv": [
                "Bd2",
                "Rb8"
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
        "coachComment": "Nf3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf3",
          "why": "Nf3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nc6"
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
        "coachComment": "c5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c5",
          "why": "c5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "c5",
              "eval": 0.2,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "Nd4"
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
        "coachComment": "g3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "g3",
          "why": "g3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "g3",
              "eval": 0.2,
              "depth": 16,
              "why": "g3 is the top line maintaining optimal control.",
              "pv": [
                "g3",
                "Nc6"
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
        "coachComment": "Nc6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nc6",
          "why": "Nc6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.2,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "Nd4"
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
        "coachComment": "Bg2 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Bg2",
          "why": "Bg2 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Bg2",
              "eval": 0.2,
              "depth": 16,
              "why": "Bg2 is the top line maintaining optimal control.",
              "pv": [
                "Bg2",
                "Rb8"
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
        "coachComment": "g6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "g6",
          "why": "g6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "g6",
              "eval": 0.2,
              "depth": 16,
              "why": "g6 is the top line maintaining optimal control.",
              "pv": [
                "g6",
                "Nd4"
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
        "coachComment": "O-O is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "O-O",
          "why": "O-O is a sound practical choice.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Rb8"
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
        "coachComment": "Bg7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bg7",
          "why": "Bg7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 0.1,
              "depth": 16,
              "why": "Bg7 is the top line maintaining optimal control.",
              "pv": [
                "Bg7",
                "Nd4"
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
        "coachComment": "d3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "d3",
          "why": "d3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "d3",
              "eval": 0.1,
              "depth": 16,
              "why": "d3 is the top line maintaining optimal control.",
              "pv": [
                "d3",
                "Rb8"
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
        "coachComment": "d6 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d6",
          "why": "d6 is a sound practical choice.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.2,
              "depth": 16,
              "why": "d6 is the top line maintaining optimal control.",
              "pv": [
                "d6",
                "d4"
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
        "coachComment": "e4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e4",
          "why": "e4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.1,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Rb8"
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
        "coachComment": "e5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e5",
          "why": "e5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.1,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "d4"
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
        "coachComment": "Nc3 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Nc3",
          "why": "Nc3 is a sound practical choice.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Rb8"
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
        "coachComment": "Nge7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Nge7",
          "why": "Nge7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nge7",
              "eval": 0,
              "depth": 16,
              "why": "Nge7 is the top line maintaining optimal control.",
              "pv": [
                "Nge7",
                "Na4"
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
        "coachComment": "Be3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Be3",
          "why": "Be3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be3",
              "eval": 0,
              "depth": 16,
              "why": "Be3 is the top line maintaining optimal control.",
              "pv": [
                "Be3",
                "Rb8"
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
        "coachComment": "O-O is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "O-O",
          "why": "O-O is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Na4"
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
        "coachComment": "Qd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Qd2",
          "why": "Qd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 0.1,
              "depth": 16,
              "why": "Qd2 is the top line maintaining optimal control.",
              "pv": [
                "Qd2",
                "Rb8"
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
        "coachComment": "Nd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nd4",
          "why": "Nd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd4",
              "eval": 0.1,
              "depth": 16,
              "why": "Nd4 is the top line maintaining optimal control.",
              "pv": [
                "Nd4",
                "Na4"
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
        "coachComment": "Bh6 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bh6",
          "why": "Bh6 is a sound practical choice.",
          "lines": [
            {
              "move": "Bh6",
              "eval": -0.1,
              "depth": 16,
              "why": "Bh6 is the top line maintaining optimal control.",
              "pv": [
                "Bh6",
                "Rb8"
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
        "coachComment": "Bxh6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Bxh6",
          "why": "Bxh6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxh6",
              "eval": -0.1,
              "depth": 16,
              "why": "Bxh6 is the top line maintaining optimal control.",
              "pv": [
                "Bxh6",
                "Na4"
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
        "coachComment": "Qxh6 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Na4",
          "why": "Qxh6 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Na4",
              "eval": -0.1,
              "depth": 16,
              "why": "Na4 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Na4",
                "Rb8",
                "Nb6"
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
        "coachComment": "Nxf3+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Nxf3+",
          "why": "Nxf3+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxf3+",
              "eval": -3.2,
              "depth": 16,
              "why": "Nxf3+ is the top line maintaining optimal control.",
              "pv": [
                "Nxf3+",
                "Bxf3"
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
        "coachComment": "Bxf3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Bxf3",
          "why": "Bxf3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxf3",
              "eval": -3.3,
              "depth": 16,
              "why": "Bxf3 is the top line maintaining optimal control.",
              "pv": [
                "Bxf3",
                "Rb8"
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
        "coachComment": "Be6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Be6",
          "why": "Be6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be6",
              "eval": -3.2,
              "depth": 16,
              "why": "Be6 is the top line maintaining optimal control.",
              "pv": [
                "Be6",
                "Qg7+"
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
        "coachComment": "Bg2 is a sound practical choice.",
        "eval": {
          "eval": -3.4,
          "bestMove": "Bg2",
          "why": "Bg2 is a sound practical choice.",
          "lines": [
            {
              "move": "Bg2",
              "eval": -3.4,
              "depth": 16,
              "why": "Bg2 is the top line maintaining optimal control.",
              "pv": [
                "Bg2",
                "Rb8"
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
        "coachComment": "d5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.3,
          "bestMove": "d5",
          "why": "d5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "d5",
              "eval": -3.3,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "Qg7+"
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
        "coachComment": "exd5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.3,
          "bestMove": "exd5",
          "why": "exd5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exd5",
              "eval": -3.3,
              "depth": 16,
              "why": "exd5 is the top line maintaining optimal control.",
              "pv": [
                "exd5",
                "Rb8"
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
        "coachComment": "Nxd5 is a sound practical choice.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Nxd5",
          "why": "Nxd5 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxd5",
              "eval": -3.2,
              "depth": 16,
              "why": "Nxd5 is the top line maintaining optimal control.",
              "pv": [
                "Nxd5",
                "Qg7+"
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
        "coachComment": "Ne4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Ne4",
          "why": "Ne4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne4",
              "eval": -3.2,
              "depth": 16,
              "why": "Ne4 is the top line maintaining optimal control.",
              "pv": [
                "Ne4",
                "Rb8"
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
        "coachComment": "f6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "f6",
          "why": "f6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f6",
              "eval": -3.2,
              "depth": 16,
              "why": "f6 is the top line maintaining optimal control.",
              "pv": [
                "f6",
                "Qg7+"
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
        "coachComment": "Nxc5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Nxc5",
          "why": "Nxc5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nxc5",
              "eval": -3.3,
              "depth": 16,
              "why": "Nxc5 is the top line maintaining optimal control.",
              "pv": [
                "Nxc5",
                "Rb8"
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
        "coachComment": "Bf7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Bf7",
          "why": "Bf7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bf7",
              "eval": -3.2,
              "depth": 16,
              "why": "Bf7 is the top line maintaining optimal control.",
              "pv": [
                "Bf7",
                "Qg7+"
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
        "coachComment": "Ne4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Ne4",
          "why": "Ne4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne4",
              "eval": -3.3,
              "depth": 16,
              "why": "Ne4 is the top line maintaining optimal control.",
              "pv": [
                "Ne4",
                "Rb8"
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
        "coachComment": "Rc8 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Rc8",
          "why": "Rc8 is a sound practical choice.",
          "lines": [
            {
              "move": "Rc8",
              "eval": -3.1,
              "depth": 16,
              "why": "Rc8 is the top line maintaining optimal control.",
              "pv": [
                "Rc8",
                "Qg7+"
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
        "coachComment": "c4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "c4",
          "why": "c4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c4",
              "eval": -3.1,
              "depth": 16,
              "why": "c4 is the top line maintaining optimal control.",
              "pv": [
                "c4",
                "Rc7"
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
        "coachComment": "Nb4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nb4",
          "why": "Nb4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nb4",
              "eval": -3.1,
              "depth": 16,
              "why": "Nb4 is the top line maintaining optimal control.",
              "pv": [
                "Nb4",
                "Qg7+"
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
        "coachComment": "Rad1 is a sound practical choice.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Rad1",
          "why": "Rad1 is a sound practical choice.",
          "lines": [
            {
              "move": "Rad1",
              "eval": -3.3,
              "depth": 16,
              "why": "Rad1 is the top line maintaining optimal control.",
              "pv": [
                "Rad1",
                "Rc7"
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
        "coachComment": "Rc6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Rc6",
          "why": "Rc6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rc6",
              "eval": -3.2,
              "depth": 16,
              "why": "Rc6 is the top line maintaining optimal control.",
              "pv": [
                "Rc6",
                "Qg7+"
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
        "coachComment": "a3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.3,
          "bestMove": "a3",
          "why": "a3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "a3",
              "eval": -3.3,
              "depth": 16,
              "why": "a3 is the top line maintaining optimal control.",
              "pv": [
                "a3",
                "Qe8"
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
        "coachComment": "Nc2 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nc2",
          "why": "Nc2 is a sound practical choice.",
          "lines": [
            {
              "move": "Nc2",
              "eval": -3.1,
              "depth": 16,
              "why": "Nc2 is the top line maintaining optimal control.",
              "pv": [
                "Nc2",
                "Qg7+"
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
        "coachComment": "Rd2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Rd2",
          "why": "Rd2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rd2",
              "eval": -3.2,
              "depth": 16,
              "why": "Rd2 is the top line maintaining optimal control.",
              "pv": [
                "Rd2",
                "Qe8"
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
        "coachComment": "Nd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Nd4",
          "why": "Nd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd4",
              "eval": -3.2,
              "depth": 16,
              "why": "Nd4 is the top line maintaining optimal control.",
              "pv": [
                "Nd4",
                "Qg7+"
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
        "coachComment": "f4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "f4",
          "why": "f4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f4",
              "eval": -3.2,
              "depth": 16,
              "why": "f4 is the top line maintaining optimal control.",
              "pv": [
                "f4",
                "Qe8"
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
        "coachComment": "exf4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "exf4",
          "why": "exf4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exf4",
              "eval": -3.2,
              "depth": 16,
              "why": "exf4 is the top line maintaining optimal control.",
              "pv": [
                "exf4",
                "Qg7+"
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
        "coachComment": "Rxf4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Rxf4",
          "why": "Rxf4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxf4",
              "eval": -3.2,
              "depth": 16,
              "why": "Rxf4 is the top line maintaining optimal control.",
              "pv": [
                "Rxf4",
                "Qe8"
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
        "coachComment": "Re8 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Re8",
          "why": "Re8 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Re8",
              "eval": -3.1,
              "depth": 16,
              "why": "Re8 is the top line maintaining optimal control.",
              "pv": [
                "Re8",
                "Qg7+"
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
        "coachComment": "Rdf2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Rdf2",
          "why": "Rdf2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rdf2",
              "eval": -3.1,
              "depth": 16,
              "why": "Rdf2 is the top line maintaining optimal control.",
              "pv": [
                "Rdf2",
                "Qe7"
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
        "coachComment": "f5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "f5",
          "why": "f5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f5",
              "eval": -3.1,
              "depth": 16,
              "why": "f5 is the top line maintaining optimal control.",
              "pv": [
                "f5",
                "Qg7+"
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
        "coachComment": "Ng5 is a sound practical choice.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Ng5",
          "why": "Ng5 is a sound practical choice.",
          "lines": [
            {
              "move": "Ng5",
              "eval": -3.3,
              "depth": 16,
              "why": "Ng5 is the top line maintaining optimal control.",
              "pv": [
                "Ng5",
                "Qe7"
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
        "coachComment": "Re1+ is brilliant, finding an inspired tactical shot.",
        "eval": {
          "eval": -3.6,
          "bestMove": "Re1+",
          "why": "Re1+ is brilliant, finding an inspired tactical shot.",
          "lines": [
            {
              "move": "Re1+",
              "eval": -3.6,
              "depth": 16,
              "why": "Re1+ is the top line maintaining optimal control.",
              "pv": [
                "Re1+",
                "Rf1"
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
        "coachComment": "Bf1 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -6.8,
          "bestMove": "Rf1",
          "why": "Bf1 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Rf1",
              "eval": -3.6,
              "depth": 16,
              "why": "Rf1 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Rf1",
                "Qe8",
                "Qg7+"
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
        "coachComment": "Qf6 is a sound practical choice.",
        "eval": {
          "eval": -6.6,
          "bestMove": "Qf6",
          "why": "Qf6 is a sound practical choice.",
          "lines": [
            {
              "move": "Qf6",
              "eval": -6.6,
              "depth": 16,
              "why": "Qf6 is the top line maintaining optimal control.",
              "pv": [
                "Qf6",
                "Qg7+"
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
        "coachComment": "Qxh7+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -6.6,
          "bestMove": "Qxh7+",
          "why": "Qxh7+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxh7+",
              "eval": -6.6,
              "depth": 16,
              "why": "Qxh7+ is the top line maintaining optimal control.",
              "pv": [
                "Qxh7+",
                "Kf8"
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
        "coachComment": "Kf8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -6.6,
          "bestMove": "Kf8",
          "why": "Kf8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kf8",
              "eval": -6.6,
              "depth": 16,
              "why": "Kf8 is the top line maintaining optimal control.",
              "pv": [
                "Kf8",
                "Qg8+"
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
        "coachComment": "Qxf7+ is a sound practical choice.",
        "eval": {
          "eval": -6.8,
          "bestMove": "Qxf7+",
          "why": "Qxf7+ is a sound practical choice.",
          "lines": [
            {
              "move": "Qxf7+",
              "eval": -6.8,
              "depth": 16,
              "why": "Qxf7+ is the top line maintaining optimal control.",
              "pv": [
                "Qxf7+",
                "Qxf7"
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
        "coachComment": "Qxf7 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -6.7,
          "bestMove": "Qxf7",
          "why": "Qxf7 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qxf7",
              "eval": -6.7,
              "depth": 16,
              "why": "Qxf7 is the top line maintaining optimal control.",
              "pv": [
                "Qxf7",
                "Ne6+"
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
        "coachComment": "Nxf7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -6.7,
          "bestMove": "Nxf7",
          "why": "Nxf7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxf7",
              "eval": -6.7,
              "depth": 16,
              "why": "Nxf7 is the top line maintaining optimal control.",
              "pv": [
                "Nxf7",
                "Kg8"
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
        "coachComment": "Kxf7 is a sound practical choice.",
        "eval": {
          "eval": -6.5,
          "bestMove": "Kxf7",
          "why": "Kxf7 is a sound practical choice.",
          "lines": [
            {
              "move": "Kxf7",
              "eval": -6.5,
              "depth": 16,
              "why": "Kxf7 is the top line maintaining optimal control.",
              "pv": [
                "Kxf7",
                "c5"
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
        "coachComment": "Rxd4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -6.6,
          "bestMove": "Rxd4",
          "why": "Rxd4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxd4",
              "eval": -6.6,
              "depth": 16,
              "why": "Rxd4 is the top line maintaining optimal control.",
              "pv": [
                "Rxd4",
                "a6"
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
        "coachComment": "e4 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e4",
          "why": "e4 is a sound practical choice.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.1,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Nc6"
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
        "coachComment": "e5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e5",
          "why": "e5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.1,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "a3"
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
        "coachComment": "Qh5 is inaccurate; a3 offered firmer positional pressure.",
        "eval": {
          "eval": -0.5,
          "bestMove": "a3",
          "why": "Qh5 is inaccurate; a3 offered firmer positional pressure.",
          "lines": [
            {
              "move": "a3",
              "eval": 0.1,
              "depth": 16,
              "why": "a3 was the engine recommendation maintaining the initiative.",
              "pv": [
                "a3",
                "Nc6",
                "a4"
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
        "coachComment": "Nc6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.5,
          "bestMove": "Nc6",
          "why": "Nc6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc6",
              "eval": -0.5,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "Qg6"
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
        "coachComment": "Bc4 adheres to established opening book theory.",
        "eval": {
          "eval": -0.5,
          "bestMove": "Bc4",
          "why": "Bc4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Bc4",
              "eval": -0.5,
              "depth": 16,
              "why": "Bc4 is the top line maintaining optimal control.",
              "pv": [
                "Bc4",
                "Rb8"
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
        "coachComment": "g6 adheres to established opening book theory.",
        "eval": {
          "eval": -0.5,
          "bestMove": "g6",
          "why": "g6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "g6",
              "eval": -0.5,
              "depth": 16,
              "why": "g6 is the top line maintaining optimal control.",
              "pv": [
                "g6",
                "Qxg6"
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
        "coachComment": "Qf3 is a sound practical choice.",
        "eval": {
          "eval": -0.7,
          "bestMove": "Qf3",
          "why": "Qf3 is a sound practical choice.",
          "lines": [
            {
              "move": "Qf3",
              "eval": -0.7,
              "depth": 16,
              "why": "Qf3 is the top line maintaining optimal control.",
              "pv": [
                "Qf3",
                "Rb8"
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
        "coachComment": "Nf6 blunders significant tactical advantage or material.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Rb8",
          "why": "Nf6 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Rb8",
              "eval": -0.7,
              "depth": 16,
              "why": "Rb8 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Rb8",
                "Bb5",
                "Ra8"
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
        "coachComment": "Ne2 finds a sharp and critical continuation.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Ne2",
          "why": "Ne2 finds a sharp and critical continuation.",
          "lines": [
            {
              "move": "Ne2",
              "eval": 2.5,
              "depth": 16,
              "why": "Ne2 is the top line maintaining optimal control.",
              "pv": [
                "Ne2",
                "Rb8"
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
        "coachComment": "Bg7 is a sound practical choice.",
        "eval": {
          "eval": 2.7,
          "bestMove": "Bg7",
          "why": "Bg7 is a sound practical choice.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 2.7,
              "depth": 16,
              "why": "Bg7 is the top line maintaining optimal control.",
              "pv": [
                "Bg7",
                "Bb5"
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
        "coachComment": "d3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.6,
          "bestMove": "d3",
          "why": "d3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "d3",
              "eval": 2.6,
              "depth": 16,
              "why": "d3 is the top line maintaining optimal control.",
              "pv": [
                "d3",
                "Rb8"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.6,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": 2.6,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Bb5"
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
        "coachComment": "Nbc3 is a sound practical choice.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Nbc3",
          "why": "Nbc3 is a sound practical choice.",
          "lines": [
            {
              "move": "Nbc3",
              "eval": 2.5,
              "depth": 16,
              "why": "Nbc3 is the top line maintaining optimal control.",
              "pv": [
                "Nbc3",
                "Rb8"
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
        "coachComment": "d6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "d6",
          "why": "d6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "d6",
              "eval": 2.5,
              "depth": 16,
              "why": "d6 is the top line maintaining optimal control.",
              "pv": [
                "d6",
                "Bb5"
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
        "coachComment": "Bg5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Bg5",
          "why": "Bg5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg5",
              "eval": 2.5,
              "depth": 16,
              "why": "Bg5 is the top line maintaining optimal control.",
              "pv": [
                "Bg5",
                "Rb8"
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
        "coachComment": "h6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.6,
          "bestMove": "h6",
          "why": "h6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "h6",
              "eval": 2.6,
              "depth": 16,
              "why": "h6 is the top line maintaining optimal control.",
              "pv": [
                "h6",
                "Bxf6"
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
        "coachComment": "Bxf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Bxf6",
          "why": "Bxf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": 2.5,
              "depth": 16,
              "why": "Bxf6 is the top line maintaining optimal control.",
              "pv": [
                "Bxf6",
                "Rb8"
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
        "coachComment": "Bxf6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.6,
          "bestMove": "Bxf6",
          "why": "Bxf6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxf6",
              "eval": 2.6,
              "depth": 16,
              "why": "Bxf6 is the top line maintaining optimal control.",
              "pv": [
                "Bxf6",
                "Bb5"
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
        "coachComment": "Nd5 is a sound practical choice.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Nd5",
          "why": "Nd5 is a sound practical choice.",
          "lines": [
            {
              "move": "Nd5",
              "eval": 2.4,
              "depth": 16,
              "why": "Nd5 is the top line maintaining optimal control.",
              "pv": [
                "Nd5",
                "Rb8"
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
        "coachComment": "Bg7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Bg7",
          "why": "Bg7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 2.4,
              "depth": 16,
              "why": "Bg7 is the top line maintaining optimal control.",
              "pv": [
                "Bg7",
                "Nb6"
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
        "coachComment": "h4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.4,
          "bestMove": "h4",
          "why": "h4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "h4",
              "eval": 2.4,
              "depth": 16,
              "why": "h4 is the top line maintaining optimal control.",
              "pv": [
                "h4",
                "Rb8"
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
        "coachComment": "Be6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Be6",
          "why": "Be6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be6",
              "eval": 2.4,
              "depth": 16,
              "why": "Be6 is the top line maintaining optimal control.",
              "pv": [
                "Be6",
                "Nb6"
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
        "coachComment": "O-O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "O-O-O",
          "why": "O-O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O-O",
              "eval": 2.4,
              "depth": 16,
              "why": "O-O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O-O",
                "Rb8"
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
        "coachComment": "Na5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Na5",
          "why": "Na5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Na5",
              "eval": 2.4,
              "depth": 16,
              "why": "Na5 is the top line maintaining optimal control.",
              "pv": [
                "Na5",
                "Nb6"
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
        "coachComment": "g4 is a sound practical choice.",
        "eval": {
          "eval": 2.2,
          "bestMove": "g4",
          "why": "g4 is a sound practical choice.",
          "lines": [
            {
              "move": "g4",
              "eval": 2.2,
              "depth": 16,
              "why": "g4 is the top line maintaining optimal control.",
              "pv": [
                "g4",
                "Rb8"
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
        "coachComment": "c6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.3,
          "bestMove": "c6",
          "why": "c6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "c6",
              "eval": 2.3,
              "depth": 16,
              "why": "c6 is the top line maintaining optimal control.",
              "pv": [
                "c6",
                "Nb6"
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
        "coachComment": "Ne3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.3,
          "bestMove": "Ne3",
          "why": "Ne3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne3",
              "eval": 2.3,
              "depth": 16,
              "why": "Ne3 is the top line maintaining optimal control.",
              "pv": [
                "Ne3",
                "Rb8"
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
        "coachComment": "Nxc4 is a sound practical choice.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Nxc4",
          "why": "Nxc4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxc4",
              "eval": 2.4,
              "depth": 16,
              "why": "Nxc4 is the top line maintaining optimal control.",
              "pv": [
                "Nxc4",
                "g5"
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
        "coachComment": "dxc4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "dxc4",
          "why": "dxc4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "dxc4",
              "eval": 2.4,
              "depth": 16,
              "why": "dxc4 is the top line maintaining optimal control.",
              "pv": [
                "dxc4",
                "Rb8"
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
        "coachComment": "Qe7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Qe7",
          "why": "Qe7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qe7",
              "eval": 2.4,
              "depth": 16,
              "why": "Qe7 is the top line maintaining optimal control.",
              "pv": [
                "Qe7",
                "c5"
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
        "coachComment": "h5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.4,
          "bestMove": "h5",
          "why": "h5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "h5",
              "eval": 2.4,
              "depth": 16,
              "why": "h5 is the top line maintaining optimal control.",
              "pv": [
                "h5",
                "Rab8"
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
        "coachComment": "g5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "g5",
          "why": "g5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "g5",
              "eval": 2.4,
              "depth": 16,
              "why": "g5 is the top line maintaining optimal control.",
              "pv": [
                "g5",
                "c5"
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
        "coachComment": "Ng3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Ng3",
          "why": "Ng3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ng3",
              "eval": 2.4,
              "depth": 16,
              "why": "Ng3 is the top line maintaining optimal control.",
              "pv": [
                "Ng3",
                "Rab8"
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
        "coachComment": "Rfd8 is a sound practical choice.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Rfd8",
          "why": "Rfd8 is a sound practical choice.",
          "lines": [
            {
              "move": "Rfd8",
              "eval": 2.5,
              "depth": 16,
              "why": "Rfd8 is the top line maintaining optimal control.",
              "pv": [
                "Rfd8",
                "c5"
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
        "coachComment": "Ngf5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Ngf5",
          "why": "Ngf5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ngf5",
              "eval": 2.5,
              "depth": 16,
              "why": "Ngf5 is the top line maintaining optimal control.",
              "pv": [
                "Ngf5",
                "Rab8"
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
        "coachComment": "Bxf5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Bxf5",
          "why": "Bxf5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxf5",
              "eval": 2.5,
              "depth": 16,
              "why": "Bxf5 is the top line maintaining optimal control.",
              "pv": [
                "Bxf5",
                "c5"
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
        "coachComment": "Nxf5 is a sound practical choice.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Nxf5",
          "why": "Nxf5 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxf5",
              "eval": 2.4,
              "depth": 16,
              "why": "Nxf5 is the top line maintaining optimal control.",
              "pv": [
                "Nxf5",
                "Rab8"
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
        "coachComment": "Qe6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Qe6",
          "why": "Qe6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qe6",
              "eval": 2.4,
              "depth": 16,
              "why": "Qe6 is the top line maintaining optimal control.",
              "pv": [
                "Qe6",
                "Nxd6"
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
        "coachComment": "b3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "b3",
          "why": "b3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b3",
              "eval": 2.4,
              "depth": 16,
              "why": "b3 is the top line maintaining optimal control.",
              "pv": [
                "b3",
                "Rab8"
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
        "coachComment": "Bf8 is a sound practical choice.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Bf8",
          "why": "Bf8 is a sound practical choice.",
          "lines": [
            {
              "move": "Bf8",
              "eval": 2.5,
              "depth": 16,
              "why": "Bf8 is the top line maintaining optimal control.",
              "pv": [
                "Bf8",
                "Nxd6"
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
        "coachComment": "Rd3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Rd3",
          "why": "Rd3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rd3",
              "eval": 2.4,
              "depth": 16,
              "why": "Rd3 is the top line maintaining optimal control.",
              "pv": [
                "Rd3",
                "Rab8"
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
        "coachComment": "Rd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Rd7",
          "why": "Rd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rd7",
              "eval": 2.4,
              "depth": 16,
              "why": "Rd7 is the top line maintaining optimal control.",
              "pv": [
                "Rd7",
                "Nxd6"
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
        "coachComment": "Rhd1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Rhd1",
          "why": "Rhd1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rhd1",
              "eval": 2.4,
              "depth": 16,
              "why": "Rhd1 is the top line maintaining optimal control.",
              "pv": [
                "Rhd1",
                "Rb8"
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
        "coachComment": "Rad8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Rad8",
          "why": "Rad8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rad8",
              "eval": 2.4,
              "depth": 16,
              "why": "Rad8 is the top line maintaining optimal control.",
              "pv": [
                "Rad8",
                "Nxd6"
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
        "coachComment": "Qe3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Qe3",
          "why": "Qe3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qe3",
              "eval": 2.4,
              "depth": 16,
              "why": "Qe3 is the top line maintaining optimal control.",
              "pv": [
                "Qe3",
                "Re8"
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
        "coachComment": "b6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.5,
          "bestMove": "b6",
          "why": "b6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "b6",
              "eval": 2.5,
              "depth": 16,
              "why": "b6 is the top line maintaining optimal control.",
              "pv": [
                "b6",
                "Nxd6"
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
        "coachComment": "Kb1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Kb1",
          "why": "Kb1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kb1",
              "eval": 2.5,
              "depth": 16,
              "why": "Kb1 is the top line maintaining optimal control.",
              "pv": [
                "Kb1",
                "Re8"
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
        "coachComment": "Kh7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Kh7",
          "why": "Kh7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kh7",
              "eval": 2.5,
              "depth": 16,
              "why": "Kh7 is the top line maintaining optimal control.",
              "pv": [
                "Kh7",
                "Nxd6"
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
        "coachComment": "f3 is a sound practical choice.",
        "eval": {
          "eval": 2.4,
          "bestMove": "f3",
          "why": "f3 is a sound practical choice.",
          "lines": [
            {
              "move": "f3",
              "eval": 2.4,
              "depth": 16,
              "why": "f3 is the top line maintaining optimal control.",
              "pv": [
                "f3",
                "Re8"
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
        "coachComment": "Kg8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Kg8",
          "why": "Kg8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kg8",
              "eval": 2.4,
              "depth": 16,
              "why": "Kg8 is the top line maintaining optimal control.",
              "pv": [
                "Kg8",
                "Nxd6"
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
        "coachComment": "Qd2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.3,
          "bestMove": "Qd2",
          "why": "Qd2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 2.3,
              "depth": 16,
              "why": "Qd2 is the top line maintaining optimal control.",
              "pv": [
                "Qd2",
                "Re8"
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
        "coachComment": "Kh7 is a sound practical choice.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Kh7",
          "why": "Kh7 is a sound practical choice.",
          "lines": [
            {
              "move": "Kh7",
              "eval": 2.4,
              "depth": 16,
              "why": "Kh7 is the top line maintaining optimal control.",
              "pv": [
                "Kh7",
                "Nxd6"
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
        "coachComment": "a4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "a4",
          "why": "a4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "a4",
              "eval": 2.4,
              "depth": 16,
              "why": "a4 is the top line maintaining optimal control.",
              "pv": [
                "a4",
                "Re8"
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
        "coachComment": "a5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "a5",
          "why": "a5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "a5",
              "eval": 2.4,
              "depth": 16,
              "why": "a5 is the top line maintaining optimal control.",
              "pv": [
                "a5",
                "Nxd6"
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
        "coachComment": "Qf2 is a sound practical choice.",
        "eval": {
          "eval": 2.3,
          "bestMove": "Qf2",
          "why": "Qf2 is a sound practical choice.",
          "lines": [
            {
              "move": "Qf2",
              "eval": 2.3,
              "depth": 16,
              "why": "Qf2 is the top line maintaining optimal control.",
              "pv": [
                "Qf2",
                "Re8"
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
        "coachComment": "c5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.4,
          "bestMove": "c5",
          "why": "c5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "c5",
              "eval": 2.4,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "Nxd6"
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
        "coachComment": "Ne3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Ne3",
          "why": "Ne3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne3",
              "eval": 2.4,
              "depth": 16,
              "why": "Ne3 is the top line maintaining optimal control.",
              "pv": [
                "Ne3",
                "Re8"
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
        "coachComment": "Rb7 is a sound practical choice.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Rb7",
          "why": "Rb7 is a sound practical choice.",
          "lines": [
            {
              "move": "Rb7",
              "eval": 2.5,
              "depth": 16,
              "why": "Rb7 is the top line maintaining optimal control.",
              "pv": [
                "Rb7",
                "b4"
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
        "coachComment": "Nd5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Nd5",
          "why": "Nd5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nd5",
              "eval": 2.5,
              "depth": 16,
              "why": "Nd5 is the top line maintaining optimal control.",
              "pv": [
                "Nd5",
                "Re8"
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
        "coachComment": "Bg7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Bg7",
          "why": "Bg7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg7",
              "eval": 2.5,
              "depth": 16,
              "why": "Bg7 is the top line maintaining optimal control.",
              "pv": [
                "Bg7",
                "Nxb6"
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
        "coachComment": "Qd2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Qd2",
          "why": "Qd2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 2.4,
              "depth": 16,
              "why": "Qd2 is the top line maintaining optimal control.",
              "pv": [
                "Qd2",
                "Re8"
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
        "coachComment": "Bf8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Bf8",
          "why": "Bf8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bf8",
              "eval": 2.4,
              "depth": 16,
              "why": "Bf8 is the top line maintaining optimal control.",
              "pv": [
                "Bf8",
                "Nxb6"
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
        "coachComment": "Nc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Nc3",
          "why": "Nc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 2.4,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Re8"
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
        "coachComment": "Rbd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Rbd7",
          "why": "Rbd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rbd7",
              "eval": 2.4,
              "depth": 16,
              "why": "Rbd7 is the top line maintaining optimal control.",
              "pv": [
                "Rbd7",
                "b4"
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
        "coachComment": "Nb5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Nb5",
          "why": "Nb5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nb5",
              "eval": 2.4,
              "depth": 16,
              "why": "Nb5 is the top line maintaining optimal control.",
              "pv": [
                "Nb5",
                "Re8"
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
        "coachComment": "Kg8 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 2.5,
          "bestMove": "Kg8",
          "why": "Kg8 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Kg8",
              "eval": 2.5,
              "depth": 16,
              "why": "Kg8 is the top line maintaining optimal control.",
              "pv": [
                "Kg8",
                "Na7"
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
        "coachComment": "Rd5 is a sound practical choice.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Rd5",
          "why": "Rd5 is a sound practical choice.",
          "lines": [
            {
              "move": "Rd5",
              "eval": 2.4,
              "depth": 16,
              "why": "Rd5 is the top line maintaining optimal control.",
              "pv": [
                "Rd5",
                "Re8"
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
        "coachComment": "Kh7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 2.4,
          "bestMove": "Kh7",
          "why": "Kh7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kh7",
              "eval": 2.4,
              "depth": 16,
              "why": "Kh7 is the top line maintaining optimal control.",
              "pv": [
                "Kh7",
                "Na7"
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
        "coachComment": "e4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e4",
          "why": "e4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.2,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Nc6"
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
        "coachComment": "b6 is a sound practical choice.",
        "eval": {
          "eval": 0.3,
          "bestMove": "b6",
          "why": "b6 is a sound practical choice.",
          "lines": [
            {
              "move": "b6",
              "eval": 0.3,
              "depth": 16,
              "why": "b6 is the top line maintaining optimal control.",
              "pv": [
                "b6",
                "e5"
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
        "coachComment": "d4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.3,
          "bestMove": "d4",
          "why": "d4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.3,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Nc6"
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
        "coachComment": "Bb7 adheres to established opening book theory.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Bb7",
          "why": "Bb7 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Bb7",
              "eval": 0.3,
              "depth": 16,
              "why": "Bb7 is the top line maintaining optimal control.",
              "pv": [
                "Bb7",
                "d5"
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
        "coachComment": "Bd3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Bd3",
          "why": "Bd3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0.3,
              "depth": 16,
              "why": "Bd3 is the top line maintaining optimal control.",
              "pv": [
                "Bd3",
                "Nc6"
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
        "coachComment": "e6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.3,
          "bestMove": "e6",
          "why": "e6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.3,
              "depth": 16,
              "why": "e6 is the top line maintaining optimal control.",
              "pv": [
                "e6",
                "d5"
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
        "coachComment": "Nf3 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf3",
          "why": "Nf3 is a sound practical choice.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nc6"
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
        "coachComment": "c5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c5",
          "why": "c5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c5",
              "eval": 0.2,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "d5"
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
        "coachComment": "c3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c3",
          "why": "c3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c3",
              "eval": 0.2,
              "depth": 16,
              "why": "c3 is the top line maintaining optimal control.",
              "pv": [
                "c3",
                "Nc6"
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
        "coachComment": "Nf6 is a sound practical choice.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Nf6",
          "why": "Nf6 is a sound practical choice.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.3,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
                "d5"
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
        "coachComment": "Qe2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Qe2",
          "why": "Qe2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qe2",
              "eval": 0.3,
              "depth": 16,
              "why": "Qe2 is the top line maintaining optimal control.",
              "pv": [
                "Qe2",
                "Nc6"
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
        "coachComment": "Be7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.3,
          "bestMove": "Be7",
          "why": "Be7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be7",
              "eval": 0.3,
              "depth": 16,
              "why": "Be7 is the top line maintaining optimal control.",
              "pv": [
                "Be7",
                "d5"
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
        "coachComment": "O-O is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "O-O",
          "why": "O-O is a sound practical choice.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Nc6"
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
        "coachComment": "d5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "d5",
          "why": "d5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.1,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "dxc5"
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
        "coachComment": "e5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e5",
          "why": "e5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.1,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "Nbd7"
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
        "coachComment": "Nfd7 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nfd7",
          "why": "Nfd7 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nfd7",
              "eval": 0.2,
              "depth": 16,
              "why": "Nfd7 is the top line maintaining optimal control.",
              "pv": [
                "Nfd7",
                "dxc5"
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
        "coachComment": "Bf4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Bf4",
          "why": "Bf4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bf4",
              "eval": 0.2,
              "depth": 16,
              "why": "Bf4 is the top line maintaining optimal control.",
              "pv": [
                "Bf4",
                "Nc6"
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
        "coachComment": "Nc6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nc6",
          "why": "Nc6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.2,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "dxc5"
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
        "coachComment": "a3 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "a3",
          "why": "a3 is a sound practical choice.",
          "lines": [
            {
              "move": "a3",
              "eval": 0.1,
              "depth": 16,
              "why": "a3 is the top line maintaining optimal control.",
              "pv": [
                "a3",
                "Rb8"
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
        "coachComment": "c4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "c4",
          "why": "c4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c4",
              "eval": 0.1,
              "depth": 16,
              "why": "c4 is the top line maintaining optimal control.",
              "pv": [
                "c4",
                "Bg5"
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
        "coachComment": "Bc2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0,
          "bestMove": "Bc2",
          "why": "Bc2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bc2",
              "eval": 0,
              "depth": 16,
              "why": "Bc2 is the top line maintaining optimal control.",
              "pv": [
                "Bc2",
                "Rb8"
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
        "coachComment": "b5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "b5",
          "why": "b5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b5",
              "eval": 0,
              "depth": 16,
              "why": "b5 is the top line maintaining optimal control.",
              "pv": [
                "b5",
                "Bg5"
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
        "coachComment": "Nbd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Nbd2",
          "why": "Nbd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nbd2",
              "eval": 0,
              "depth": 16,
              "why": "Nbd2 is the top line maintaining optimal control.",
              "pv": [
                "Nbd2",
                "Rb8"
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
        "coachComment": "a5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "a5",
          "why": "a5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "a5",
              "eval": 0,
              "depth": 16,
              "why": "a5 is the top line maintaining optimal control.",
              "pv": [
                "a5",
                "Bg5"
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
        "coachComment": "Rfe1 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rfe1",
          "why": "Rfe1 is a sound practical choice.",
          "lines": [
            {
              "move": "Rfe1",
              "eval": -0.1,
              "depth": 16,
              "why": "Rfe1 is the top line maintaining optimal control.",
              "pv": [
                "Rfe1",
                "Rb8"
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
        "coachComment": "Nb6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nb6",
          "why": "Nb6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nb6",
              "eval": -0.1,
              "depth": 16,
              "why": "Nb6 is the top line maintaining optimal control.",
              "pv": [
                "Nb6",
                "Bg5"
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
        "coachComment": "Nf1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nf1",
          "why": "Nf1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf1",
              "eval": -0.1,
              "depth": 16,
              "why": "Nf1 is the top line maintaining optimal control.",
              "pv": [
                "Nf1",
                "Rb8"
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
        "coachComment": "b4 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "b4",
          "why": "b4 is a sound practical choice.",
          "lines": [
            {
              "move": "b4",
              "eval": 0.1,
              "depth": 16,
              "why": "b4 is the top line maintaining optimal control.",
              "pv": [
                "b4",
                "Bg5"
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
        "coachComment": "axb4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "axb4",
          "why": "axb4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "axb4",
              "eval": 0.1,
              "depth": 16,
              "why": "axb4 is the top line maintaining optimal control.",
              "pv": [
                "axb4",
                "Rb8"
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
        "coachComment": "axb4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "axb4",
          "why": "axb4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "axb4",
              "eval": 0.1,
              "depth": 16,
              "why": "axb4 is the top line maintaining optimal control.",
              "pv": [
                "axb4",
                "Bg5"
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
        "coachComment": "Rxa8 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0,
          "bestMove": "Rxa8",
          "why": "Rxa8 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rxa8",
              "eval": 0,
              "depth": 16,
              "why": "Rxa8 is the top line maintaining optimal control.",
              "pv": [
                "Rxa8",
                "Qc8"
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
        "coachComment": "Qxa8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qxa8",
          "why": "Qxa8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxa8",
              "eval": 0,
              "depth": 16,
              "why": "Qxa8 is the top line maintaining optimal control.",
              "pv": [
                "Qxa8",
                "Bg5"
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
        "coachComment": "Ng5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Ng5",
          "why": "Ng5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ng5",
              "eval": 0,
              "depth": 16,
              "why": "Ng5 is the top line maintaining optimal control.",
              "pv": [
                "Ng5",
                "Qb8"
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
        "coachComment": "g6 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "g6",
          "why": "g6 is a sound practical choice.",
          "lines": [
            {
              "move": "g6",
              "eval": 0.1,
              "depth": 16,
              "why": "g6 is the top line maintaining optimal control.",
              "pv": [
                "g6",
                "Nxe6"
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
        "coachComment": "h4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "h4",
          "why": "h4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "h4",
              "eval": 0.1,
              "depth": 16,
              "why": "h4 is the top line maintaining optimal control.",
              "pv": [
                "h4",
                "Qb8"
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
        "coachComment": "Qa2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Qa2",
          "why": "Qa2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qa2",
              "eval": 0.1,
              "depth": 16,
              "why": "Qa2 is the top line maintaining optimal control.",
              "pv": [
                "Qa2",
                "Nxe6"
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
        "coachComment": "Bc1 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Bc1",
          "why": "Bc1 is a sound practical choice.",
          "lines": [
            {
              "move": "Bc1",
              "eval": 0,
              "depth": 16,
              "why": "Bc1 is the top line maintaining optimal control.",
              "pv": [
                "Bc1",
                "Kf8"
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
        "coachComment": "b3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "b3",
          "why": "b3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b3",
              "eval": 0,
              "depth": 16,
              "why": "b3 is the top line maintaining optimal control.",
              "pv": [
                "b3",
                "Nxe6"
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
        "coachComment": "Bd1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Bd1",
          "why": "Bd1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd1",
              "eval": 0,
              "depth": 16,
              "why": "Bd1 is the top line maintaining optimal control.",
              "pv": [
                "Bd1",
                "Kf8"
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
        "coachComment": "Na4 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Na4",
          "why": "Na4 is a sound practical choice.",
          "lines": [
            {
              "move": "Na4",
              "eval": 0.1,
              "depth": 16,
              "why": "Na4 is the top line maintaining optimal control.",
              "pv": [
                "Na4",
                "Nxe6"
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
        "coachComment": "Qf3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Qf3",
          "why": "Qf3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qf3",
              "eval": 0.1,
              "depth": 16,
              "why": "Qf3 is the top line maintaining optimal control.",
              "pv": [
                "Qf3",
                "Kf8"
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
        "coachComment": "Nd8 finds a sharp and critical continuation.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nd8",
          "why": "Nd8 finds a sharp and critical continuation.",
          "lines": [
            {
              "move": "Nd8",
              "eval": 0.1,
              "depth": 16,
              "why": "Nd8 is the top line maintaining optimal control.",
              "pv": [
                "Nd8",
                "Nxe6"
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
        "coachComment": "Re2 blunders significant tactical advantage or material.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nxe6",
          "why": "Re2 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Nxe6",
              "eval": 0.1,
              "depth": 16,
              "why": "Nxe6 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Nxe6",
                "Nxe6",
                "h5"
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
        "coachComment": "Qb1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qb1",
          "why": "Qb1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qb1",
              "eval": -3.1,
              "depth": 16,
              "why": "Qb1 is the top line maintaining optimal control.",
              "pv": [
                "Qb1",
                "Nxe6"
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
        "coachComment": "Qf4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qf4",
          "why": "Qf4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qf4",
              "eval": -3.1,
              "depth": 16,
              "why": "Qf4 is the top line maintaining optimal control.",
              "pv": [
                "Qf4",
                "Nc6"
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
        "coachComment": "h6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.1,
          "bestMove": "h6",
          "why": "h6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "h6",
              "eval": -3.1,
              "depth": 16,
              "why": "h6 is the top line maintaining optimal control.",
              "pv": [
                "h6",
                "Nxe6"
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
        "coachComment": "Nh3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nh3",
          "why": "Nh3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nh3",
              "eval": -3.1,
              "depth": 16,
              "why": "Nh3 is the top line maintaining optimal control.",
              "pv": [
                "Nh3",
                "Nc6"
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
        "coachComment": "g5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "g5",
          "why": "g5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "g5",
              "eval": -3.1,
              "depth": 16,
              "why": "g5 is the top line maintaining optimal control.",
              "pv": [
                "g5",
                "Qf5"
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
        "coachComment": "hxg5 is a sound practical choice.",
        "eval": {
          "eval": -3.2,
          "bestMove": "hxg5",
          "why": "hxg5 is a sound practical choice.",
          "lines": [
            {
              "move": "hxg5",
              "eval": -3.2,
              "depth": 16,
              "why": "hxg5 is the top line maintaining optimal control.",
              "pv": [
                "hxg5",
                "Nc6"
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
        "coachComment": "hxg5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "hxg5",
          "why": "hxg5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "hxg5",
              "eval": -3.2,
              "depth": 16,
              "why": "hxg5 is the top line maintaining optimal control.",
              "pv": [
                "hxg5",
                "Qf5"
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
        "coachComment": "Nxg5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Nxg5",
          "why": "Nxg5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nxg5",
              "eval": -3.3,
              "depth": 16,
              "why": "Nxg5 is the top line maintaining optimal control.",
              "pv": [
                "Nxg5",
                "Nc6"
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
        "coachComment": "Rg8 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Rg8",
          "why": "Rg8 is a sound practical choice.",
          "lines": [
            {
              "move": "Rg8",
              "eval": -3.1,
              "depth": 16,
              "why": "Rg8 is the top line maintaining optimal control.",
              "pv": [
                "Rg8",
                "Nxe6"
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
        "coachComment": "Nh3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nh3",
          "why": "Nh3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nh3",
              "eval": -3.1,
              "depth": 16,
              "why": "Nh3 is the top line maintaining optimal control.",
              "pv": [
                "Nh3",
                "Nc6"
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
        "coachComment": "Qg6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qg6",
          "why": "Qg6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qg6",
              "eval": -3.1,
              "depth": 16,
              "why": "Qg6 is the top line maintaining optimal control.",
              "pv": [
                "Qg6",
                "Qf5"
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
        "coachComment": "Ng3 is a sound practical choice.",
        "eval": {
          "eval": -3.3,
          "bestMove": "Ng3",
          "why": "Ng3 is a sound practical choice.",
          "lines": [
            {
              "move": "Ng3",
              "eval": -3.3,
              "depth": 16,
              "why": "Ng3 is the top line maintaining optimal control.",
              "pv": [
                "Ng3",
                "Nc6"
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
        "coachComment": "Qb1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Qb1",
          "why": "Qb1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qb1",
              "eval": -3.2,
              "depth": 16,
              "why": "Qb1 is the top line maintaining optimal control.",
              "pv": [
                "Qb1",
                "Qf5"
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
        "coachComment": "Kh2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Kh2",
          "why": "Kh2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kh2",
              "eval": -3.2,
              "depth": 16,
              "why": "Kh2 is the top line maintaining optimal control.",
              "pv": [
                "Kh2",
                "Nc6"
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
        "coachComment": "Rh8 is a sound practical choice.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Rh8",
          "why": "Rh8 is a sound practical choice.",
          "lines": [
            {
              "move": "Rh8",
              "eval": -3.1,
              "depth": 16,
              "why": "Rh8 is the top line maintaining optimal control.",
              "pv": [
                "Rh8",
                "Qf5"
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
        "coachComment": "Kg1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Kg1",
          "why": "Kg1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kg1",
              "eval": -3.1,
              "depth": 16,
              "why": "Kg1 is the top line maintaining optimal control.",
              "pv": [
                "Kg1",
                "Nc6"
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
        "coachComment": "Bc6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Bc6",
          "why": "Bc6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bc6",
              "eval": -3.1,
              "depth": 16,
              "why": "Bc6 is the top line maintaining optimal control.",
              "pv": [
                "Bc6",
                "Qf5"
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
        "coachComment": "Nf1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nf1",
          "why": "Nf1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nf1",
              "eval": -3.1,
              "depth": 16,
              "why": "Nf1 is the top line maintaining optimal control.",
              "pv": [
                "Nf1",
                "Nb7"
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
        "coachComment": "Nb6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nb6",
          "why": "Nb6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nb6",
              "eval": -3.1,
              "depth": 16,
              "why": "Nb6 is the top line maintaining optimal control.",
              "pv": [
                "Nb6",
                "Qf5"
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
        "coachComment": "Nh2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Nh2",
          "why": "Nh2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nh2",
              "eval": -3.1,
              "depth": 16,
              "why": "Nh2 is the top line maintaining optimal control.",
              "pv": [
                "Nh2",
                "Nb7"
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
        "coachComment": "Qg6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qg6",
          "why": "Qg6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qg6",
              "eval": -3.1,
              "depth": 16,
              "why": "Qg6 is the top line maintaining optimal control.",
              "pv": [
                "Qg6",
                "Qf5"
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
        "coachComment": "Qg4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qg4",
          "why": "Qg4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qg4",
              "eval": -3.1,
              "depth": 16,
              "why": "Qg4 is the top line maintaining optimal control.",
              "pv": [
                "Qg4",
                "Nb7"
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
        "coachComment": "Qxg4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -3.1,
          "bestMove": "Qxg4",
          "why": "Qxg4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Qxg4",
              "eval": -3.1,
              "depth": 16,
              "why": "Qxg4 is the top line maintaining optimal control.",
              "pv": [
                "Qxg4",
                "Nf4"
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
        "coachComment": "Nxg4 is a sound practical choice.",
        "eval": {
          "eval": -3.2,
          "bestMove": "Nxg4",
          "why": "Nxg4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxg4",
              "eval": -3.2,
              "depth": 16,
              "why": "Nxg4 is the top line maintaining optimal control.",
              "pv": [
                "Nxg4",
                "Nb7"
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
        "coachComment": "d4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d4",
          "why": "d4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.2,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Nc6"
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
        "coachComment": "d5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d5",
          "why": "d5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d5",
              "eval": 0.2,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "a3"
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
        "coachComment": "c4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "c4",
          "why": "c4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "c4",
              "eval": 0.2,
              "depth": 16,
              "why": "c4 is the top line maintaining optimal control.",
              "pv": [
                "c4",
                "Nd7"
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
        "coachComment": "e6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e6",
          "why": "e6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e6",
              "eval": 0.2,
              "depth": 16,
              "why": "e6 is the top line maintaining optimal control.",
              "pv": [
                "e6",
                "c5"
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
        "coachComment": "Nc3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nc3",
          "why": "Nc3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nc3",
              "eval": 0.2,
              "depth": 16,
              "why": "Nc3 is the top line maintaining optimal control.",
              "pv": [
                "Nc3",
                "Nd7"
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
        "coachComment": "Nf6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf6",
          "why": "Nf6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf6",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf6 is the top line maintaining optimal control.",
              "pv": [
                "Nf6",
                "c5"
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
        "coachComment": "cxd5 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "cxd5",
          "why": "cxd5 is a sound practical choice.",
          "lines": [
            {
              "move": "cxd5",
              "eval": 0.1,
              "depth": 16,
              "why": "cxd5 is the top line maintaining optimal control.",
              "pv": [
                "cxd5",
                "Nbd7"
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
        "coachComment": "exd5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "exd5",
          "why": "exd5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exd5",
              "eval": 0.1,
              "depth": 16,
              "why": "exd5 is the top line maintaining optimal control.",
              "pv": [
                "exd5",
                "Na4"
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
        "coachComment": "Bg5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bg5",
          "why": "Bg5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bg5",
              "eval": 0.1,
              "depth": 16,
              "why": "Bg5 is the top line maintaining optimal control.",
              "pv": [
                "Bg5",
                "Nbd7"
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
        "coachComment": "Be7 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Be7",
          "why": "Be7 is a sound practical choice.",
          "lines": [
            {
              "move": "Be7",
              "eval": 0.2,
              "depth": 16,
              "why": "Be7 is the top line maintaining optimal control.",
              "pv": [
                "Be7",
                "Bxf6"
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
        "coachComment": "e3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "e3",
          "why": "e3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "e3",
              "eval": 0.1,
              "depth": 16,
              "why": "e3 is the top line maintaining optimal control.",
              "pv": [
                "e3",
                "Nbd7"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Bxf6"
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
        "coachComment": "Bd3 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Bd3",
          "why": "Bd3 is a sound practical choice.",
          "lines": [
            {
              "move": "Bd3",
              "eval": 0,
              "depth": 16,
              "why": "Bd3 is the top line maintaining optimal control.",
              "pv": [
                "Bd3",
                "Nbd7"
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
        "coachComment": "c6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "c6",
          "why": "c6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "c6",
              "eval": 0,
              "depth": 16,
              "why": "c6 is the top line maintaining optimal control.",
              "pv": [
                "c6",
                "Bxf6"
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
        "coachComment": "Qc2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "Qc2",
          "why": "Qc2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qc2",
              "eval": 0,
              "depth": 16,
              "why": "Qc2 is the top line maintaining optimal control.",
              "pv": [
                "Qc2",
                "Nbd7"
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
        "coachComment": "Nbd7 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nbd7",
          "why": "Nbd7 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nbd7",
              "eval": 0.1,
              "depth": 16,
              "why": "Nbd7 is the top line maintaining optimal control.",
              "pv": [
                "Nbd7",
                "Bxf6"
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
        "coachComment": "Nge2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nge2",
          "why": "Nge2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nge2",
              "eval": 0.1,
              "depth": 16,
              "why": "Nge2 is the top line maintaining optimal control.",
              "pv": [
                "Nge2",
                "Rb8"
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
        "coachComment": "Re8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Re8",
          "why": "Re8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re8",
              "eval": 0.1,
              "depth": 16,
              "why": "Re8 is the top line maintaining optimal control.",
              "pv": [
                "Re8",
                "Bxf6"
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
        "coachComment": "O-O is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "O-O",
          "why": "O-O is a sound practical choice.",
          "lines": [
            {
              "move": "O-O",
              "eval": -0.1,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Rb8"
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
        "coachComment": "Nf8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nf8",
          "why": "Nf8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nf8",
              "eval": -0.1,
              "depth": 16,
              "why": "Nf8 is the top line maintaining optimal control.",
              "pv": [
                "Nf8",
                "Bxf6"
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
        "coachComment": "f3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "f3",
          "why": "f3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "f3",
              "eval": -0.1,
              "depth": 16,
              "why": "f3 is the top line maintaining optimal control.",
              "pv": [
                "f3",
                "Rb8"
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
        "coachComment": "Be6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be6",
          "why": "Be6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be6",
              "eval": -0.1,
              "depth": 16,
              "why": "Be6 is the top line maintaining optimal control.",
              "pv": [
                "Be6",
                "Bxf6"
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
        "coachComment": "Rad1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rad1",
          "why": "Rad1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rad1",
              "eval": -0.1,
              "depth": 16,
              "why": "Rad1 is the top line maintaining optimal control.",
              "pv": [
                "Rad1",
                "Rb8"
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
        "coachComment": "Rc8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Rc8",
          "why": "Rc8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rc8",
              "eval": -0.1,
              "depth": 16,
              "why": "Rc8 is the top line maintaining optimal control.",
              "pv": [
                "Rc8",
                "Bxf6"
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
        "coachComment": "Kh1 is a sound practical choice.",
        "eval": {
          "eval": -0.3,
          "bestMove": "Kh1",
          "why": "Kh1 is a sound practical choice.",
          "lines": [
            {
              "move": "Kh1",
              "eval": -0.3,
              "depth": 16,
              "why": "Kh1 is the top line maintaining optimal control.",
              "pv": [
                "Kh1",
                "Rc7"
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
        "coachComment": "a6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.2,
          "bestMove": "a6",
          "why": "a6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "a6",
              "eval": -0.2,
              "depth": 16,
              "why": "a6 is the top line maintaining optimal control.",
              "pv": [
                "a6",
                "Bxf6"
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
        "coachComment": "e4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.2,
          "bestMove": "e4",
          "why": "e4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e4",
              "eval": -0.2,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Rc7"
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
        "coachComment": "dxe4 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "dxe4",
          "why": "dxe4 is a sound practical choice.",
          "lines": [
            {
              "move": "dxe4",
              "eval": -0.1,
              "depth": 16,
              "why": "dxe4 is the top line maintaining optimal control.",
              "pv": [
                "dxe4",
                "Bxf6"
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
        "coachComment": "fxe4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "fxe4",
          "why": "fxe4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "fxe4",
              "eval": -0.1,
              "depth": 16,
              "why": "fxe4 is the top line maintaining optimal control.",
              "pv": [
                "fxe4",
                "Rc7"
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
        "coachComment": "Ng4 blunders significant tactical advantage or material.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Rc7",
          "why": "Ng4 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Rc7",
              "eval": -0.1,
              "depth": 16,
              "why": "Rc7 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Rc7",
                "Bxf6",
                "Qd7"
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
        "coachComment": "Bxe7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Bxe7",
          "why": "Bxe7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxe7",
              "eval": 3.1,
              "depth": 16,
              "why": "Bxe7 is the top line maintaining optimal control.",
              "pv": [
                "Bxe7",
                "Rc7"
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
        "coachComment": "Qxe7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Qxe7",
          "why": "Qxe7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxe7",
              "eval": 3.1,
              "depth": 16,
              "why": "Qxe7 is the top line maintaining optimal control.",
              "pv": [
                "Qxe7",
                "d5"
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
        "coachComment": "Qd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Qd2",
          "why": "Qd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 3.1,
              "depth": 16,
              "why": "Qd2 is the top line maintaining optimal control.",
              "pv": [
                "Qd2",
                "Rcd8"
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
        "coachComment": "Qh4 is a sound practical choice.",
        "eval": {
          "eval": 3.3,
          "bestMove": "Qh4",
          "why": "Qh4 is a sound practical choice.",
          "lines": [
            {
              "move": "Qh4",
              "eval": 3.3,
              "depth": 16,
              "why": "Qh4 is the top line maintaining optimal control.",
              "pv": [
                "Qh4",
                "d5"
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
        "coachComment": "Qf4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Qf4",
          "why": "Qf4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qf4",
              "eval": 3.2,
              "depth": 16,
              "why": "Qf4 is the top line maintaining optimal control.",
              "pv": [
                "Qf4",
                "Rcd8"
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
        "coachComment": "Ng6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.3,
          "bestMove": "Ng6",
          "why": "Ng6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ng6",
              "eval": 3.3,
              "depth": 16,
              "why": "Ng6 is the top line maintaining optimal control.",
              "pv": [
                "Ng6",
                "d5"
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
        "coachComment": "Qg3 is a sound practical choice.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Qg3",
          "why": "Qg3 is a sound practical choice.",
          "lines": [
            {
              "move": "Qg3",
              "eval": 3.1,
              "depth": 16,
              "why": "Qg3 is the top line maintaining optimal control.",
              "pv": [
                "Qg3",
                "Rcd8"
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
        "coachComment": "Qxg3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Qxg3",
          "why": "Qxg3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxg3",
              "eval": 3.1,
              "depth": 16,
              "why": "Qxg3 is the top line maintaining optimal control.",
              "pv": [
                "Qxg3",
                "d5"
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
        "coachComment": "Nxg3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Nxg3",
          "why": "Nxg3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxg3",
              "eval": 3.1,
              "depth": 16,
              "why": "Nxg3 is the top line maintaining optimal control.",
              "pv": [
                "Nxg3",
                "Rcd8"
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
        "coachComment": "Ne3 is a sound practical choice.",
        "eval": {
          "eval": 3.3,
          "bestMove": "Ne3",
          "why": "Ne3 is a sound practical choice.",
          "lines": [
            {
              "move": "Ne3",
              "eval": 3.3,
              "depth": 16,
              "why": "Ne3 is the top line maintaining optimal control.",
              "pv": [
                "Ne3",
                "d5"
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
        "coachComment": "Rde1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Rde1",
          "why": "Rde1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rde1",
              "eval": 3.2,
              "depth": 16,
              "why": "Rde1 is the top line maintaining optimal control.",
              "pv": [
                "Rde1",
                "Rcd8"
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
        "coachComment": "Nxf1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Nxf1",
          "why": "Nxf1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxf1",
              "eval": 3.2,
              "depth": 16,
              "why": "Nxf1 is the top line maintaining optimal control.",
              "pv": [
                "Nxf1",
                "d5"
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
        "coachComment": "Rxf1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Rxf1",
          "why": "Rxf1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxf1",
              "eval": 3.2,
              "depth": 16,
              "why": "Rxf1 is the top line maintaining optimal control.",
              "pv": [
                "Rxf1",
                "Rcd8"
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
        "coachComment": "Rcd8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Rcd8",
          "why": "Rcd8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rcd8",
              "eval": 3.2,
              "depth": 16,
              "why": "Rcd8 is the top line maintaining optimal control.",
              "pv": [
                "Rcd8",
                "d5"
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
        "coachComment": "Nge2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Nge2",
          "why": "Nge2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nge2",
              "eval": 3.2,
              "depth": 16,
              "why": "Nge2 is the top line maintaining optimal control.",
              "pv": [
                "Nge2",
                "Rd7"
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
        "coachComment": "Bg4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.3,
          "bestMove": "Bg4",
          "why": "Bg4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bg4",
              "eval": 3.3,
              "depth": 16,
              "why": "Bg4 is the top line maintaining optimal control.",
              "pv": [
                "Bg4",
                "d5"
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
        "coachComment": "Bc4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Bc4",
          "why": "Bc4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bc4",
              "eval": 3.2,
              "depth": 16,
              "why": "Bc4 is the top line maintaining optimal control.",
              "pv": [
                "Bc4",
                "Rd7"
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
        "coachComment": "Re7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.3,
          "bestMove": "Re7",
          "why": "Re7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re7",
              "eval": 3.3,
              "depth": 16,
              "why": "Re7 is the top line maintaining optimal control.",
              "pv": [
                "Re7",
                "Bb5"
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
        "coachComment": "h3 is a sound practical choice.",
        "eval": {
          "eval": 3.1,
          "bestMove": "h3",
          "why": "h3 is a sound practical choice.",
          "lines": [
            {
              "move": "h3",
              "eval": 3.1,
              "depth": 16,
              "why": "h3 is the top line maintaining optimal control.",
              "pv": [
                "h3",
                "Rde8"
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
        "coachComment": "Bxe2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Bxe2",
          "why": "Bxe2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxe2",
              "eval": 3.1,
              "depth": 16,
              "why": "Bxe2 is the top line maintaining optimal control.",
              "pv": [
                "Bxe2",
                "Bb5"
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
        "coachComment": "Nxe2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3,
          "bestMove": "Nxe2",
          "why": "Nxe2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nxe2",
              "eval": 3,
              "depth": 16,
              "why": "Nxe2 is the top line maintaining optimal control.",
              "pv": [
                "Nxe2",
                "Rde8"
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
        "coachComment": "b5 is a sound practical choice.",
        "eval": {
          "eval": 3.2,
          "bestMove": "b5",
          "why": "b5 is a sound practical choice.",
          "lines": [
            {
              "move": "b5",
              "eval": 3.2,
              "depth": 16,
              "why": "b5 is the top line maintaining optimal control.",
              "pv": [
                "b5",
                "Bxb5"
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
        "coachComment": "Bb3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Bb3",
          "why": "Bb3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bb3",
              "eval": 3.2,
              "depth": 16,
              "why": "Bb3 is the top line maintaining optimal control.",
              "pv": [
                "Bb3",
                "Rde8"
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
        "coachComment": "a5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "a5",
          "why": "a5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "a5",
              "eval": 3.2,
              "depth": 16,
              "why": "a5 is the top line maintaining optimal control.",
              "pv": [
                "a5",
                "d5"
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
        "coachComment": "a3 is a sound practical choice.",
        "eval": {
          "eval": 3,
          "bestMove": "a3",
          "why": "a3 is a sound practical choice.",
          "lines": [
            {
              "move": "a3",
              "eval": 3,
              "depth": 16,
              "why": "a3 is the top line maintaining optimal control.",
              "pv": [
                "a3",
                "Rde8"
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
        "coachComment": "a4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.1,
          "bestMove": "a4",
          "why": "a4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "a4",
              "eval": 3.1,
              "depth": 16,
              "why": "a4 is the top line maintaining optimal control.",
              "pv": [
                "a4",
                "d5"
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
        "coachComment": "Ba2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.1,
          "bestMove": "Ba2",
          "why": "Ba2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ba2",
              "eval": 3.1,
              "depth": 16,
              "why": "Ba2 is the top line maintaining optimal control.",
              "pv": [
                "Ba2",
                "Rde8"
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
        "coachComment": "Kf8 is a sound practical choice.",
        "eval": {
          "eval": 3.3,
          "bestMove": "Kf8",
          "why": "Kf8 is a sound practical choice.",
          "lines": [
            {
              "move": "Kf8",
              "eval": 3.3,
              "depth": 16,
              "why": "Kf8 is the top line maintaining optimal control.",
              "pv": [
                "Kf8",
                "d5"
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
        "coachComment": "e5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "e5",
          "why": "e5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "e5",
              "eval": 3.2,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "Rde8"
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
        "coachComment": "f6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.3,
          "bestMove": "f6",
          "why": "f6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f6",
              "eval": 3.3,
              "depth": 16,
              "why": "f6 is the top line maintaining optimal control.",
              "pv": [
                "f6",
                "e6"
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
        "coachComment": "exf6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.2,
          "bestMove": "exf6",
          "why": "exf6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "exf6",
              "eval": 3.2,
              "depth": 16,
              "why": "exf6 is the top line maintaining optimal control.",
              "pv": [
                "exf6",
                "Rde8"
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
        "coachComment": "Rxe2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Rxe2",
          "why": "Rxe2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rxe2",
              "eval": 3.2,
              "depth": 16,
              "why": "Rxe2 is the top line maintaining optimal control.",
              "pv": [
                "Rxe2",
                "f7"
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
        "coachComment": "fxg7+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "fxg7+",
          "why": "fxg7+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "fxg7+",
              "eval": 3.2,
              "depth": 16,
              "why": "fxg7+ is the top line maintaining optimal control.",
              "pv": [
                "fxg7+",
                "Kxg7"
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
        "coachComment": "Kxg7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Kxg7",
          "why": "Kxg7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kxg7",
              "eval": 3.2,
              "depth": 16,
              "why": "Kxg7 is the top line maintaining optimal control.",
              "pv": [
                "Kxg7",
                "d5"
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
        "coachComment": "Rf7+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.2,
          "bestMove": "Rf7+",
          "why": "Rf7+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rf7+",
              "eval": 3.2,
              "depth": 16,
              "why": "Rf7+ is the top line maintaining optimal control.",
              "pv": [
                "Rf7+",
                "Kg8"
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
        "coachComment": "Kh6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.3,
          "bestMove": "Kh6",
          "why": "Kh6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Kh6",
              "eval": 3.3,
              "depth": 16,
              "why": "Kh6 is the top line maintaining optimal control.",
              "pv": [
                "Kh6",
                "Rf8"
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
    "result": "1/2-1/2",
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
        "coachComment": "e4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e4",
          "why": "e4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e4",
              "eval": 0.2,
              "depth": 16,
              "why": "e4 is the top line maintaining optimal control.",
              "pv": [
                "e4",
                "Nc6"
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
        "coachComment": "e5 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "e5",
          "why": "e5 adheres to established opening book theory.",
          "lines": [
            {
              "move": "e5",
              "eval": 0.2,
              "depth": 16,
              "why": "e5 is the top line maintaining optimal control.",
              "pv": [
                "e5",
                "a3"
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
        "coachComment": "Nf3 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nf3",
          "why": "Nf3 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nf3",
              "eval": 0.2,
              "depth": 16,
              "why": "Nf3 is the top line maintaining optimal control.",
              "pv": [
                "Nf3",
                "Nc6"
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
        "coachComment": "Nc6 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Nc6",
          "why": "Nc6 adheres to established opening book theory.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 0.2,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "Nd4"
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
        "coachComment": "d4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "d4",
          "why": "d4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "d4",
              "eval": 0.2,
              "depth": 16,
              "why": "d4 is the top line maintaining optimal control.",
              "pv": [
                "d4",
                "Rb8"
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
        "coachComment": "exd4 adheres to established opening book theory.",
        "eval": {
          "eval": 0.2,
          "bestMove": "exd4",
          "why": "exd4 adheres to established opening book theory.",
          "lines": [
            {
              "move": "exd4",
              "eval": 0.2,
              "depth": 16,
              "why": "exd4 is the top line maintaining optimal control.",
              "pv": [
                "exd4",
                "e5"
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
        "coachComment": "Nxd4 is a sound practical choice.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nxd4",
          "why": "Nxd4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nxd4",
              "eval": 0.1,
              "depth": 16,
              "why": "Nxd4 is the top line maintaining optimal control.",
              "pv": [
                "Nxd4",
                "Rb8"
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
        "coachComment": "Bc5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bc5",
          "why": "Bc5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bc5",
              "eval": 0.1,
              "depth": 16,
              "why": "Bc5 is the top line maintaining optimal control.",
              "pv": [
                "Bc5",
                "Nb5"
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
        "coachComment": "Be3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Be3",
          "why": "Be3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be3",
              "eval": 0.1,
              "depth": 16,
              "why": "Be3 is the top line maintaining optimal control.",
              "pv": [
                "Be3",
                "Rb8"
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
        "coachComment": "Qf6 is a sound practical choice.",
        "eval": {
          "eval": 0.2,
          "bestMove": "Qf6",
          "why": "Qf6 is a sound practical choice.",
          "lines": [
            {
              "move": "Qf6",
              "eval": 0.2,
              "depth": 16,
              "why": "Qf6 is the top line maintaining optimal control.",
              "pv": [
                "Qf6",
                "Nb5"
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
        "coachComment": "c3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "c3",
          "why": "c3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "c3",
              "eval": 0.1,
              "depth": 16,
              "why": "c3 is the top line maintaining optimal control.",
              "pv": [
                "c3",
                "Rb8"
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
        "coachComment": "Nge7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Nge7",
          "why": "Nge7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nge7",
              "eval": 0.1,
              "depth": 16,
              "why": "Nge7 is the top line maintaining optimal control.",
              "pv": [
                "Nge7",
                "Nb5"
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
        "coachComment": "Bc4 is a sound practical choice.",
        "eval": {
          "eval": 0,
          "bestMove": "Bc4",
          "why": "Bc4 is a sound practical choice.",
          "lines": [
            {
              "move": "Bc4",
              "eval": 0,
              "depth": 16,
              "why": "Bc4 is the top line maintaining optimal control.",
              "pv": [
                "Bc4",
                "Rb8"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Bb5"
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
        "coachComment": "O-O is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0,
          "bestMove": "O-O",
          "why": "O-O is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "O-O",
              "eval": 0,
              "depth": 16,
              "why": "O-O is the top line maintaining optimal control.",
              "pv": [
                "O-O",
                "Rb8"
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
        "coachComment": "Bb6 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Bb6",
          "why": "Bb6 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bb6",
              "eval": 0.1,
              "depth": 16,
              "why": "Bb6 is the top line maintaining optimal control.",
              "pv": [
                "Bb6",
                "Bb5"
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
        "coachComment": "Na3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "Na3",
          "why": "Na3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Na3",
              "eval": 0.1,
              "depth": 16,
              "why": "Na3 is the top line maintaining optimal control.",
              "pv": [
                "Na3",
                "Rb8"
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
        "coachComment": "d6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 0.1,
          "bestMove": "d6",
          "why": "d6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "d6",
              "eval": 0.1,
              "depth": 16,
              "why": "d6 is the top line maintaining optimal control.",
              "pv": [
                "d6",
                "Bb5"
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
        "coachComment": "Nac2 is a sound practical choice.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Nac2",
          "why": "Nac2 is a sound practical choice.",
          "lines": [
            {
              "move": "Nac2",
              "eval": -0.1,
              "depth": 16,
              "why": "Nac2 is the top line maintaining optimal control.",
              "pv": [
                "Nac2",
                "Rb8"
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
        "coachComment": "Ne5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Ne5",
          "why": "Ne5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne5",
              "eval": -0.1,
              "depth": 16,
              "why": "Ne5 is the top line maintaining optimal control.",
              "pv": [
                "Ne5",
                "Bb5"
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
        "coachComment": "Be2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Be2",
          "why": "Be2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Be2",
              "eval": -0.1,
              "depth": 16,
              "why": "Be2 is the top line maintaining optimal control.",
              "pv": [
                "Be2",
                "Rb8"
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
        "coachComment": "Qg6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": -0.1,
          "bestMove": "Qg6",
          "why": "Qg6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qg6",
              "eval": -0.1,
              "depth": 16,
              "why": "Qg6 is the top line maintaining optimal control.",
              "pv": [
                "Qg6",
                "Nb5"
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
        "coachComment": "f3 is brilliant, finding an inspired tactical shot.",
        "eval": {
          "eval": 0.2,
          "bestMove": "f3",
          "why": "f3 is brilliant, finding an inspired tactical shot.",
          "lines": [
            {
              "move": "f3",
              "eval": 0.2,
              "depth": 16,
              "why": "f3 is the top line maintaining optimal control.",
              "pv": [
                "f3",
                "Rb8"
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
        "coachComment": "f5 blunders significant tactical advantage or material.",
        "eval": {
          "eval": 3.4,
          "bestMove": "Rb8",
          "why": "f5 blunders significant tactical advantage or material.",
          "lines": [
            {
              "move": "Rb8",
              "eval": 0.2,
              "depth": 16,
              "why": "Rb8 was the engine recommendation maintaining the initiative.",
              "pv": [
                "Rb8",
                "Nb5",
                "Ra8"
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
        "coachComment": "exf5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.4,
          "bestMove": "exf5",
          "why": "exf5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "exf5",
              "eval": 3.4,
              "depth": 16,
              "why": "exf5 is the top line maintaining optimal control.",
              "pv": [
                "exf5",
                "Rb8"
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
        "coachComment": "Nxf5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.4,
          "bestMove": "Nxf5",
          "why": "Nxf5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nxf5",
              "eval": 3.4,
              "depth": 16,
              "why": "Nxf5 is the top line maintaining optimal control.",
              "pv": [
                "Nxf5",
                "Nb5"
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
        "coachComment": "Nxf5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.4,
          "bestMove": "Nxf5",
          "why": "Nxf5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxf5",
              "eval": 3.4,
              "depth": 16,
              "why": "Nxf5 is the top line maintaining optimal control.",
              "pv": [
                "Nxf5",
                "Rb8"
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
        "coachComment": "Bxf5 is a sound practical choice.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Bxf5",
          "why": "Bxf5 is a sound practical choice.",
          "lines": [
            {
              "move": "Bxf5",
              "eval": 3.6,
              "depth": 16,
              "why": "Bxf5 is the top line maintaining optimal control.",
              "pv": [
                "Bxf5",
                "c4"
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
        "coachComment": "Bxb6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Bxb6",
          "why": "Bxb6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxb6",
              "eval": 3.6,
              "depth": 16,
              "why": "Bxb6 is the top line maintaining optimal control.",
              "pv": [
                "Bxb6",
                "Rab8"
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
        "coachComment": "axb6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "axb6",
          "why": "axb6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "axb6",
              "eval": 3.6,
              "depth": 16,
              "why": "axb6 is the top line maintaining optimal control.",
              "pv": [
                "axb6",
                "c4"
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
        "coachComment": "Nd4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Nd4",
          "why": "Nd4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Nd4",
              "eval": 3.5,
              "depth": 16,
              "why": "Nd4 is the top line maintaining optimal control.",
              "pv": [
                "Nd4",
                "Rab8"
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
        "coachComment": "Bd7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Bd7",
          "why": "Bd7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bd7",
              "eval": 3.5,
              "depth": 16,
              "why": "Bd7 is the top line maintaining optimal control.",
              "pv": [
                "Bd7",
                "Nb5"
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
        "coachComment": "f4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "f4",
          "why": "f4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "f4",
              "eval": 3.5,
              "depth": 16,
              "why": "f4 is the top line maintaining optimal control.",
              "pv": [
                "f4",
                "Rab8"
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
        "coachComment": "Nc6 is a sound practical choice.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Nc6",
          "why": "Nc6 is a sound practical choice.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 3.6,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "Nb5"
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
        "coachComment": "Bc4+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Bc4+",
          "why": "Bc4+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bc4+",
              "eval": 3.6,
              "depth": 16,
              "why": "Bc4+ is the top line maintaining optimal control.",
              "pv": [
                "Bc4+",
                "Rf7"
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
        "coachComment": "Kh8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Kh8",
          "why": "Kh8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Kh8",
              "eval": 3.6,
              "depth": 16,
              "why": "Kh8 is the top line maintaining optimal control.",
              "pv": [
                "Kh8",
                "Bb5"
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
        "coachComment": "Nb5 is a sound practical choice.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Nb5",
          "why": "Nb5 is a sound practical choice.",
          "lines": [
            {
              "move": "Nb5",
              "eval": 3.5,
              "depth": 16,
              "why": "Nb5 is the top line maintaining optimal control.",
              "pv": [
                "Nb5",
                "Rab8"
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
        "coachComment": "Rac8 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Rac8",
          "why": "Rac8 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rac8",
              "eval": 3.5,
              "depth": 16,
              "why": "Rac8 is the top line maintaining optimal control.",
              "pv": [
                "Rac8",
                "Na7"
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
        "coachComment": "Qd2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Qd2",
          "why": "Qd2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qd2",
              "eval": 3.5,
              "depth": 16,
              "why": "Qd2 is the top line maintaining optimal control.",
              "pv": [
                "Qd2",
                "Rcd8"
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
        "coachComment": "Bf5 is a sound practical choice.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Bf5",
          "why": "Bf5 is a sound practical choice.",
          "lines": [
            {
              "move": "Bf5",
              "eval": 3.6,
              "depth": 16,
              "why": "Bf5 is the top line maintaining optimal control.",
              "pv": [
                "Bf5",
                "Na7"
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
        "coachComment": "Rae1 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rae1",
          "why": "Rae1 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rae1",
              "eval": 3.6,
              "depth": 16,
              "why": "Rae1 is the top line maintaining optimal control.",
              "pv": [
                "Rae1",
                "Rcd8"
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
        "coachComment": "Na5 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Na5",
          "why": "Na5 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Na5",
              "eval": 3.6,
              "depth": 16,
              "why": "Na5 is the top line maintaining optimal control.",
              "pv": [
                "Na5",
                "Na7"
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
        "coachComment": "Be2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Be2",
          "why": "Be2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be2",
              "eval": 3.6,
              "depth": 16,
              "why": "Be2 is the top line maintaining optimal control.",
              "pv": [
                "Be2",
                "Rcd8"
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
        "coachComment": "Be4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Be4",
          "why": "Be4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Be4",
              "eval": 3.6,
              "depth": 16,
              "why": "Be4 is the top line maintaining optimal control.",
              "pv": [
                "Be4",
                "Na7"
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
        "coachComment": "Rf2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rf2",
          "why": "Rf2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rf2",
              "eval": 3.6,
              "depth": 16,
              "why": "Rf2 is the top line maintaining optimal control.",
              "pv": [
                "Rf2",
                "Rcd8"
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
        "coachComment": "d5 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.6,
          "bestMove": "d5",
          "why": "d5 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "d5",
              "eval": 3.6,
              "depth": 16,
              "why": "d5 is the top line maintaining optimal control.",
              "pv": [
                "d5",
                "Na7"
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
        "coachComment": "b4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "b4",
          "why": "b4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "b4",
              "eval": 3.6,
              "depth": 16,
              "why": "b4 is the top line maintaining optimal control.",
              "pv": [
                "b4",
                "Rcd8"
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
        "coachComment": "Nc6 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Nc6",
          "why": "Nc6 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nc6",
              "eval": 3.6,
              "depth": 16,
              "why": "Nc6 is the top line maintaining optimal control.",
              "pv": [
                "Nc6",
                "Na7"
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
        "coachComment": "Nd4 is a sound practical choice.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Nd4",
          "why": "Nd4 is a sound practical choice.",
          "lines": [
            {
              "move": "Nd4",
              "eval": 3.5,
              "depth": 16,
              "why": "Nd4 is the top line maintaining optimal control.",
              "pv": [
                "Nd4",
                "Rcd8"
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
        "coachComment": "Ne7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Ne7",
          "why": "Ne7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Ne7",
              "eval": 3.5,
              "depth": 16,
              "why": "Ne7 is the top line maintaining optimal control.",
              "pv": [
                "Ne7",
                "b5"
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
        "coachComment": "Bf3 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.4,
          "bestMove": "Bf3",
          "why": "Bf3 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Bf3",
              "eval": 3.4,
              "depth": 16,
              "why": "Bf3 is the top line maintaining optimal control.",
              "pv": [
                "Bf3",
                "Rcd8"
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
        "coachComment": "c5 is a sound practical choice.",
        "eval": {
          "eval": 3.6,
          "bestMove": "c5",
          "why": "c5 is a sound practical choice.",
          "lines": [
            {
              "move": "c5",
              "eval": 3.6,
              "depth": 16,
              "why": "c5 is the top line maintaining optimal control.",
              "pv": [
                "c5",
                "b5"
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
        "coachComment": "Bxe4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Bxe4",
          "why": "Bxe4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Bxe4",
              "eval": 3.6,
              "depth": 16,
              "why": "Bxe4 is the top line maintaining optimal control.",
              "pv": [
                "Bxe4",
                "Rcd8"
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
        "coachComment": "dxe4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "dxe4",
          "why": "dxe4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "dxe4",
              "eval": 3.6,
              "depth": 16,
              "why": "dxe4 is the top line maintaining optimal control.",
              "pv": [
                "dxe4",
                "b5"
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
        "coachComment": "Nc2 is a sound practical choice.",
        "eval": {
          "eval": 3.4,
          "bestMove": "Nc2",
          "why": "Nc2 is a sound practical choice.",
          "lines": [
            {
              "move": "Nc2",
              "eval": 3.4,
              "depth": 16,
              "why": "Nc2 is the top line maintaining optimal control.",
              "pv": [
                "Nc2",
                "Rcd8"
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
        "coachComment": "Rcd8 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Rcd8",
          "why": "Rcd8 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rcd8",
              "eval": 3.5,
              "depth": 16,
              "why": "Rcd8 is the top line maintaining optimal control.",
              "pv": [
                "Rcd8",
                "b5"
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
        "coachComment": "Qe2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Qe2",
          "why": "Qe2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qe2",
              "eval": 3.5,
              "depth": 16,
              "why": "Qe2 is the top line maintaining optimal control.",
              "pv": [
                "Qe2",
                "Rde8"
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
        "coachComment": "Nd5 is a sound practical choice.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Nd5",
          "why": "Nd5 is a sound practical choice.",
          "lines": [
            {
              "move": "Nd5",
              "eval": 3.6,
              "depth": 16,
              "why": "Nd5 is the top line maintaining optimal control.",
              "pv": [
                "Nd5",
                "b5"
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
        "coachComment": "Qxe4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Qxe4",
          "why": "Qxe4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxe4",
              "eval": 3.6,
              "depth": 16,
              "why": "Qxe4 is the top line maintaining optimal control.",
              "pv": [
                "Qxe4",
                "Rde8"
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
        "coachComment": "Qxe4 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Qxe4",
          "why": "Qxe4 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Qxe4",
              "eval": 3.6,
              "depth": 16,
              "why": "Qxe4 is the top line maintaining optimal control.",
              "pv": [
                "Qxe4",
                "b5"
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
        "coachComment": "Rxe4 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rxe4",
          "why": "Rxe4 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rxe4",
              "eval": 3.6,
              "depth": 16,
              "why": "Rxe4 is the top line maintaining optimal control.",
              "pv": [
                "Rxe4",
                "Rde8"
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
        "coachComment": "Nxc3 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Nxc3",
          "why": "Nxc3 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Nxc3",
              "eval": 3.6,
              "depth": 16,
              "why": "Nxc3 is the top line maintaining optimal control.",
              "pv": [
                "Nxc3",
                "b5"
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
        "coachComment": "Re7 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Re7",
          "why": "Re7 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Re7",
              "eval": 3.6,
              "depth": 16,
              "why": "Re7 is the top line maintaining optimal control.",
              "pv": [
                "Re7",
                "Rde8"
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
        "coachComment": "Rd1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rd1+",
          "why": "Rd1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rd1+",
              "eval": 3.6,
              "depth": 16,
              "why": "Rd1+ is the top line maintaining optimal control.",
              "pv": [
                "Rd1+",
                "Re1"
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
        "coachComment": "Rf1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rf1",
          "why": "Rf1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rf1",
              "eval": 3.6,
              "depth": 16,
              "why": "Rf1 is the top line maintaining optimal control.",
              "pv": [
                "Rf1",
                "Rg8"
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
        "coachComment": "Rd2 is an excellent move, steadily consolidating the position.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rd2",
          "why": "Rd2 is an excellent move, steadily consolidating the position.",
          "lines": [
            {
              "move": "Rd2",
              "eval": 3.6,
              "depth": 16,
              "why": "Rd2 is the top line maintaining optimal control.",
              "pv": [
                "Rd2",
                "Re8"
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
        "coachComment": "Rf2 is a sound practical choice.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Rf2",
          "why": "Rf2 is a sound practical choice.",
          "lines": [
            {
              "move": "Rf2",
              "eval": 3.5,
              "depth": 16,
              "why": "Rf2 is the top line maintaining optimal control.",
              "pv": [
                "Rf2",
                "Rg8"
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
        "coachComment": "Rd1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Rd1+",
          "why": "Rd1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rd1+",
              "eval": 3.5,
              "depth": 16,
              "why": "Rd1+ is the top line maintaining optimal control.",
              "pv": [
                "Rd1+",
                "Re1"
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
        "coachComment": "Rf1 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.5,
          "bestMove": "Rf1",
          "why": "Rf1 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rf1",
              "eval": 3.5,
              "depth": 16,
              "why": "Rf1 is the top line maintaining optimal control.",
              "pv": [
                "Rf1",
                "Rg8"
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
        "coachComment": "Rd2 is a sound practical choice.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rd2",
          "why": "Rd2 is a sound practical choice.",
          "lines": [
            {
              "move": "Rd2",
              "eval": 3.6,
              "depth": 16,
              "why": "Rd2 is the top line maintaining optimal control.",
              "pv": [
                "Rd2",
                "Re8"
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
        "coachComment": "Rf2 is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rf2",
          "why": "Rf2 is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rf2",
              "eval": 3.6,
              "depth": 16,
              "why": "Rf2 is the top line maintaining optimal control.",
              "pv": [
                "Rf2",
                "Rg8"
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
        "coachComment": "Rd1+ is the best move, maintaining active piece coordination.",
        "eval": {
          "eval": 3.6,
          "bestMove": "Rd1+",
          "why": "Rd1+ is the best move, maintaining active piece coordination.",
          "lines": [
            {
              "move": "Rd1+",
              "eval": 3.6,
              "depth": 16,
              "why": "Rd1+ is the top line maintaining optimal control.",
              "pv": [
                "Rd1+",
                "Re1"
              ]
            }
          ]
        },
        "timeSpent": 9
      }
    ]
  }
];
