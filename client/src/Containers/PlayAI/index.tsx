import React, { useState, useEffect } from 'react';
import playTurn, { getInitialState, generateRandomMove } from '../../shared/game';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import GameHeader from '../../Components/GameArea/Header/GameHeader';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

const PlayAI = () => {
  const [gameState, setGameState] = useState(getInitialState());
  const [seat, setSeat] = useState<number | null>(null);

  useEffect(() => {
    const yourSeat = Math.ceil(Math.random() * 2);
    setSeat(yourSeat);
  }, []);

  useEffect(() => {
    if (seat === null || gameState.currentPlayer === seat) return;
    setTimeout(() => {
      const randomTurn = generateRandomMove(gameState);
      const { state: nextState } = playTurn(gameState, randomTurn);
      setGameState(nextState);
    }, 1000);
  }, [gameState, seat]);

  const play = ({ board, cell }) => {
    console.log(seat);
    const { error, state } = playTurn(gameState, { player: seat, board, cell });

    if (!error) {
      setGameState(state);
    }
  };

  const restart = () => {};

  return (
    <>
      <GameHeader
        seat={seat}
        mode="local"
        state={gameState}
        onPlayAgainConfirm={restart}
      />
      <Board state={gameState} seat={seat} onValidTurn={play} />
      <TurnList
        state={gameState}
        RestartButton={
          <RestartButton
            onClick={restart}
            text="Restart"
            icon={<FontAwesomeIcon icon={faRedo} />}
          />
        }
      />
    </>
  );
};

export default PlayAI;
