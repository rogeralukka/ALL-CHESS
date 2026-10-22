import { CoachEvent } from './expressionMap';

export const COACH_LINES: Record<CoachEvent, string[]> = {
  brilliant: [
    "A visionary sacrifice! You calculated deep into the position and found the cleanest winning path.",
    "Spectacular move! Giving up material for overwhelming initiative and board control.",
    "Masterful technique. You spotted a tactical motif that shifts the entire balance."
  ],
  great: [
    "Sharp and decisive! You punished their imbalance immediately.",
    "A standout find. You kept the pressure on and maximized piece activity.",
    "High-level intuition. That move clamps down on their counterplay."
  ],
  best: [
    "The absolute best move on the board! Exact and purposeful.",
    "Textbook precision. You found the top engine recommendation effortlessly.",
    "Spot on! Keeps your dynamic advantage while improving piece placement."
  ],
  excellent: [
    "Very strong follow-up! Maintains your edge and solidifies your structure.",
    "Clean play. You kept the upper hand with minimal complications.",
    "Crisp move. It coordinates your pieces nicely toward the center."
  ],
  good: [
    "Solid and sensible. A dependable move that keeps things stable.",
    "Good practical choice. You developed a piece and stayed safe.",
    "Quiet, constructive move that preserves your board presence."
  ],
  book: [
    "Well-known theory. Following established opening principles.",
    "Standard grandmaster preparation. Developing naturally toward the center.",
    "Classic theoretical continuation. You're right at home in this line."
  ],
  inaccuracy: [
    "Slightly loose. A more active square would have created stronger threats.",
    "A bit cautious. It lets your opponent equalize without much resistance.",
    "Not quite the most accurate move, but your position remains very playable."
  ],
  mistake: [
    "That concedes control of an important diagonal. Let's see the alternative.",
    "A tricky position, but that gives your opponent a clear tactical opening.",
    "That allowed an unnecessary pin. Look for ways to keep your king guarded."
  ],
  miss: [
    "You had a strong tactical strike available right there! Let's explore what was missed.",
    "A missed opportunity to win material or force king concessions.",
    "The right idea was there, but a sharper forcing sequence was waiting."
  ],
  blunder: [
    "A painful tactical slip. That leaves a key piece undefended.",
    "That walk into a discovered attack turns the tide. Let's retry it and find the shield.",
    "Ouch, that drops decisive material. Don't worry—let's examine what happened together."
  ],
  explain: [
    "Here is the tactical sequence. Notice how every check limits their escape squares.",
    "Let's break down the mechanics: by deflecting the defender, the back rank opens up.",
    "The key motif here is piece coordination. Look at how your bishop cuts off the retreat."
  ],
  analysing: [
    "Calculating deep variations and evaluating tactical lines...",
    "Scanning piece harmony, king safety, and structural imbalances...",
    "Assessing candidate moves and engine evaluations..."
  ],
  loading: [
    "Gathering game data and preparing your interactive review...",
    "Loading board position and calculating evaluations...",
    "Setting up the coaching board..."
  ],
  greeting: [
    "Hey there! Ready to review your recent games and sharpen your tactical instincts?",
    "Welcome! Great to see you back on the board. Let's break down some chess.",
    "Hello! Every game holds a lesson. Let's find your brightest moves today."
  ],
  resume: [
    "Welcome back! Picked up right where you left off. Ready for the next move?",
    "Resuming your game! The clock and board are all set for you.",
    "Right back into the fray! Let's keep your plan rolling."
  ],
  welcome_back: [
    "Great to see you again! Your daily streak is intact and waiting.",
    "Welcome back to the studio. Let's dive into some puzzles or review a game.",
    "Good to have you back! Your coach is ready whenever you are."
  ],
  win: [
    "Resounding victory! You played with clinical confidence from start to finish.",
    "Checkmate! Brilliant game management and tactical execution.",
    "Congratulations! You converted your positional advantage cleanly."
  ],
  puzzle_solved: [
    "Bingo! You solved the puzzle with pinpoint precision.",
    "Solved! You calculated the forcing line without missing a beat.",
    "Excellent vision! That tactical pattern is now committed to memory."
  ],
  level_up: [
    "Level Up! Your rating and puzzle mastery are climbing fast.",
    "Milestone achieved! Outstanding consistency across this stage.",
    "Level complete! You've unlocked the next training tier."
  ],
  loss: [
    "Tough battle! Even world champions lose games—the key is learning from every slip.",
    "A hard-fought game. Let's review the turning points and sharpen that defense.",
    "Good fight! We'll examine the critical moment together so you crush it next time."
  ],
  draw: [
    "A well-earned draw. Solid defense held the balance under pressure.",
    "Split point! Both sides navigated the complications with vigilance.",
    "Peaceful conclusion. A tightly contested positional duel."
  ],
  idle: [
    "Take your time. Look at checks, captures, and threats before deciding.",
    "Whenever you're ready, select a move or step through the review.",
    "Observing the position. Look for pawn levers and piece weaknesses."
  ]
};

export function getRandomCoachLine(event: CoachEvent): string {
  const lines = COACH_LINES[event] || COACH_LINES.idle;
  return lines[Math.floor(Math.random() * lines.length)];
}

export const ILLEGAL_MOVE_TEACHING_LINES = [
  "That piece cannot move there according to chess rules. Check the highlighted green dots for legal destination squares!",
  "Illegal move! If your king is in check, you must block, capture the attacker, or step aside.",
  "That square isn't accessible for this piece right now. Take a look at the highlighted dots to see where it can safely land."
];
