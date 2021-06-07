import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import palette, { gridSize } from '../utils/palette';

const StyledHeader = styled.header`
  display: flex;
  background-color: ${palette.primaryDark};
  color: ${palette.white};
  height: 50px;
  font-weight: bold;
  justify-content: center;
`;

const StyledNav = styled.div`
  max-width: ${gridSize};
  width: 100%;
  display: flex;
`;

const NavList = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-around;
  justify-content: space-evenly;
`;

const NavItem = styled(NavLink)<{ $logo?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0 1em;

  &.active {
    background-color: ${palette.primaryLight};
  }

  ${(p) =>
    p.$logo &&
    `&& {
      font-size: 2em;
      background-color: transparent;
    }
  `}
`;

const Header = () => (
  <StyledHeader>
    <StyledNav>
      <NavItem exact to="/" $logo>
        U3T
      </NavItem>
      <NavList>
        <NavItem exact to="/">
          PLAY
        </NavItem>
        <NavItem to="/rules">LEARN</NavItem>
      </NavList>
    </StyledNav>
  </StyledHeader>
);

export default Header;
