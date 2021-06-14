import React, { useRef, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';

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
import About from './About/About';

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

const socketURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8001'
    : window.location.protocol + '//' + window.location.host;

const socket = io(socketURL, {
  autoConnect: true,
  path: '/ws',
});

function App() {
  // const socketRef = useRef<Socket>();

  // if (!socketRef.current) {
  //   socketRef.current = io(socketURL, {
  //     autoConnect: true,
  //     path: '/ws',
  //   });
  // }

  // const socket = socketRef.current;

  return (
    <>
      <GlobalStyle />
      <Header />
      <Main>
        <Switch>
          <Route exact path="/">
            <Home socket={socket} />
          </Route>
          <Route
            exact
            path="/game/:lobbyId"
            render={(routeProps: any) => <Play socket={socket} {...routeProps} />}
          />
          <Route
            exact
            path="/game/:lobbyId/spectate"
            render={(routeProps: any) => (
              <Play socket={socket} spectator {...routeProps} />
            )}
          />
          <Route path="/local" component={HotSeat} />
          <Route path="/ai" component={PlayAI} />
          <Route path="/rules" component={Rules} />
          <Route path="/about" component={About} />
          <Redirect to="/" />
        </Switch>
      </Main>
      <Footer />
    </>
  );
}

export default App;
