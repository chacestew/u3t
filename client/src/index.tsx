import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import * as _ from 'styled-components/cssprop';
import App from './Containers/App';

const rootElement = document.getElementById('root');

render(
  <Router>
    <App />
  </Router>,
  rootElement
);
