import React from 'react';
import { Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled, { createGlobalStyle } from 'styled-components';
import styledNormalize from 'styled-normalize';

import Play from './Pages/Play/Play';
import Home from './Pages/Home';
import HotSeat from './Pages/Play/HotSeat';

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

const Main = styled.main`
  display: flex;
  justify-content: center;
`;

const App = () => (
  <>
    <GlobalStyle />
    <header />
    <Main>
      <Route exact path="/" component={Home} />
      <Route path="/play/:id?" component={Play} />
      <Route path="/hotseat" component={HotSeat} />
    </Main>
  </>
);

export default hot(App);
