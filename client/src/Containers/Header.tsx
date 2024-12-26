import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../../assets/logo.png';
import palette, { gridSize } from '../utils/palette';
import { media } from '../styles/mixins';

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
  position: relative;
  display: flex;
  flex: 1;
  justify-content: space-around;
  justify-content: space-evenly;
`;

const NavItem = styled(NavLink)`
  display: inline-flex;
  height: 50px;
  font-weight: bold;
  align-items: center;
  background-color: ${palette.primaryDark};

  padding: 0 0.5em;
  ${media.aboveMobileS`padding: 0 1em;`}

  &.active {
    background-color: ${palette.primaryLight};
  }
`;

const Logo = styled(Link)`
  padding: 0 1em;
  display: flex;
  align-items: center;
`;

const Header = () => (
  <StyledHeader>
    <StyledNav>
      <Logo to="/">
        <img src={logo} width="80px" height="27px" alt="U3T logo" />
      </Logo>
      <NavList>
        <NavItem exact to="/">
          Play
        </NavItem>
        <NavItem to="/learn">Learn</NavItem>
        <NavItem to="/about">About</NavItem>
      </NavList>
    </StyledNav>
  </StyledHeader>
);
export default Header;
