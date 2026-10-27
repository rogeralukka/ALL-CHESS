import { describe, it, expect } from 'vitest';
import { strengthFor, MAX_LEVEL } from '@/services/stockfishPlayService';

describe('strengthFor', () => {
  it('uses Skill Level below the UCI_Elo floor', () => {
    const s = strengthFor(400);
    expect(s.limitStrength).toBe(false);
    expect(s.skill).toBe(0);
  });
  it('uses UCI_Elo in the supported range', () => {
    expect(strengthFor(1500)).toMatchObject({ limitStrength: true, elo: 1500 });
    expect(strengthFor(3000)).toMatchObject({ limitStrength: true, elo: 3000 });
  });
  it('runs unrestricted Stockfish at the top level', () => {
    expect(strengthFor(MAX_LEVEL)).toMatchObject({ limitStrength: false });
    expect(strengthFor(MAX_LEVEL).skill).toBeUndefined();
  });
  it('gets stronger monotonically', () => {
    const a = strengthFor(1400).elo!, b = strengthFor(2200).elo!;
    expect(b).toBeGreaterThan(a);
  });
});
