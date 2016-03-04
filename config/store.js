import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';

import { devTools } from 'redux-devtools';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';

import mySaga from './sagas'
import rootReducer from './reducers';
const sagaMiddleware = createSagaMiddleware(mySaga)

const createStoreWithMiddleware = compose(
  applyMiddleware(sagaMiddleware),
  reduxReactRouter({ createHistory }),
  devTools()
)(createStore);

export default function store(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
