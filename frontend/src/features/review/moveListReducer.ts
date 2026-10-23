export interface VariationState {
  parentMoveIndex: number;
  moves: string[];
  stepIndex: number;
  title: string;
}

export interface MoveListState {
  currentMoveIndex: number;
  activeVariation: VariationState | null;
}

export type MoveListAction =
  | { type: 'SELECT_MOVE'; index: number }
  | { type: 'NEXT_MOVE'; maxIndex: number }
  | { type: 'PREV_MOVE' }
  | { type: 'START_VARIATION'; parentMoveIndex: number; moves: string[]; title: string }
  | { type: 'NEXT_VARIATION_STEP' }
  | { type: 'PREV_VARIATION_STEP' }
  | { type: 'EXIT_VARIATION' };

export const initialMoveListState: MoveListState = {
  currentMoveIndex: -1,
  activeVariation: null,
};

export function moveListReducer(state: MoveListState, action: MoveListAction): MoveListState {
  switch (action.type) {
    case 'SELECT_MOVE':
      return {
        ...state,
        currentMoveIndex: action.index,
        activeVariation: null,
      };

    case 'NEXT_MOVE':
      if (state.activeVariation) {
        // Step within variation first if active
        if (state.activeVariation.stepIndex < state.activeVariation.moves.length - 1) {
          return {
            ...state,
            activeVariation: {
              ...state.activeVariation,
              stepIndex: state.activeVariation.stepIndex + 1,
            },
          };
        }
        // Exiting variation back to parent move
        return {
          ...state,
          activeVariation: null,
        };
      }
      return {
        ...state,
        currentMoveIndex: Math.min(action.maxIndex, state.currentMoveIndex + 1),
      };

    case 'PREV_MOVE':
      if (state.activeVariation) {
        if (state.activeVariation.stepIndex > 0) {
          return {
            ...state,
            activeVariation: {
              ...state.activeVariation,
              stepIndex: state.activeVariation.stepIndex - 1,
            },
          };
        }
        return {
          ...state,
          activeVariation: null,
        };
      }
      return {
        ...state,
        currentMoveIndex: Math.max(-1, state.currentMoveIndex - 1),
      };

    case 'START_VARIATION':
      return {
        ...state,
        activeVariation: {
          parentMoveIndex: action.parentMoveIndex,
          moves: action.moves,
          stepIndex: 0,
          title: action.title,
        },
      };

    case 'NEXT_VARIATION_STEP':
      if (!state.activeVariation) return state;
      return {
        ...state,
        activeVariation: {
          ...state.activeVariation,
          stepIndex: Math.min(
            state.activeVariation.moves.length - 1,
            state.activeVariation.stepIndex + 1
          ),
        },
      };

    case 'PREV_VARIATION_STEP':
      if (!state.activeVariation) return state;
      return {
        ...state,
        activeVariation: {
          ...state.activeVariation,
          stepIndex: Math.max(0, state.activeVariation.stepIndex - 1),
        },
      };

    case 'EXIT_VARIATION':
      return {
        ...state,
        activeVariation: null,
      };

    default:
      return state;
  }
}
