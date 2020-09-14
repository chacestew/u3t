import React from 'react';
import pic from '../../../1.png';
import palette from '../../utils/palette';

export default () => (
  <div>
    <div
      css={`
        display: flex;
        padding: 1em;
      `}
    >
      <div
        css={`
          width: 55%;
          color: ${palette.textColor2};
          padding-right: 1em;
        `}
      >
        Ultimate tic-tac-toe is played over nine smaller tic-tac-toe boards. You must win
        three smaller boards in a row to win the game.
      </div>
      <img
        css={`
          background-color: ${palette.gameBarBg};
          // box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
          width: 45%;
        `}
        src={pic}
      />
    </div>
    <div
      css={`
        display: flex;
        padding: 1em;
      `}
    >
      <img
        css={`
          background-color: ${palette.gameBarBg};
          // box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
          width: 45%;
        `}
        src={pic}
      />
      <div
        css={`
          width: 55%;
          color: ${palette.textColor2};
          padding-left: 1em;
        `}
      >
        However, plan carefully as players will choose where their opponent will play .
        For example, here X plays in the top-right cell, meaning O play their next turn in
        the top-right board.
      </div>
    </div>
    <div
      css={`
        display: flex;
        padding: 1em;
      `}
    >
      <div
        css={`
          width: 55%;
          color: ${palette.textColor2};
          padding-right: 1em;
        `}
      >
        A board that is won or fill is not playable. If you are sent there, you may choose
        any open board to play in.
      </div>
      <img
        css={`
          background-color: ${palette.gameBarBg};
          // box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
          width: 45%;
        `}
        src={pic}
      />
    </div>
  </div>
);
