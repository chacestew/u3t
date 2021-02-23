import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as T from '../../../shared/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

import TurnListItem, { TurnListCell, TurnListParagraph } from './TurnListItem';
import { flexColumns, media } from '../../../styles/mixins';
import { Button } from '../../Button';
import { IMultiplayerState } from '../../../hooks/useLobbyReducer';

const TurnListButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TurnListToggle = styled(Button)`
  color: white;
  background-color: #594b5c;
  z-index: 1;

  :hover,
  :focus {
    filter: none;
    outline: 0;
  }

  & > svg {
    margin-left: 0.5em;
  }
`;

const TurnListContainer = styled.div<{ expanded: boolean }>`
  background-color: #594b5c;
  flex-direction: column;
  flex: 1;
  width: 100%;
  overflow: auto;
  color: white;
  display: none;
  ${({ expanded }) => expanded && `display: flex;`}
`;

const StyledTurnList = styled.div<{ expanded: boolean }>`
  ${flexColumns}
  flex: 1;
  justify-content: flex-end;
  overflow: hidden;
  font-weight: bold;
  font-size: 16px;
  color: #594b5c;
  padding-top: 20%;
  z-index: 1;

  ${({ expanded }) =>
    expanded &&
    `height: 100%; 
     position: absolute;
     bottom: 0;
     width: 100%;`}

  @media (min-height: 721px) {
    position: relative;
    padding-top: 0;
    bottom: 0;
  }
`;

const OpeningText = ({ lobbyState }: { lobbyState: Partial<IMultiplayerState> }) => {
  if (!lobbyState.started) return <p>Waiting for more players.</p>;
  if (lobbyState.isSpectator) return <p>You are spectating.</p>;
  if (lobbyState.playerSeat)
    return (
      <p>
        <b>
          You are playing as <TurnListCell cellType={lobbyState.playerSeat} />.
        </b>{' '}
        Have fun!
      </p>
    );
  return <p>New game started.</p>;
};

const TurnList = ({
  state,
  lobbyState,
  RestartButton,
}: {
  state: T.IGameState;
  seat?: T.Player;
  RestartButton: JSX.Element;
  lobbyState: Partial<IMultiplayerState>;
}) => {
  const [expanded, setExpanded] = useState(() => {
    return (window?.innerHeight || 0) >= 700;
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('bottomRef.current', bottomRef.current);
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [state.turnList.length]);

  const onClick = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledTurnList expanded={expanded}>
      <TurnListButtonsContainer className="log-header">
        <TurnListToggle shadow={false} onClick={onClick}>
          Turn log
          <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretUp} />
        </TurnListToggle>
        {RestartButton}
      </TurnListButtonsContainer>
      <TurnListContainer expanded={expanded}>
        <TurnListParagraph>
          <OpeningText lobbyState={lobbyState} />
        </TurnListParagraph>
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
    </StyledTurnList>
  );
};

export default TurnList;
