import React from 'react';
import palette from '../utils/palette';
import styled, { css } from 'styled-components';
import { Link as ReactRouterLink } from 'react-router-dom';

interface Props {
  borderRadius?: string;
  backgroundColor?: string;
  padding?: string;
  shadow?: boolean;
  fontColor?: string;
  to?: string;
  svgRight?: boolean;
  svgLeft?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const styles = css<Props>`
  ${({
    borderRadius = '0',
    backgroundColor = 'white',
    padding = '10px',
    shadow = true,
    fontColor = palette.textColor2,
    svgLeft,
    svgRight,
  }) => `
  display: flex;
  justify-content: center;
  cursor: pointer;
  border: 0;
  outline: 0;
  background-color: ${backgroundColor};
  padding: ${padding};
  border-radius: ${borderRadius};
  ${shadow && `box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5)`};
  font-weight: bold;
  color: ${fontColor};
  text-decoration: none;
  ${svgLeft ? `svg { margin-right: 0.5em; }` : ''}
  ${svgRight ? `svg { margin-left: 0.5em; }` : ''}
  `}
`;

const StyledButton = styled.button`
  ${styles}
`;

const Link = styled(ReactRouterLink)`
  ${styles}
`;

const Button = ({ to, ...rest }: Props) =>
  !!to ? <Link to={to} {...rest} /> : <StyledButton {...rest} />;

export default Button;
