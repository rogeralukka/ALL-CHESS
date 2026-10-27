import { describe, it, expect } from 'vitest';
import { Game, Move } from '@/data/types';
import { openingFamily, openingNameFor, terminationFor } from '@/lib/gameMeta';

const mv = (san: string): Move => ({ san, from: 'a1', to: 'a2', color: 'w', fen: '', moveNumber: 1 });
const game = (over: Partial<Game>): Game =>
  ({ id: 'g', pgn: '', white: { username: 'a', rating: 1 }, black: { username: 'b', rating: 1 }, result: '1-0', date: '', timeControl: '10+0', speed: 'rapid', source: 'online', opening: { eco: '', name: '' }, moves: [], ...over }) as Game;

describe('game history meta', () => {
  it('uses the family name only', () => {
    expect(openingFamily('Sicilian Defense: Najdorf Variation')).toBe('Sicilian Defense');
  });
  it('looks the opening up from the moves when none is stored', () => {
    const g = game({ moves: ['e4', 'd5'].map(mv) });
    expect(openingNameFor(g)).toBe('Scandinavian Defense');
  });
  it('prefers a stored name', () => {
    expect(openingNameFor(game({ opening: { eco: 'C50', name: 'Italian Game: Two Knights' } }))).toBe('Italian Game');
  });
  it('derives checkmate, draw and backend terminations', () => {
    expect(terminationFor(game({ moves: [mv('Qh7#')] }))).toBe('Checkmate');
    expect(terminationFor(game({ result: '1/2-1/2', moves: [mv('e4')] }))).toBe('Draw');
    expect(terminationFor(game({ termination: 'rogeralukka won by resignation', moves: [mv('e4')] }))).toBe('Resignation');
    expect(terminationFor(game({ moves: [mv('e4')] }))).toBeNull();
  });
});
