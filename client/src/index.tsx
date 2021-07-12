import { createBrowserHistory } from 'history';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { Router } from 'react-router-dom';

import App from './Containers/App';
import client from './micro-sentry';
import registerSW from './registerServiceWorker';

const history = createBrowserHistory();

const rootElement = document.getElementById('root');

if (rootElement!.hasChildNodes()) {
  console.log('Hydrating');
  hydrate(
    <Router history={history}>
      <App />
    </Router>,
    rootElement
  );
} else {
  console.log('Rendering');
  render(
    <Router history={history}>
      <App />
    </Router>,
    rootElement
  );
}

if (navigator.userAgent !== 'ReactSnap') {
  registerSW({ onError: (error) => client.report(error) });
}
