import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';

import GlobalStyle from '../styles/global';
import Play from './Lobby';
import Home from './Home';
import HotSeat from './HotSeat';
import PlayAI from './PlayAI';
import Rules from './Rules';
import Header from './Header';
import Footer from './Footer';

import { gridSize } from '../utils/palette';
import { media } from '../styles/mixins';

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
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/game/:room?" component={Play} />
        <Route path="/local" component={HotSeat} />
        <Route path="/ai" component={PlayAI} />
        <Route path="/rules" component={Rules} />
        <Redirect to="/" />
      </Switch>
    </Main>
    <Footer />
  </>
);

export default hot(App);
