import React from 'react';
import palette from '../utils/palette';
import { EventParams, Events } from '../../shared/types';
import Button from './Button';

interface LinkProps {
  text: string;
  to: string;
  onClick: () => void;
}

const gameErrors = {
  'not-found': {
    message: () => 'Game not found or has expired.',
    links: [
      ['HOME', '/'],
      ['NEW LOBBY', '/play'],
    ],
  },
  'will-expire': {
    message: (data?: { exp: string }) =>
      data?.exp
        ? `Your game will expire in ${data.exp} minutes.`
        : 'Your game will expire soon.',
    links: [['OKAY', '']],
  },
  'catch-all': {
    message: () => 'Sorry - something went belly up.',
    links: [['HOME', '/']],
  },
};

interface Props {
  error: EventParams[Events.Error];
  dismissError: () => void;
}

// const Button = ({ text, to, onClick }: LinkProps) => (
//   <button
//     onClick={onClick}
//     css={`
//       cursor: pointer;
//       background-color: white;
//       padding: 0.5em;
//       border: 0;
//       box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
//       font-weight: bold;
//       color: #594b5c;
//     `}
//   >
//     {text}
//   </button>
// );

const Modal = ({ error, dismissError }: Props) => {
  const { message, links } = gameErrors[error.code] || gameErrors['catch-all'];
  return (
    <div
      css={`
        border: 1px solid white;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        width: 80%;
        height: 30%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        justify-content: space-evenly;
        align-items: center;
        background-color: ${palette.gameBarBg};
        font-weight: bold;
        color: white;
        box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
      `}
    >
      <span>{message()}</span>
      <div
        css={`
          width: 100%;
          display: flex;
          justify-content: space-around;
          justify-content: space-evenly;
        `}
      >
        {links.map(([text, to]) => (
          <Button borderRadius="4px" to={to} onClick={dismissError}>
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Modal;
