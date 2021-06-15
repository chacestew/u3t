import React from 'react';
import { Link } from 'react-router-dom';

import { Bar } from '../styles';

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
