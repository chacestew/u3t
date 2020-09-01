import React from 'react';
import palette from '../utils/palette';
import styled, { css } from 'styled-components';
import { Link as ReactRouterLink } from 'react-router-dom';

const styles = css`
  cursor: pointer;
  background-color: white;
  padding: 0.5em;
  border: 0;
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
  font-weight: bold;
  color: #594b5c;
  text-decoration: none;
`;

const StyledButton = styled.button`
  ${styles}
`;

const Link = styled(ReactRouterLink)`
  ${styles}
`;

const Button = ({ to, ...rest }: { to: string }) =>
  !!to ? <Link to={to} {...rest} /> : <StyledButton {...rest} />;

export default Button;
