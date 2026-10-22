import { CoachExpression, MoveClassification } from '@/data/types';

export type CoachEvent =
  | MoveClassification
  | 'explain'
  | 'analysing'
  | 'loading'
  | 'greeting'
  | 'resume'
  | 'welcome_back'
  | 'win'
  | 'puzzle_solved'
  | 'level_up'
  | 'loss'
  | 'draw'
  | 'idle';

export const EXPRESSION_MAP: Record<CoachEvent, CoachExpression> = {
  brilliant: 'brilliant',
  great: 'thumbsup',
  best: 'thumbsup',
  excellent: 'thumbsup',
  good: 'neutral',
  book: 'neutral',
  inaccuracy: 'thinking',
  mistake: 'embarrassed',
  miss: 'embarrassed',
  blunder: 'embarrassed',
  
  explain: 'thinking',
  analysing: 'thinking',
  loading: 'thinking',

  greeting: 'wave',
  resume: 'wave',
  welcome_back: 'wave',

  win: 'brilliant',
  puzzle_solved: 'brilliant',
  level_up: 'brilliant',

  loss: 'embarrassed',
  draw: 'neutral',
  idle: 'neutral',
};

export function getExpressionForEvent(event: CoachEvent): CoachExpression {
  return EXPRESSION_MAP[event] || 'neutral';
}
