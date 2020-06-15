import React from 'react';

import * as T from '../../../../../shared/types';
import MiniBoard from '../MiniBoard';

import { Cell, Text, Bar } from '../styles';

interface Props {
  cell: 1 | 2;
  text?: string;
  boards: T.IBoardState[];
  activeBoard: T.Cell[];
}

const InPlay = ({ cell, text, boards, activeBoard }: Props) => {
  return (
    <Bar>
      <Text justify="flex-start">
        <Cell cellType={cell} />
      </Text>
      {text && <Text justify="center">{text}</Text>}
      <Text justify="flex-end">
        <MiniBoard boards={boards} activeBoard={activeBoard} />
      </Text>
    </Bar>
  );
};

export default InPlay;
