import * as mcts from 'modules/mcts/reducer'

export const STATIONS_LOADED = 'STATIONS_LOADED'
export const UPDATED_ALL = 'UPDATED_ALL'

var initialState = {
  stations: [],
  cats: [],
  catOwners: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATED_ALL:
      return Object.assign({}, state, {
        cats: action.cats,
        catOwners: action.catOwners
      })
    case STATIONS_LOADED:
      return Object.assign({}, state, {stations: action.stations})
    default:
      return state;
  }
}

export function stationsLoaded(stations) {
  return {
    type: STATIONS_LOADED,
    stations
  }
}

export function updateAll(cats, catOwners) {
  return {
    type: UPDATED_ALL,
    cats,
    catOwners
  }
}

/**
* Evaluate if there are any winners
*/
export function evaluateState() {
  return (dispatch: Redux.Dispatch, getState: () => any) => {
    var state = getState();
    var stationState = state.stations

    state.stations.catOwners.forEach((catOwner) => {
      if (catOwner.station.stationId === catOwner.cat.station.stationId) {
        catOwner.cat.isFound = true
        catOwner.station.isOpen = false
      }
    })

    if ((state.mcts.remainingCount > 0) && (state.stations.cats.filter(cat => !cat.isFound).length > 0)) {
      dispatch(moveStations())
      dispatch(mcts.nextMove())
    } else {
      dispatch(updateAll(state.stations.cats, state.stations.catOwners))
      dispatch(mcts.stopSearch())
    }
  }
}

export function moveStations() {
  return (dispatch: Redux.Dispatch, getState: () => any) => {
    var state = getState().stations

    var cats = state.cats.filter((cat) => !cat.isFound)
    var catOwners = state.catOwners.filter((catOwner) => !catOwner.cat.isFound)

    cats.forEach((cat) => cat.selectNextStation())
    catOwners.forEach((catOwner) => catOwner.selectNextStation())

    dispatch(updateAll(cats.filter((cat) => !cat.isStuck), catOwners.filter((catOwner) => !catOwner.isStuck)))

    if (cats.filter((cat) => cat.isStuck).length === cats.length) {
      dispatch(mcts.stopSearch())
    }

    if (catOwners.filter((catOwner) => catOwner.isStuck).length === catOwners.length) {
      dispatch(mcts.stopSearch())
    }
    setTimeout(function() {
      dispatch(evaluateState())
    }, 0.1)
  }
}
