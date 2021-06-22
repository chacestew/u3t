import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { media } from '../styles/mixins';
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
  position: relative;
  display: flex;
  flex: 1;
  justify-content: space-around;
  justify-content: space-evenly;
`;

const NavItemStyles = css`
  height: 50px;
  font-weight: bold;
  align-items: center;
  padding: 0 1em;
  background-color: ${palette.primaryDark};
`;

const NavItem = styled(NavLink)<{ $alwaysShow?: boolean }>`
  ${NavItemStyles}

  ${(p) => (p.$alwaysShow ? 'display: inline-flex;' : 'display: none;')}
  ${media.aboveMobileL`display: inline-flex;`}

  &.active {
    background-color: ${palette.primaryLight};
  }
`;

const DropMenuNavItem = styled(Link)`
  ${NavItemStyles}
  display: flex;
  justify-content: center;
`;

const Logo = styled(NavItem)`
  padding: 0 0.5em;
  font-size: 2em;
  background-color: transparent;
`;

const MenuIconButton = styled.button`
  cursor: pointer;
  color: white;
  background-color: transparent;
  outline: none;
  border: none;
  display: inline-flex;
  align-items: center;
  padding: 1em;

  ${media.aboveMobileL`
    display: none;
  `}
`;

const Flex = styled.div`
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 10;
  min-width: 50vw;
`;

const DropMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonElement = menuButtonRef.current;

  useEffect(() => {
    const closeModal = (e: MouseEvent | TouchEvent) => {
      if (!menuButtonElement || menuButtonElement.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', closeModal);
    document.addEventListener('touchstart', closeModal);

    () => {
      document.removeEventListener('mousedown', closeModal);
      document.removeEventListener('touchstart', closeModal);
    };
  }, [menuButtonElement]);

  return (
    <MenuIconButton ref={menuButtonRef} onClick={() => setIsOpen((current) => !current)}>
      <FontAwesomeIcon icon={faBars} />
      {isOpen && (
        <Flex>
          <DropMenuNavItem to="/about">ABOUT</DropMenuNavItem>
          <DropMenuNavItem to="/contact">CONTACT</DropMenuNavItem>
        </Flex>
      )}
    </MenuIconButton>
  );
};

const Header = () => (
  <StyledHeader>
    <StyledNav>
      <Logo exact to="/" $alwaysShow>
        U3T
      </Logo>
      <NavList>
        <NavItem exact to="/" $alwaysShow>
          Play
        </NavItem>
        <NavItem to="/rules" $alwaysShow>
          Learn
        </NavItem>
        <NavItem to="/about">About</NavItem>
        <NavItem to="/contact">Contact</NavItem>
        <DropMenu />
      </NavList>
    </StyledNav>
  </StyledHeader>
);

export default Header;
