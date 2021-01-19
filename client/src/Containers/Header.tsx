import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import palette, { gridSize } from '../utils/palette';
import { media } from '../styles/mixins';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.header};
  color: ${palette.textColor};
  height: 50px;
  font-weight: bold;

  nav {
    padding: 1em;
    max-width: ${gridSize};
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    display: flex;
    align-items: center;

    .logo {
      font-size: 2em;
      margin-right: 10px;
    }

    .sub-logo {
      font-size: 1.5em;
      opacity: 0.7;
    }
  }

  div {
    height: 100%;
    display: flex;
    align-items: center;
  }

  ul {
    padding: 0;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    margin: 0;
    overflow: hidden;

    li {
      padding-left: 3em;
      ${media.aboveMobileL`padding-left: 5em;`}
      display: inline;
    }
  }

  a {
    font-weight: bold;
    text-decoration: none;
    color: ${palette.textColor};
  }
`;

const Header = () => (
  <StyledHeader>
    <nav css="overflow: hidden">
      <div>
        <Link className="logo" to="/">
          U3T
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/">PLAY</Link>
        </li>
        <li>
          <Link to="/rules">LEARN</Link>
        </li>
        <li>
          <DevBox />
        </li>
      </ul>
    </nav>
  </StyledHeader>
);

const DevBox = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dev = checked;
  }, [checked]);

  const handleChecked = () => {
    setChecked(!checked);
  };

  return (
    <div>
      Insta-End
      <input
        css="margin-left: 1em;"
        type="checkbox"
        checked={checked}
        onChange={handleChecked}
      />
    </div>
  );
};

export default Header;
