import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

const Button = styled.button`
  cursor: pointer;
  border: 1px solid slategray;
  background-color: white;
  padding: 0.5em;
  border: 0;
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
  font-weight: bold;
  color: #594b5c;
  &:active {
    outline: none;
  }

  svg {
    margin-left: 0.5em;
  }
`;

const RestartButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button onClick={onClick}>
      {'Forfeit'}
      <FontAwesomeIcon color="white" stroke="#594b5c" strokeWidth="50" icon={faFlag} />
    </Button>
  );
};

export default RestartButton;
