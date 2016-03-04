import * as catFinderActions from 'modules/catFinder/reducer'
import { take, put, call, fork, select } from 'redux-saga/effects'

import {Station} from 'models/station'
import {Cat} from 'models/cat'
import {CatOwner} from 'models/catOwner'
import _, {find, matchesProperty} from 'lodash'

const STATIONS_URI = 'https://gist.githubusercontent.com/jorgebastida/f90adff6bf83736b2a23/raw/70f35710c490ce8e767d2a501e280571ba02208a/tfl_stations.json'
const STATIONS_CONNECTIONS_URI = 'https://gist.githubusercontent.com/jorgebastida/f90adff6bf83736b2a23/raw/70f35710c490ce8e767d2a501e280571ba02208a/tfl_connections.json'

/**
* Every move the cat or the owner will go to a new station
*/
export function moveStations(catOwners) {
  catOwners.forEach((catOwner) => {
    catOwner.selectNextStation()
    catOwner.cat.selectNextStation()
  })
  return catOwners
}

// Check if cats are now in the same place
export function checkLocations(catOwners) {
  return catOwners.filter((catOwner) => {
    if (catOwner.station.stationId === catOwner.cat.station.stationId) {
      // TODO: wont work when state is immutable
      catOwner.station.isOpen = false
      catOwner.cat.isFound = true
      return catOwner.cat
    }
  })
}

/**
* Defined seperately so we can just mock the yield call on loadStations
*/
export function fetchStationsData() {
  return Promise.all( [
      fetch(STATIONS_URI).then(r => r.json()),
      fetch(STATIONS_CONNECTIONS_URI).then(r => r.json()),
  ]);
}

/**
* Turn the station data and connections into connected stations
*/
export function prepareStations(data) {
  const stations = data[0].map((stationData) => {
    return new Station(...stationData)
  })

  for (var connectedStations of data[1]) {
    var station1 = _.find(stations, {stationId: connectedStations[0]})
    var station2 = _.find(stations, {stationId: connectedStations[1]})

    station1.addConnectedStation(station2)
  }
  return stations
}

/**
* Generate the cats and their owners
*/
export function createCatsAndOwners(count: number, stations): any {
    var ownersArray = []

    while (count--) {
      var cat = new Cat(count, getRandomStation(stations))

      let remainingStations = stations.filter((station) => {
        if (station !== cat.station) {
          return station
        }
      })
      var owner = new CatOwner(cat, getRandomStation(remainingStations))
      ownersArray.push(owner)
    }
    return ownersArray
}

/**
* Select any station from the array
*/
function getRandomStation(items: Station[]): Station {
    return items[Math.floor(Math.random()*items.length)]
}
