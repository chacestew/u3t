import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import palette, { gridSize } from '../utils/palette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

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
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    margin: 0;
    overflow: hidden;

    li {
      padding: 0 2em;
      display: inline;
    }
  }

  a {
    font-weight: bold;
    text-decoration: none;
    color: ${palette.textColor};
  }
`;

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  height: 50px;
  background-color: ${palette.header};
`;

const FooterInner = styled.div`
  max-width: 580px;
  display: flex;
  padding: 1em;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  color: ${palette.textColor};
  font-weight: bold;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <FooterInner>
        <span>© Chace Stewart {new Date().getFullYear()}</span>
        <div>
          <Link css="text-decoration: underline;" to="/about">
            About
          </Link>
          <a css="margin-left: 1em;" href="https://www.github.com/chacestew">
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
          <a css="margin-left: 1em;" href="https://www.github.com/chacestew">
            <FontAwesomeIcon icon={faDiscord} size="lg" />
          </a>
          <FontAwesomeIcon css="margin-left: 1em;" icon={faDownload} size="lg" />
        </div>
      </FooterInner>
    </StyledFooter>
  );
};

export default Footer;
