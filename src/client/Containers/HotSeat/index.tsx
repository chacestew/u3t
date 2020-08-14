import React from 'react';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import * as T from '../../../shared/types';
import useGameReducer from '../../hooks/useGameReducer';
import { Header } from '../../Components/GameArea/Header/Header';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import { RelativeBox } from '../../styles/Utils';

const HotSeat = () => {
  const [{ gameState, turnList }, { playTurn, restart }] = useGameReducer();

  const onValidTurn = ({ board, cell }: T.ITurnInput) => {
    const player = gameState.currentPlayer;

    playTurn({ player, board, cell });
  };

  return (
    <>
      <Header
        seat={gameState.currentPlayer}
        state={gameState}
        mode="local"
        onPlayAgainConfirm={restart}
      />
      <RelativeBox>
        <Board
          state={gameState}
          seat={gameState.currentPlayer}
          onValidTurn={onValidTurn}
        />
        <TurnList turnList={turnList} onRestart={restart} />
      </RelativeBox>
    </>
  );
};

export default HotSeat;
