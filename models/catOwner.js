import { Cat } from './cat'
import { Station } from './station'

export class CatOwner {
  cat : Cat = null
  station: Station = null
  stationHistory: Station[] = []
  isStuck: boolean = false

  constructor(cat: Cat, station) {
    this.setCat(cat)
    this.setStation(station)

    cat.setOwner = this
  }

  setCat (cat: Cat) : any {
    this.cat = cat
    return this
  }

  setStation (station: Station) {
    this.station = station

    // Remember visiting this station
    if (this.stationHistory.indexOf(station) === -1) {
      this.stationHistory.push(station)
    }
    return this
  }

  /**
  * Select the next available station
  * Give preference to those that havn't already been visited
  */
  selectNextStation(): void {
    // Get the open stations connected to
    var openStations = this.station.connectedStations.filter(station => station.isOpen)

    if (openStations.length > 0) {
      var stations = openStations.filter((station) => {
        return this.stationHistory.forEach((historyStation) => {
          return station !== historyStation
        })
      })

      if (stations.length === 0) {
        stations = openStations
      }

      // Go to a random station
      this.setStation(stations[Math.floor(Math.random()*stations.length)])
    } else {
      this.isStuck = true
      console.warn("Cat Owner is now stuck at " + this.station.stationName)
    }
  }
}
