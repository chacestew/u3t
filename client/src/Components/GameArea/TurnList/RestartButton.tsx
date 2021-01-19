import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import Button from '../../Button';

const RestartButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button shadow={false} svgRight padding="0.5em" onClick={onClick}>
      {'Forfeit'}
      <FontAwesomeIcon color="white" stroke="#594b5c" strokeWidth="50" icon={faFlag} />
    </Button>
  );
};

export default RestartButton;
