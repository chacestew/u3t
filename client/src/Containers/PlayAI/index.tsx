import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { generateRandomMove, ITurnInput, Player } from '@u3t/common';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import GameHeader from '../../Components/GameArea/Header/GameHeader';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import useGameReducer from '../../hooks/useGameReducer';
import { RelativeBox } from '../../styles/Utils';

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
      <Helmet>
        <title>U3T - AI</title>
        <link rel="canonical" href="https://u3t.app/ai" />
        <meta
          name="description"
          content="Play ultimate tic-tac-toe against a computer opponent."
        />
      </Helmet>
      <GameHeader seat={seat!} state={gameState} onPlayAgainConfirm={restartGame} />
      <RelativeBox>
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
      </RelativeBox>
    </>
  );
};

export default PlayAI;
