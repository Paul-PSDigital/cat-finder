import React, { Component } from 'react';

export class StationUI extends Component {
  render () {
    const { station } = this.props;

    const childStyles = {
      paddingLeft: '12px'
    }
    var connectedStations =
      station.connectedStations.map((connectedStation) => {
      childStyles.color = connectedStation.isOpen ? 'green' : 'red';
      return <div style={childStyles}>{connectedStation.stationName}</div>
    })
    return <div>
    {station.stationName} {this.props.expand ? connectedStations : null }
    </div>
  }
}
