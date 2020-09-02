import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import styled from 'styled-components';
import { faRobot, faGlobe, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import palette from '../../utils/palette';
import MenuItem from './MenuItem';
import GameView from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import { getInitialState } from '../../../shared/game';
import { Header } from '../../Components/GameArea/Header/Header';

const Article = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LineTitle = styled.h2`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:before,
  &:after {
    content: '';
    border-top: 2px solid;
    margin: 0 20px 0 0;
    flex: 1 0 20px;
  }

  &:after {
    margin: 0 0 0 20px;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;
  padding: 10px;
  background: ${palette.menuButtonBg};
  color: ${palette.textColor2};
  width: 100%;
  font-weight: bold;
  justify-content: center;
  border: 1px solid ${palette.menuButtonBr};
  display: flex;
`;

const NavContainer = styled.div`
  line-height: 1.15;
  font-family: 'Open Sans', sans-serif;
  box-sizing: inherit;
  width: 100%;
  border: 1px solid silver;
  border-radius: 4px;
  padding: 1em 1em;
  display: flex;
  background: #594b5c;
  flex-direction: column;

  p {
    margin-bottom: 0;
    color: ${palette.textColor};
  }
`;

export default () => {
  return (
    <Article
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      <Header state={getInitialState()} mode="share" />

      <div
        css={`
          display: flex;
          position: relative;
          align-items: center;
        `}
      >
        <GameView state={getInitialState()} />
        {/* <div
        css={`
          position: absolute;
        `}
      > */}
        {/* <h2>Welcome to U3T!</h2>
        <p>The ultimate way to play the 9 board variant of tic-tac-toe.</p> */}
        <section
          css={`
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 2em;
            background: rgba(89, 75, 92, 0.9);
          `}
        >
          <MenuItem
            url="/play"
            text="PLAY ONLINE"
            icon={faGlobe}
            description="Compete against a friend over the internet. Join our Discord to find more players."
          />

          <MenuItem
            url="/hotseat"
            text="PLAY ON DEVICE"
            icon={faUserFriends}
            description="Take turns playing on your device."
          />

          <MenuItem
            url="/playai"
            text="PLAY THE AI"
            icon={faRobot}
            description="Test your strength against the computer."
            lastChild
          />
        </section>
      </div>
      {/* </div> */}
    </Article>
  );
};
