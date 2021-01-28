import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { faRobot, faGlobe, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import palette from '../../utils/palette';
import MenuItem from './MenuItem';
import GameView from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import { getInitialState } from '../../shared/game';
import { Header } from '../../Components/GameArea/Header/Header';
import { media } from '../../styles/mixins';

const Article = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Home = () => {
  return (
    <Article
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      <Header state={getInitialState()} mode="home" />
      <div
        css={`
          display: flex;
          position: relative;
          align-items: center;
          justify-content: center;
        `}
      >
        <GameView state={getInitialState()} />
        <section
          css={`
            position: absolute;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: column;
            padding: 1em;
            background: rgba(89, 75, 92, 0.9);
            height: 100%;
            width: 100%;

            ${media.aboveMobileL`
            padding: 2em;
            height: 90%;
            width: 90%;
            border-radius: 6px;
            `}
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
    </Article>
  );
};

export default Home;
