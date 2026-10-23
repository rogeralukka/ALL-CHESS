import rawManifest from './coachManifestData.json';
import { CoachExpression } from './types';

export interface ManifestExpression {
  name: string;
  bust: string;
  full: string;
  fallbackBust: string;
  fallbackFull: string;
}

export interface CoachManifest {
  version: string;
  expressions: Record<string, ManifestExpression>;
}

export const COACH_MANIFEST: CoachManifest = rawManifest as CoachManifest;

export function getCoachAsset(expression: CoachExpression): ManifestExpression {
  if (COACH_MANIFEST.expressions[expression]) {
    return COACH_MANIFEST.expressions[expression];
  }
  return (
    COACH_MANIFEST.expressions.neutral || {
      name: 'Neutral',
      bust: '/assets/coach/coach_neutral.webp',
      full: '/assets/coach/coach_neutral_full.webp',
      fallbackBust: '/assets/coach/coach_neutral.png',
      fallbackFull: '/assets/coach/coach_neutral_full.png',
    }
  );
}
