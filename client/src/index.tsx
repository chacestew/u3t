import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';

import App from './Containers/App';
import registerSW from './registerServiceWorker';

const history = createBrowserHistory();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],
  tracesSampleRate: 1.0,
});

const rootElement = document.getElementById('root');

render(
  <Router history={history}>
    <App />
  </Router>,
  rootElement
);

registerSW();
