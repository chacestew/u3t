import { createBrowserHistory } from 'history';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';

import App from './Containers/App';
import client from './micro-sentry';
import registerSW from './registerServiceWorker';

const history = createBrowserHistory();

const rootElement = document.getElementById('root')!;

if (rootElement.hasChildNodes()) {
  console.log('Hydrating');
  hydrateRoot(
    rootElement,
    <Router history={history}>
      <App />
    </Router>,
  );
} else {
  console.log('Rendering');
  createRoot(rootElement).render(
    <Router history={history}>
      <App />
    </Router>,
  );
}

registerSW({ onError: (error) => client.report(error) });
