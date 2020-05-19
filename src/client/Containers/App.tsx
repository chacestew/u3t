import React from 'react';
import { Link, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import styled, { createGlobalStyle } from 'styled-components';
import styledNormalize from 'styled-normalize';

import Play from './Lobby';
import Home from './Home';
import HotSeat from './HotSeat';
import PlayAI from './PlayAI';
import Rules from './Rules';
import palette from '../utils/palette';

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
    min-height: 100vh;
     margin: 0 auto;
     display: flex;
     flex-direction: column;
    }
  }
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  margin: 0 auto;
  max-width: 640px;
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.header};
  color: ${palette.textColor};
  height: 50px;
  font-weight: bold;

  nav {
    max-width: 640px;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    display: flex;
    align-items: center;

    .logo {
      font-size: 2em;
      margin-right: 10px;
    }

    .sub-logo {
      font-size: 1.5em;
      opacity: 0.7;
    }
  }

  div {
    height: 100%;
    display: flex;
    align-items: center;
  }

  ul {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    margin: 0;

    li {
      padding: 0 2em;
      display: inline;
    }
  }

  a {
    font-weight: bold;
    text-decoration: none;
    color: ${palette.textColor};
  }
`;

const App = () => (
  <>
    <GlobalStyle />
    <Header>
      <div />
      <nav css="overflow: hidden">
        <div>
          <Link className="logo" to="/">
            U3T
          </Link>
        </div>
        <ul>
          <li>
            <Link to="/">PLAY</Link>
          </li>
          <li>
            <Link to="/rules">RULES</Link>
          </li>
          <li>
            <Link to="/about">ABOUT</Link>
          </li>
        </ul>
      </nav>
      <div />
    </Header>
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
      `}
    >
      Copyright Chace Stewart
    </footer>
  </>
);

export default hot(App);
