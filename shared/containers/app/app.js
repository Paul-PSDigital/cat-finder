import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StationUI} from 'components/stationui'
import * as catFinderActions from 'modules/catFinder/reducer'

import './app.scss'

class App extends Component {

  componentDidMount() {
    this.props.dispatch({type: catFinderActions.LOAD_STATIONS})
  }

  componentDidUpdate(prevProps, prevState) {
    let counterChanged = prevProps.state.catFinder.currentCount !== this.props.state.catFinder.currentCount
    let belowMax = this.props.state.catFinder.currentCount < this.props.state.catFinder.maxCount
    if (this.props.state.catFinder.running && counterChanged && belowMax) {
      this.props.dispatch({
        type: catFinderActions.MOVE_STATIONS,
        catOwners: this.props.state.catFinder.catOwners.filter((o) => { return !o.cat.isFound && !o.isStuck && !o.cat.isStuck})
      })
    }
  }

  releaseCats(count) {
    this.props.dispatch({
      type: catFinderActions.START_SEARCH,
      count: this.refs.catCount.value,
      stations: this.props.state.catFinder.stations
    })
  }

  render () {
    const { state, dispatch, children } = this.props
    var styles = {
      top: {
        margin: '12px'
      },
      open: {
        float: 'left',
        width: '40%',
        border: '1px green dotted',
        padding: '12px'
      },
      closed: {
        float: 'right',
        width: '40%',
        border: '1px red dotted',
        padding: '12px'
      }
    }

    var openStations = [], closedStations = []
    state.catFinder.stations.forEach(station => {
      if (station.isOpen) {
        openStations.push(<StationUI station={station} />)
      } else {
        closedStations.push(<StationUI station={station} />)
      }
    })
    var countsComponent = null

    if (state.catFinder.catOwners && state.catFinder.catOwners.length > 0) {
      let foundCats = state.catFinder.foundCats.length
      countsComponent = <div>
        <div>Total Number of Cats: {state.catFinder.catOwners.length}</div>
        <div>Number of cats found: {foundCats}</div>
        <div>Average number of movements required to find a cat: { Math.round(state.catFinder.lastCatCounter / foundCats)}</div>
      </div>
    }

    return (
      <div>
        <div style={styles.top}>
          Cats: <input type='number' ref='catCount' />
          <button onClick={this.releaseCats.bind(this)} disabled={state.catFinder.running}>Release Cats</button>
          <div>Current Move: {state.catFinder.currentCount}</div>
        </div>
        { countsComponent }
        <div style={styles.open}>
        <h2>Open:</h2>
          {openStations}
        </div>
        <div style={styles.closed}>
          <h2>Closed:</h2>
          {closedStations}
        </div>
        {children && React.cloneElement(children, { state, dispatch })}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { state }
}

export default connect(mapStateToProps)(App)
