import { Cat } from './cat'
import { CatOwner } from './catOwner'

export class Station {
  stationId: number = null
  stationName: string = null
  isOpen: boolean = true
  connectedStations: [] = []

  constructor(stationId, stationName) {
    this.stationId = stationId;
    this.stationName = stationName;
  }

  addConnectedStation(station: Station) {
    // Check for duplicate
    if (this.connectedStations.indexOf(station) === -1) {
      this.connectedStations.push(station)
    }
  }
}
