import React from 'react';
import { Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { createGlobalStyle } from 'styled-components';
import styledNormalize from 'styled-normalize';

import TopNav from './Common/TopNav';
import Main from './Common/Main';

import Home from './Pages/Home';
import Cat from './Pages/Cat';
import Dog from './Pages/Play';

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  body {
    background-color: lavender;
    height: 100vh;
    font-family: 'Open Sans', sans-serif;

    #root {
    display: flex;
    flex-direction: column;
    }
  }
`;

const App = () => (
  <>
    <GlobalStyle />
    <header>
      <TopNav />
    </header>
    <Main>
      <Route exact path="/" component={Home} />
      <Route path="/cat" component={Cat} />
      <Route path="/play" component={Dog} />
    </Main>
  </>
);

export default hot(App);
