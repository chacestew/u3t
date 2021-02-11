import React from 'react';
import Button from '../../Button';

interface Props {
  onClick: () => void;
  text: string;
  icon: JSX.Element;
}

export default function RestartButton({ onClick, text, icon }: Props) {
  return (
    <Button shadow={false} svgRight padding="0.5em" onClick={onClick}>
      {text}
      {icon}
    </Button>
  );
}
