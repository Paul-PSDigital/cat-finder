export const STATIONS_LOADED = 'STATIONS_LOADED'
export const MOVE_STATIONS  = 'MOVE_STATIONS'
export const LOAD_STATIONS = "LOAD_STATIONS"

export const START_SEARCH   = 'START_SEARCH'
export const MOVE_COMPLETED = 'MOVE_COMPLETED'
export const PREPARE_SEARCH = 'PREPARE_SEARCH'
export const FOUND_CAT   = 'FOUND_CAT'

export const NEXT_MOVE   = 'NEXT_MOVE'
export const STOP        = 'STOP'

var initialState = {
  stations: [],
  catOwners: [],
  foundCats: [],
  currentCount: 0,
  lastCatCounter: 0,
  maxCount: 100000,
  running: false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case STOP:
      return Object.assign({}, state, {running: false})
    case NEXT_MOVE:
      return Object.assign({}, state, {currentCount: state.currentCount + 1})
    case PREPARE_SEARCH:
      return Object.assign({}, state, {
        catOwners: action.catOwners,
        running: true,
        currentCount: initialState.currentCount
      })
    case FOUND_CAT:
      return Object.assign({}, state, {
        foundCats: state.foundCats.concat(action.foundCats),
        lastCatCounter: state.currentCount
      })
    case STATIONS_LOADED:
      return Object.assign({}, state, {stations: action.stations})
    default:
      return state
  }
}

export function prepareSearch(catOwners): Redux.Action {
  return {
    type: PREPARE_SEARCH,
    catOwners
  }
}
