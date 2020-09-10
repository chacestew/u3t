import React, { useState, useEffect } from 'react';
import * as T from '../../../../shared/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import TurnListItem from './TurnListItem';
import { flexColumns, media } from '../../../styles/mixins';
import RestartButton from './RestartButton';

const bgColor = '#f8f8ff'; //'#594b5c';

const StyledTurnList = styled.div<{ expanded: boolean }>`
  ${flexColumns}
  flex: 1;
  justify-content: flex-end;
  overflow: hidden;
  font-weight: bold;
  font-size: 16px;
  color: #594b5c;
  margin-top: 0.5em;
  z-index: 1;

  ${({ expanded }) =>
    expanded &&
    `height: 100%; 
     position: absolute;
     bottom: 0;
     width: 100%;`}

  @media (min-height: 700px) {
    position: relative;
    bottom: 0;
  }

  .log-header {
    display: flex;
    justify-content: space-between;

    .expand-button {
      cursor: pointer;
      color: white;
      font-weight: bold;
      border: 0;
      outline: 0;
      background-color: #594b5c;
      padding: 0.5em;
      z-index: 1;

      svg {
        margin-left: 0.5em;
      }
    }
  }

  .log-list {
    background-color: #594b5c;
    // padding: 0.5em;
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    overflow-y: scroll;
    color: white;

    .element {
      margin: 0.5em 0.25em;
  
      ${media.aboveMobileM`
      margin: 0.5em 0.5em;
      `}
  
      ${media.aboveMobileL`
      margin: 0.5em 0.75em;
      `}
  
      @media (min-width: 505px) {
        margin: 0.5em 1.25em;
      }
    }

    // ${media.aboveMobileL`max-height: 150px;`}
`;

const useStickyExpandedState = () => {
  const [expanded, setExpanded] = useState(() => {
    const val = window.localStorage.getItem('expanded');

    if (val !== null) return JSON.parse(val);
    return true;
  });

  useEffect(() => {
    window.localStorage.setItem('expanded', JSON.stringify(expanded));
  }, [expanded]);

  return [expanded, setExpanded];
};

const TurnList = ({
  turnList,
  onRestart,
}: {
  turnList: T.ITurnInput[];
  onRestart: () => void;
}) => {
  const [expanded, setExpanded] = useStickyExpandedState();

  const onClick = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledTurnList expanded={expanded}>
      <div className="log-header">
        <button className="expand-button" onClick={onClick}>
          Turn Log
          <FontAwesomeIcon icon={expanded ? faMinusSquare : faPlusSquare} />
        </button>
        <RestartButton onClick={onRestart} />
      </div>
      {expanded && (
        <div className="log-list">
          {turnList.map((t, i) => (
            <TurnListItem key={i} turn={i} {...t} />
          ))}
        </div>
      )}
    </StyledTurnList>
  );
};

export default TurnList;
