export const NEXT_MOVE = 'NEXT_MOVE'
export const START     = 'START'
export const STOP      = 'STOP'

var initialState = {
  remainingCount: 100000,
  running: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START:
      return Object.assign({}, state, {running: true, remainingCount: initialState.remainingCount})
    case STOP:
      return Object.assign({}, state, {running: false})
    case NEXT_MOVE:
      return Object.assign({}, state, {remainingCount: state.remainingCount - 1});
    default:
      return state;
  }
}

export function startSearch() {
  return {
    type: START
  };
}

export function stopSearch() {
  return {
    type: STOP
  };
}

/**
 * Trigger the next move
 */
export function nextMove() {
  return {
    type: NEXT_MOVE
  };
}
