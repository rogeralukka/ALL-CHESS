import { api } from '@/data/api';

export interface CoachGameInput {
  /** SAN moves in play order. */
  sans: string[];
  userColor: 'white' | 'black';
  winner: 'user' | 'coach' | 'draw';
  /** e.g. "by checkmate", "by resignation", "by draw / stalemate" */
  reason: string;
  opponentName: string;
  opponentRating: number;
}

export interface CoachGamePayload {
  moves: string[];
  userColor: 'white' | 'black';
  result: '1-0' | '0-1' | '1/2-1/2';
  opponentName: string;
  opponentRating: number;
  termination?: string;
}

const TERMINATIONS: Array<[RegExp, string]> = [
  [/checkmate/i, 'Checkmate'],
  [/resign/i, 'Resignation'],
  [/stalemate/i, 'Stalemate'],
  [/draw/i, 'Draw'],
];

export function terminationFromReason(reason: string): string | undefined {
  return TERMINATIONS.find(([re]) => re.test(reason))?.[1];
}

/** Turns a finished Play Coach game into the body the backend saves. */
export function buildCoachGamePayload(input: CoachGameInput): CoachGamePayload {
  const userIsWhite = input.userColor === 'white';
  let result: CoachGamePayload['result'] = '1/2-1/2';
  if (input.winner === 'user') result = userIsWhite ? '1-0' : '0-1';
  else if (input.winner === 'coach') result = userIsWhite ? '0-1' : '1-0';
  return {
    moves: input.sans,
    userColor: input.userColor,
    result,
    opponentName: input.opponentName,
    opponentRating: input.opponentRating,
    termination: terminationFromReason(input.reason),
  };
}

/** Saves the game on the backend and returns its id, ready for /review/:id. */
export async function saveCoachGame(input: CoachGameInput): Promise<string> {
  const res = await api.post<{ id: string }>('/games/coach', buildCoachGamePayload(input));
  return res.id;
}
