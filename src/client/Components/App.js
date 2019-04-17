import React from 'react';
import { Link, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled, { createGlobalStyle } from 'styled-components';
import styledNormalize from 'styled-normalize';

import Play from './Lobby';
import Home from './Home';
import HotSeat from './HotSeat';
import PlayAI from './PlayAI';

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

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: grey;
  color: white;

  h1 {
    font-size: 20px;
  }

  ul {
    width: 100%
    display: flex;
    justify-content: space-between;
    list-style: none;
    li {
      padding: 0 2em;
      display: inline;
      a {
        color: white;
      }
    }
  }
`;

const App = () => (
  <>
    <GlobalStyle />
    <Header>
      <h1>U3T - Ultimate Tic-Tac-Toe</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </Header>
    <Main>
      <Route exact path="/" component={Home} />
      <Route path="/play/:id?" component={Play} />
      <Route path="/hotseat" component={HotSeat} />
      <Route path="/playai" component={PlayAI} />
    </Main>
  </>
);

export default hot(App);
