import React from 'react';
import pic1 from '../../../../assets/learn1.png';
import pic2 from '../../../../assets/learn2.png';
import pic3 from '../../../../assets/learn3.png';
import palette from '../../utils/palette';
import styled from 'styled-components';

const Section = styled.div`
  display: flex;
  padding: 0.5em;
  // background-color: ${palette.gameBarBg};
  // border-bottom: 2px solid ${palette.gameBarBg};

  img {
    object-fit: contain;
  }
`;

const Text = styled.div`
  width: 55%;
  color: white; //${palette.gameBarBg};
  background-color: ${palette.gameBarBg};
  margin-${({ side }) => side}: 1em;
  padding: 1em;

  h3 {
    margin: 0;
    font-style: italic;
    margin-bottom: 1em;
  }
`;

export default () => (
  <div>
    <Section>
      <Text side="right">
        <h3>Three in a row</h3>
        Ultimate tic-tac-toe is played over nine smaller tic-tac-toe boards. You must win
        three smaller boards in a row to win the game.
      </Text>
      <img
        css={`
          // background-color: ${palette.gameBarBg};
          // box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
          width: 45%;
        `}
        src={pic1}
      />
    </Section>
    <Section>
      <img
        css={`
          // background-color: ${palette.gameBarBg};
          // box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
          width: 45%;
        `}
        src={pic2}
      />
      <Text side="left">
        <h3>Every move counts</h3>
        Plan your moves carefully as the cell you choose will decide the next board in
        play. Here <b>X</b> has chosen the top-right cell of the middle board, so <b>O</b>{' '}
        must play in the top-right board.
      </Text>
    </Section>
    <Section>
      <Text side="right">
        <h3>No Man's Land</h3>When a board has been won or has no cells remaining, it
        becomes unplayable. If a player is sent to such a board, that player may{' '}
        <b>choose any open board to play in.</b>
      </Text>
      <img
        css={`
          // background-color: ${palette.gameBarBg};
          // box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
          width: 45%;
        `}
        src={pic3}
      />
    </Section>
  </div>
);
