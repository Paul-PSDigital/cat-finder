import * as stationActions from 'modules/stations/reducer'
import * as mcts from 'modules/mcts/reducer'

import {Station} from 'models/station'
import {Cat} from 'models/cat'
import {CatOwner} from 'models/catOwner'

const STATIONS_URI = 'https://gist.githubusercontent.com/jorgebastida/f90adff6bf83736b2a23/raw/70f35710c490ce8e767d2a501e280571ba02208a/tfl_stations.json'
const STATIONS_CONNECTIONS_URI = 'https://gist.githubusercontent.com/jorgebastida/f90adff6bf83736b2a23/raw/70f35710c490ce8e767d2a501e280571ba02208a/tfl_connections.json'

export function getStations(): any {
  return (dispatch: Redux.Dispatch, getState: () => any) => {
    fetch(STATIONS_URI).then(r => r.json())
    .then((data) => {
      var stations = [];
      data.forEach((stationData) => {
        stations[stationData[0]] = new Station(...stationData)
      });
      dispatch(getConnections(stations))
    })
    .catch(e => console.log("Failed to Load Stations", e))
  }
}

export function getConnections(stations: Stations[]): any {
  return (dispatch: Redux.Dispatch, getState: () => any) => {
    fetch(STATIONS_CONNECTIONS_URI).then(r => r.json())
    .then((data) => {
      for (var connectedStations of data) {
        var station1 = stations[connectedStations[0]]
        var station2 = stations[connectedStations[1]]

        station1.addConnectedStation(station2)
        station2.addConnectedStation(station1)
      }
      dispatch(stationActions.stationsLoaded(stations));
    })
    .catch(e => console.log("Failed to Load Station Connections", e))
  }
}

/**
* Generate the cats and their owners
*/
export function generator(count: number): any {
  return (dispatch: Redux.Dispatch, getState: () => any) => {
    var catsArray = [], ownersArray = []
    var state = getState().stations
    var stations = Object.entries(state.stations)

    for (let i = 0; i < count ; i++) {
      var catStation = getRandomStation(stations)

      // TODO: This filter is expensive - find a better way of doing this seed
      var ownerStation = getRandomStation(stations.filter(i => catStation !== i))
      var cat = new Cat(i, catStation[1])
      var owner = new CatOwner(cat, ownerStation[1])

      catsArray.push(cat)
      ownersArray.push(owner)
    }

    dispatch(stationActions.updateAll(catsArray, ownersArray))
    dispatch(mcts.startSearch())
    dispatch(stationActions.evaluateState())
  }
}

function getRandomStation(array: Station[]): Station {
  for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array[0];
}
