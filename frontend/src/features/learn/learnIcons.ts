import {
  ArrowUpFromLine, BookOpen, BrickWall, ClipboardCheck, Columns3, Crown, Flag, Hammer, Layers,
  Scissors, ShieldAlert, ShieldHalf, Swords, Target, Zap, type LucideIcon,
} from 'lucide-react';
import { LessonStage } from '@/data/types';

/** A topic glyph for each lesson tile (Chess.com draws one per lesson rather than a lock or a number). */
const BY_ID: Record<string, LucideIcon> = {
  'endgame-1': Crown,
  'endgame-2': ShieldAlert,
  'endgame-3': BrickWall,
  'endgame-4': ShieldHalf,
  'endgame-5': ArrowUpFromLine,
  'endgame-6': Scissors,
  'endgame-7': Zap,
  'endgame-8': ClipboardCheck,
  'opening-1': BookOpen,
  'opening-2': Layers,
  'opening-3': Swords,
  'middle-1': Flag,
  'middle-2': Columns3,
  'middle-3': Hammer,
};

export function iconForStage(stage: LessonStage): LucideIcon {
  return BY_ID[stage.id] ?? Target;
}
