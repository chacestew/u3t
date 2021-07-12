import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ITurnInput } from '@u3t/common';
import React from 'react';
import { Helmet } from 'react-helmet';

import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import GameHeader from '../../Components/GameArea/Header/GameHeader';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import useGameReducer from '../../hooks/useGameReducer';
import { RelativeBox } from '../../styles/Utils';

export default function HotSeat() {
  const [state, { playTurn, restart }] = useGameReducer();

  const onValidTurn = ({ board, cell }: ITurnInput) => {
    const player = state.currentPlayer;

    playTurn({ player, board, cell });
  };

  return (
    <>
      <Helmet>
        <title>U3T - Hotseat</title>
        <link rel="canonical" href="https://u3t.app/hotseat" />
        <meta name="description" content="Compete against a friend on your device." />
      </Helmet>
      <GameHeader seat={state.currentPlayer} state={state} onPlayAgainConfirm={restart} />
      <RelativeBox>
        <Board state={state} seat={state.currentPlayer} onValidTurn={onValidTurn} />
        <TurnList
          state={state}
          lobbyState={{ started: true }}
          RestartButton={
            <RestartButton
              onClick={restart}
              text="Restart"
              icon={<FontAwesomeIcon icon={faRedo} />}
            />
          }
        />
      </RelativeBox>
    </>
  );
}
