import React from 'react';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import * as T from '../../shared/types';
import useGameReducer from '../../hooks/useGameReducer';
import GameHeader from '../../Components/GameArea/Header/GameHeader';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import { RelativeBox } from '../../styles/Utils';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function HotSeat() {
  const [state, { playTurn, restart }] = useGameReducer();

  const onValidTurn = ({ board, cell }: T.ITurnInput) => {
    const player = state.currentPlayer;

    playTurn({ player, board, cell });
  };

  return (
    <>
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
