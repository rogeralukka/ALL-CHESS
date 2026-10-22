import { BoardTheme, PieceSet } from './types';

export const BOARD_THEMES: BoardTheme[] = [
  { id: 'sand-clay', name: 'Sand & Clay', light: '#f0d9b5', dark: '#b58863' },
  { id: 'classic-green', name: 'Classic Green', light: '#eeeed2', dark: '#769656' },
  { id: 'brown', name: 'Brown', light: '#f0d9b5', dark: '#b58863' },
  { id: 'icy-sea', name: 'Icy Sea', light: '#d2dde4', dark: '#7d9eb3' },
  { id: 'walnut', name: 'Walnut', light: '#b99c78', dark: '#71513a' },
  { id: 'slate', name: 'Slate', light: '#717b8e', dark: '#29303e' },
  { id: 'paper', name: 'Paper', light: '#d0cfc6', dark: '#a9a8a1' },
  { id: 'blue', name: 'Blue', light: '#dee3e6', dark: '#5596f2' },
];

export const PIECE_SETS: PieceSet[] = [
  {
    id: 'cburnett',
    name: 'Classic (cburnett)',
    basePath: '/pieces/cburnett',
    license: 'CC BY-SA 3.0 Colin M.L. Burnett',
  },
];

export interface BoardPreset {
  id: string;
  name: string;
  boardId: string;
  pieceId: string;
  background: 'standard' | 'felt' | 'wood';
}

export const BOARD_PRESETS: BoardPreset[] = [
  { id: 'dusk-master', name: 'Dusk Classic', boardId: 'sand-clay', pieceId: 'cburnett', background: 'standard' },
  { id: 'club-green', name: 'Tournament Green', boardId: 'classic-green', pieceId: 'cburnett', background: 'felt' },
  { id: 'ocean-drift', name: 'Icy Calm', boardId: 'icy-sea', pieceId: 'cburnett', background: 'standard' },
  { id: 'heritage-wood', name: 'Walnut Study', boardId: 'walnut', pieceId: 'cburnett', background: 'wood' },
  { id: 'midnight-slate', name: 'Slate Modern', boardId: 'slate', pieceId: 'cburnett', background: 'standard' },
  { id: 'dawn-newspaper', name: 'Morning Paper', boardId: 'paper', pieceId: 'cburnett', background: 'felt' },
];
