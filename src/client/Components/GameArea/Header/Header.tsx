import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import palette from '../../../utils/palette';
import BoardSVG from './BoardSVG';
import * as T from '../../../../shared/types';

import { Cell, Text, Bar } from './styles';

const GlobalBoardIcon = ({
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

export default BoardSVG;

export const Header = ({
  children,
  currentPlayer,
  seat,
  activeBoard,
  boards,
}: {
  children: React.ReactNode;
  currentPlayer: 1 | 2 | null;
  seat: 1 | 2 | null;
  activeBoard: T.Cell[];
  boards: T.IBoardState[];
}) => {
  if (children) {
    return <Bar>{children}</Bar>;
  }

  return (
    <Bar>
      <Text justify="flex-start">
        <Cell cellType={seat} />
      </Text>
      <Text justify="center" opacity={currentPlayer === seat ? 1 : 0.5}>
        {currentPlayer === seat ? 'You to play' : 'Opponent to play'}
      </Text>

      <Text justify="flex-end">
        <GlobalBoardIcon boards={boards} activeBoard={activeBoard} />
      </Text>
    </Bar>
  );
};

export const Loading = () => {
  return (
    <>
      <div
        css={`
          height: 32px;
          width: 30%;
          background: silver;
        `}
      />
      <div
        css={`
          height: 32px;
          width: 30%;
          background: silver;
        `}
      />
    </>
  );
};

export const ShareHeader = () => {
  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <Text
      css={`
        cursor: pointer;
      `}
      onClick={handleCopy}
    >
      <b>Share link to your opponent:</b>{' '}
      {window.location.host + window.location.pathname} <FontAwesomeIcon icon={faCopy} />
    </Text>
  );
};
