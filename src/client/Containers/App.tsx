import React from 'react';
import { Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled, { createGlobalStyle } from 'styled-components';
import styledNormalize from 'styled-normalize';

import Play from './Lobby';
import Home from './Home';
import HotSeat from './HotSeat';
import PlayAI from './PlayAI';
import Rules from './Rules';
import palette, { gridSize } from '../utils/palette';
import { media } from '../styles/mixins';
import Header from './Header';

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  html {
    box-sizing: border-box;
  }
  
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    font-family: 'Open Sans', sans-serif;

    #root {
      background-color: ${palette.mainBg};
      height: 100vh;
    min-height: 100vh;
     margin: 0 auto;
     display: flex;
     flex-direction: column;

     ${media.aboveMobileL`height: auto`}
    }
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 auto;
  max-width: ${gridSize};
  width: 100%;

  overflow: hidden;

  ${media.aboveMobileL`overflow: auto`}
`;

const App = () => (
  <>
    <GlobalStyle />
    <Header />
    <Main>
      <Route exact path="/" component={Home} />
      <Route path="/play/:id?" component={Play} />
      <Route path="/hotseat" component={HotSeat} />
      <Route path="/playai" component={PlayAI} />
      <Route path="/rules" component={Rules} />
    </Main>
    <footer
      css={`
        padding: 1em;
        background-color: ${palette.header};
        color: white;
      `}
    >
      Copyright Chace Stewart - About - Contact
    </footer>
  </>
);

export default hot(App);
