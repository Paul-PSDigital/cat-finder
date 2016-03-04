// Import our various react tools
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';

// Import our store creator and routes config
import store from './config/store';
import routes from './config/routes';

// Create our store with the initial state
const initialStore = store({});

// Render out the root component with the redux provider and debug panel
render(
  <div>
    <Provider store={ initialStore }>
      <ReduxRouter routes={ routes } />
    </Provider>
  </div>,
  document.getElementById('root')
);
