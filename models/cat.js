import { Station } from './station'

export class Cat {
  catId: number = null
  station: Station = null
  isFound: boolean = false
  isStuck: boolean = false

  constructor(id: number, station = Station): any {
    this.catId = id
    this.setStation(station)
  }

  setStation (station: Station) {
    this.station = station
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
      // Go to a random station
      this.setStation(openStations[Math.floor(Math.random()*openStations.length)])
    } else {
      this.isStuck = true
      console.warn("Cat is now stuck at " + this.station.stationName)
    }
  }
}
