import React, { useState, useEffect } from 'react';
import { generateRandomMove } from '../../shared/game';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import GameHeader from '../../Components/GameArea/Header/GameHeader';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { Player, ITurnInput } from '../../shared/types';
import useGameReducer from '../../hooks/useGameReducer';

const PlayAI = () => {
  const [gameState, { playTurn, restart }] = useGameReducer();
  const [seat, setSeat] = useState<Player | null>(null);

  useEffect(() => {
    const yourSeat = Math.ceil(Math.random() * 2) as 1 | 2;
    setSeat(yourSeat);
  }, []);

  useEffect(() => {
    if (seat === null || gameState.currentPlayer === seat) return;
    setTimeout(() => {
      const randomTurn = generateRandomMove(gameState);
      playTurn(randomTurn);
    }, 500);
  }, [gameState, seat, playTurn]);

  const play = ({ board, cell }: ITurnInput) => {
    playTurn({ player: seat!, board, cell });
  };

  const restartGame = () => {
    const yourSeat = Math.ceil(Math.random() * 2) as 1 | 2;
    setSeat(yourSeat);
    restart();
  };

  return (
    <>
      <GameHeader seat={seat!} state={gameState} onPlayAgainConfirm={restartGame} />
      <Board state={gameState} seat={seat} onValidTurn={play} />
      <TurnList
        lobbyState={{ playerSeat: seat, started: true }}
        state={gameState}
        RestartButton={
          <RestartButton
            onClick={restartGame}
            text="Restart"
            icon={<FontAwesomeIcon icon={faRedo} />}
          />
        }
      />
    </>
  );
};

export default PlayAI;
