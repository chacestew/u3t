import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import palette from '../../utils/palette';
import { Article } from '../Rules/index';

const Section = styled.div<{ $dark?: boolean }>`
  padding: 1em;

  ${({ $dark }) => $dark && `background-color: ${palette.primaryDark};`}

  > * + * {
    margin-top: 1em;
  }
`;

const Anchor = styled.a<{ iconLeft?: boolean }>`
  & > span {
    text-decoration: underline;
    margin-right: 0.25em;
  }

  &:hover > span {
    text-decoration: none;
  }
`;

const InlineLink = styled(Link)`
  text-decoration: underline;
`;

const CoffeeButton = styled.a`
  display: flex;
  justify-content: center;
`;

export default function About() {
  return (
    <Article>
      <Section>
        <h3>Features</h3>
        <p>
          <b>u3t.app</b> is a web implementation of ultimate tic-tac-toe, a beautifully
          complex expansion on regular tic-tac-toe. You can find out more about the game
          on its{' '}
          <Anchor href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            <span>Wikipedia page</span>
            <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
          </Anchor>
          .
        </p>
        <p>
          The online multiplayer mode supports reconnection and spectators, and includes a
          turn log to keep track of the game.
        </p>
        <p>
          This site also also meets the requirements for a progressive web application
          (PWA), so you can{' '}
          <Anchor href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            <span>install it</span>
            <FontAwesomeIcon size="sm" icon={faDownload} />
          </Anchor>{' '}
          on your device and continue playing even while offline.
        </p>
      </Section>
      <Section $dark>
        <h3>Open Source</h3>
        <p>
          This application was developed in <b>Typescript</b> using <b>React</b>, and{' '}
          <b>Node.js</b> and <b>Socket.IO</b> to power the backend.
        </p>
        <p>
          The complete source code is available for learning purposes on{' '}
          <Anchor href="https://www.github.com/chacestew">
            <span>GitHub</span>
            <FontAwesomeIcon icon={faGithub} />
          </Anchor>
          .
        </p>
      </Section>
      <Section>
        <h3>Thank you</h3>
        <p>
          If you enjoyed yourself or you have any questions or feedback, please let me
          know via the contact form <InlineLink to="/contact">here</InlineLink>.
        </p>
        <p>
          This application is provided freely for entertainment and education and will
          remain ad-free forever. You can help to keep me and the server chugging through
          coffee donations below.
        </p>
        <CoffeeButton
          href="https://www.buymeacoffee.com/u3tapp"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"
            alt="Buy Me A Coffee"
            height="60px"
            width="217px"
          />
        </CoffeeButton>
        <p>Thanks for playing!</p>
        <p>- Chace</p>
      </Section>
    </Article>
  );
}
