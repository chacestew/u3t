import React from 'react';
import styled from 'styled-components';
import { faRobot, faGlobe, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import MenuItem from './MenuItem';
import GameView from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import { getInitialState } from '../../shared/game';
import HomeHeader from '../../Components/GameArea/Header/HeaderContents/Home';
import { flexColumns, media } from '../../styles/mixins';

const Article = styled.article`
  ${flexColumns}
  align-items: center;
  justify-content: center;
`;

const MiddleContent = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const MenuContainer = styled.div`
  ${flexColumns}
  position: absolute;
  justify-content: space-around;
  padding: 1em;
  background: rgba(89, 75, 92, 0.9);
  height: 100%;
  width: 100%;
  border-radius: 4px;
  height: 90%;
  width: 90%;

  ${media.aboveMobileL`
            padding: 2em;

            border-radius: 6px;`}
`;

const Home = () => {
  return (
    <Article>
      <HomeHeader />
      <MiddleContent>
        <GameView state={getInitialState()} />
        <MenuContainer>
          <MenuItem
            url="/game"
            text="PLAY ONLINE"
            icon={faGlobe}
            description="Compete against a friend over the internet. Join our Discord to find more players."
          />
          <MenuItem
            url="/local"
            text="PLAY ON DEVICE"
            icon={faUserFriends}
            description="Take turns playing on your device."
          />
          <MenuItem
            url="/ai"
            text="PLAY THE AI"
            icon={faRobot}
            description="Test your strength against the computer."
            lastChild
          />
        </MenuContainer>
      </MiddleContent>
    </Article>
  );
};

export default Home;
