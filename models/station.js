import { Cat } from './cat'
import { CatOwner } from './catOwner'

export class Station {
  stationId: number = null
  stationName: string = null
  isOpen: boolean = true
  connectedStations: [] = []

  constructor(stationId, stationName): void {
    this.stationId = stationId;
    this.stationName = stationName;
  }

  /**
  * Add a station connected to this one
  */
  addConnectedStation(station: Station): Station {
    // Check for duplicate
    if (this.connectedStations.indexOf(station) === -1) {
      this.connectedStations.push(station)
      
      // Inverse
      station.addConnectedStation(this)
    }
    return this
  }
}
