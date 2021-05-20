import React from 'react';
import BoardSVG from '../BoardSVG';
import { Board, IBoardState } from '../../../shared/types';
import palette from '../../../utils/palette';

const MiniBoard = ({
  activeBoard,
  boards,
}: {
  activeBoard: Board[];
  boards: IBoardState[];
}) => {
  const pathAttributes = boards.map((board, index) => {
    const baseAttrs = { fill: 'white', fillOpacity: 1 };
    switch (board.winner) {
      case 1:
        return { ...baseAttrs, fill: palette.red };
      case 2:
        return { ...baseAttrs, fill: palette.yellow };
      default:
        return {
          ...baseAttrs,
          fillOpacity: activeBoard.includes(index as Board) ? 1 : 0.5,
        };
    }
  });
  return <BoardSVG size="2em" pathAttributes={pathAttributes} />;
};

export default MiniBoard;
