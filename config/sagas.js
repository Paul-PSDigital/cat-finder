import * as catFinderActions from 'modules/catFinder/reducer'
import { takeEvery, takeLatest } from 'redux-saga'
import { take, put, call, fork, select } from 'redux-saga/effects'
import * as services from './services'

export default function* root() {
  yield [
    fork(watchLoadStations),
    fork(watchMoveStations),
    fork(watchMoveCompleted),
    fork(watchStartSearch)
  ]
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Watchers
function* watchLoadStations() {
  yield take(catFinderActions.LOAD_STATIONS)
  const stationData = yield call(services.fetchStationsData)
  const stations = services.prepareStations(stationData)

  yield put({type: catFinderActions.STATIONS_LOADED, stations})
}

function* watchMoveStations() {
  while(true) {
    const {catOwners} = yield take(catFinderActions.MOVE_STATIONS)
    yield call(delay, 1)
    const newOwners = services.moveStations(catOwners)
    yield put({type: catFinderActions.MOVE_COMPLETED, catOwners: newOwners})
  }
}

function* watchMoveCompleted() {
  while(true) {
    const {catOwners} = yield take(catFinderActions.MOVE_COMPLETED)
    if (catOwners.length > 0) {
      const foundCats = services.checkLocations(catOwners)

      if (foundCats.length > 0) {
        yield put({type: catFinderActions.FOUND_CAT, foundCats})
      }
      yield put({type: catFinderActions.NEXT_MOVE})
    } else {
      yield put({type: catFinderActions.STOP})
    }
  }
}

function* watchStartSearch() {
  while(true) {
    const {count, stations} = yield take(catFinderActions.START_SEARCH)

    const catOwners = services.createCatsAndOwners(count, stations)
    yield put({type: catFinderActions.PREPARE_SEARCH, catOwners})
    yield put({type: catFinderActions.MOVE_STATIONS, catOwners})
  }
}
