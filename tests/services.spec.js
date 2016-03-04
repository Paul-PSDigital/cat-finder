import test from 'tape'
import { call, put } from 'redux-saga/effects'
import * as services from '../config/services'
import * as catFinderActions from 'modules/catFinder/reducer'
import {Station} from 'models/station'
import {CatOwner} from 'models/catOwner'
import {Cat} from 'models/cat'

test('it should prepare the stations', (assert) => {
  const firstStation = new Station(1, 'First')
  const secondStation = new Station(2, 'Second')

  firstStation.addConnectedStation(secondStation)

  const stations = [firstStation, secondStation]
  // Fake Station Data and Connections
  const data = [
    [[1, 'First'], [2, 'Second']],
    [[1, 2]]
  ]

  const response = services.prepareStations(data)
  assert.equal(stations[0].stationId, response[0].stationId)
  assert.equal(stations[0].connectedStations[0].stationId, response[0].connectedStations[0].stationId)
  assert.equal(stations[1].connectedStations[0].stationId, response[1].connectedStations[0].stationId)
  assert.end()
})

test('should create 5 cat owners with their cats', (assert) => {
  const stations = [
    new Station(),
    new Station()
  ]
  const catOwners = services.createCatsAndOwners(5, stations)

  assert.equal(5, catOwners.length)
  assert.end()
})

test('should create a million cat owners with their cats', assert => {
  const stations = [
    new Station(1),
    new Station(2)
  ]
  const count = 1000
  const catOwners = services.createCatsAndOwners(count, stations)

  catOwners.forEach((catOwner) => {
    assert.notEqual(catOwner.station.stationId, catOwner.cat.station.stationId)
  })
  assert.equal(count, catOwners.length)
  assert.end()

})

test('should move the cats and the cat owners', (assert) => {
  let firstStation = new Station(1, 'First')
  let secondStation = new Station(2, 'Second')

  firstStation.addConnectedStation(secondStation)
  const stations = [
    firstStation, secondStation
  ]

  const catOwners = [
    new CatOwner(new Cat(1, stations[1]), stations[0])
  ]
  // Cat is at station 1
  assert.equal(1, catOwners[0].station.stationId)
  // Owner is at station 2
  assert.equal(2, catOwners[0].cat.station.stationId)

  const newOwners = services.moveStations(catOwners)

  // Cat is at station 2
  assert.equal(2, catOwners[0].station.stationId)
  // Owner is at station 1
  assert.equal(1, catOwners[0].cat.station.stationId)
  assert.end()
})

test('it should find cats and owners at the same station', (assert) => {
  let firstStation = new Station(1, 'First')

  const catOwner = new CatOwner(new Cat(1, firstStation), firstStation)
  const foundCats = services.checkLocations([catOwner])

  assert.equal(1, foundCats.length)
  assert.equal(false, foundCats[0].station.isOpen)
  assert.end()
})
