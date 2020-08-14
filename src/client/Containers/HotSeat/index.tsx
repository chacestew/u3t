import React from 'react';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import * as T from '../../../shared/types';
import useGameReducer from '../../hooks/useGameReducer';
import { Header } from '../../Components/GameArea/Header/Header';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import { RelativeBox } from '../../styles/Utils';

const HotSeat = () => {
  const [state, { playTurn, restart }] = useGameReducer();

  const onValidTurn = ({ board, cell }: T.ITurnInput) => {
    const player = state.currentPlayer;

    playTurn({ player, board, cell });
  };

  return (
    <>
      <Header
        seat={state.currentPlayer}
        state={state}
        mode="local"
        onPlayAgainConfirm={restart}
      />
      <RelativeBox>
        <Board state={state} seat={state.currentPlayer} onValidTurn={onValidTurn} />
        <TurnList turnList={state.turnList} onRestart={restart} />
      </RelativeBox>
    </>
  );
};

export default HotSeat;
