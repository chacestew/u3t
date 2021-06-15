import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import palette, { gridSize } from '../utils/palette';

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  height: 50px;
  background-color: ${palette.primaryDark};
`;

const FooterInner = styled.div`
  max-width: 580px;
  display: flex;
  padding: 1em;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  color: ${palette.white};
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
