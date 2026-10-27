import { describe, it, expect } from 'vitest';
import { buildCoachGamePayload, terminationFromReason } from '@/services/coachGameService';

const base = { sans: ['e4', 'e5'], opponentName: 'Coach All-Chess', opponentRating: 800 };

describe('coach game payload', () => {
  it('maps the winner to a PGN result from the user colour', () => {
    expect(buildCoachGamePayload({ ...base, userColor: 'white', winner: 'user', reason: 'by checkmate' }).result).toBe('1-0');
    expect(buildCoachGamePayload({ ...base, userColor: 'black', winner: 'user', reason: 'by checkmate' }).result).toBe('0-1');
    expect(buildCoachGamePayload({ ...base, userColor: 'white', winner: 'coach', reason: 'by resignation' }).result).toBe('0-1');
    expect(buildCoachGamePayload({ ...base, userColor: 'black', winner: 'coach', reason: 'by resignation' }).result).toBe('1-0');
    expect(buildCoachGamePayload({ ...base, userColor: 'white', winner: 'draw', reason: 'by draw / stalemate' }).result).toBe('1/2-1/2');
  });

  it('names the ending', () => {
    expect(terminationFromReason('by checkmate')).toBe('Checkmate');
    expect(terminationFromReason('by resignation')).toBe('Resignation');
    expect(terminationFromReason('by draw / stalemate')).toBe('Stalemate');
    expect(terminationFromReason('something else')).toBeUndefined();
  });
});
