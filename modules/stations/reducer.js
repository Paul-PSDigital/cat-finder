import * as lifecycle from 'modules/lifecycle/reducer'

export const STATIONS_LOADED = 'STATIONS_LOADED'
export const PREPARE_SEARCH = 'PREPARE_SEARCH'
export const FOUND_CAT   = 'FOUND_CAT'

var initialState = {
  stations: [],
  cats: [],
  catOwners: [],
  foundCats: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PREPARE_SEARCH:
      return Object.assign({}, state, {
        cats: action.cats,
        catOwners: action.catOwners,
        foundCats: []
      })
    case FOUND_CAT:
      return Object.assign({}, state, {
        foundCats: state.foundCats.concat(action.cat)
      })
    case STATIONS_LOADED:
      return Object.assign({}, state, {stations: action.stations})
    default:
      return state
  }
}

export function stationsLoaded(stations): Redux.Action {
  return {
    type: STATIONS_LOADED,
    stations
  }
}

export function prepareSearch(cats, catOwners): Redux.Action {
  return {
    type: PREPARE_SEARCH,
    cats,
    catOwners
  }
}

function catFound(cat: Cat): Redux.Action {
  return {
    type: FOUND_CAT,
    cat
  }
}
/**
* Evaluate if there are any winners
*/
export function evaluateState() {
  return (dispatch: Redux.Dispatch, getState: () => State) => {
    var owners = getState().stations.catOwners.filter((catOwner) => !catOwner.cat.isFound)

    owners.forEach((catOwner) => {
      if (catOwner.station.stationId === catOwner.cat.station.stationId) {
        catOwner.cat.isFound = true
        catOwner.station.isOpen = false
        dispatch(catFound(catOwner.cat))
      }
    })

    var state = getState()

    // Continue looking?
    if ((state.lifecycle.currentCount < state.lifecycle.maxCount) &&
    (state.stations.foundCats.length < state.stations.cats.length)) {
      dispatch(lifecycle.nextMove())
      return moveStations(owners.filter((catOwner) => !(catOwner.isStuck || (catOwner.cat.isStuck || catOwner.cat.isFound))))
    } else {
      // Completed
      dispatch(lifecycle.stopSearch())
    }
  }
}

/**
* Move the cats and their owners to new stations
*/
function moveStations(catOwners) {
  catOwners.forEach((catOwner) => {
    catOwner.selectNextStation()
    catOwner.cat.selectNextStation()
  })
  return catOwners
}
