import React from 'react';

import * as T from '../../../../../shared/types';
import MiniBoard from '../MiniBoard';

import { Cell, Text, Bar } from '../styles';
import { Link } from 'react-router-dom';

interface Props {
  cell: 1 | 2;
  text?: string;
  boards: T.IBoardState[];
  activeBoard: T.Cell[];
}

const InPlay = () => {
  return (
    <Bar>
      <p css="margin: 0;">
        <b>Welcome!</b> Start a game below or{' '}
        <Link css="color: inherit;" to="/rules">
          learn the rules
        </Link>
        .
      </p>
    </Bar>
  );
};

export default InPlay;
