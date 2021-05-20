import React from 'react';

import { Bar } from '../styles';
import { Link } from 'react-router-dom';

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
