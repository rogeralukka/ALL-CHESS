/**
 * A puzzle move is correct only if it is the expected solution move, or — when the
 * expected move delivers mate — any other move that also delivers mate.
 * Comparison ignores check/mate/annotation suffixes.
 */
export function isCorrectPuzzleMove(moveSan: string, expectedSan: string, givesMate: boolean): boolean {
  const norm = (x: string) => x.replace(/[+#!?]/g, '');
  if (norm(moveSan) === norm(expectedSan)) return true;
  return expectedSan.includes('#') && givesMate;
}
