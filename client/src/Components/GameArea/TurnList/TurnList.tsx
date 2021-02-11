import React, { useState, useEffect, useRef } from 'react';
import * as T from '../../../shared/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import TurnListItem, { TurnListCell, TurnListParagraph } from './TurnListItem';
import { flexColumns, media } from '../../../styles/mixins';
import Button from '../../Button';

const TurnListButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TurnListToggle = styled(Button)`
  cursor: pointer;
  color: white;
  font-weight: bold;
  border: 0;
  outline: 0;
  background-color: #594b5c;
  padding: 0.5em;
  z-index: 1;
`;

const TurnListContainer = styled.div`
  background-color: #594b5c;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  overflow: auto;
  color: white;
`;

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
`;

const useStickyExpandedState = () => {
  const [expanded, setExpanded] = useState(() => {
    const val = window.localStorage.getItem('expanded');

    if (val !== null) return JSON.parse(val);
    return true;
  });

  useEffect(() => {
    // window.localStorage.setItem('expanded', JSON.stringify(expanded));
  }, [expanded]);

  return [expanded, setExpanded];
};

const TurnList = ({
  state,
  seat,
  RestartButton,
}: {
  state: T.IGameState;
  seat?: T.Player;
  RestartButton: JSX.Element;
}) => {
  const [expanded, setExpanded] = useStickyExpandedState();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current!.scrollIntoView({
      behavior: 'smooth',
    });
  }, [state.turnList.length]);

  const onClick = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledTurnList expanded={expanded}>
      <TurnListButtonsContainer className="log-header">
        <TurnListToggle
          shadow={false}
          svgRight
          backgroundColor="#594b5c"
          padding="0.5em"
          fontColor="white"
          onClick={onClick}
        >
          Turn log
          <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretUp} />
        </TurnListToggle>
        {RestartButton}
      </TurnListButtonsContainer>
      {expanded && (
        <TurnListContainer>
          {seat && (
            <TurnListParagraph>
              <b>
                You are playing as <TurnListCell cellType={seat} />.
              </b>{' '}
              Have fun!
            </TurnListParagraph>
          )}
          {state.turnList.map((t, i) => (
            <TurnListItem key={i} turn={i} {...t} />
          ))}
          {state.finished && (
            <TurnListParagraph>
              {state.tied ? (
                <b>It&apos;s a draw!</b>
              ) : (
                <b>
                  <TurnListCell cellType={state.winner} /> wins!
                </b>
              )}
            </TurnListParagraph>
          )}
          <div ref={bottomRef} />
        </TurnListContainer>
      )}
    </StyledTurnList>
  );
};

export default TurnList;
