import React from 'react';
import BoardSVG from '../BoardSVG';
import * as T from '../../../shared/types';
import palette from '../../../utils/palette';

const MiniBoard = ({
  activeBoard,
  boards,
}: {
  activeBoard: T.Board[];
  boards: T.IBoardState[];
}) => {
  const pathAttributes = boards.map((board, index) => {
    const baseAttrs = { fill: 'white', fillOpacity: 1 };
    switch (board.winner) {
      case 1:
        return { ...baseAttrs, fill: palette.p1CellBg };
      case 2:
        return { ...baseAttrs, fill: palette.p2CellBg };
      default:
        return {
          ...baseAttrs,
          fillOpacity: activeBoard.includes(index as T.Board) ? 1 : 0.5,
        };
    }
  });
  return <BoardSVG size="2em" pathAttributes={pathAttributes} />;
};

export default MiniBoard;
