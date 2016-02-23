import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StationUI} from 'components/stationui'
import * as loaders from 'actions/loader'
import * as stationActions from 'modules/stations/reducer'

import './app.scss';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(loaders.getStations())
  }

  releaseCats(count) {
    var catCount = this.refs.catCount.value
    this.props.dispatch(loaders.generator(catCount))

    var that = this
  }

  render () {
    const { state, dispatch, children } = this.props;
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
    state.stations.stations.forEach(station => {
      if (station.isOpen) {
        openStations.push(<StationUI station={station} expand={true}/>)
      } else {
        closedStations.push(<StationUI station={station} expand={false} />)
      }
    })

    return (
      <div>
        <div style={styles.top}>
        Cats: <input type='number' ref='catCount' /><button onClick={this.releaseCats.bind(this)} disabled={state.mcts.running}>Release Cats</button>
        <div>Remaining Moves: {state.mcts.remainingCount}</div>
        </div>
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
    );
  }
}

function mapStateToProps (state) {
  return { state };
}

export default connect(mapStateToProps)(App);
