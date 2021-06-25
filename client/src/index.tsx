import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './Containers/App';
import registerSW from './registerServiceWorker';

const rootElement = document.getElementById('root');

render(
  <Router>
    <App />
  </Router>,
  rootElement
);

registerSW();
