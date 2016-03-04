import React, { Component } from 'react'

export class StationUI extends Component {
  render () {
    const { station } = this.props

    return <div>{ station.stationName }</div>
  }
}
