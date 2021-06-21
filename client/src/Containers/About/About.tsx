import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

import { boxShadow, media } from '../../styles/mixins';
import palette from '../../utils/palette';

const Article = styled.div`
  // background-color: ${palette.primaryLight};
  // padding: 1em;
`;

export const Section = styled.div`
  display: flex;
  padding: 1em;
  ${boxShadow}

  ${media.aboveMobileL`
    // margin-top: 1em;
    // border-radius: 6px;
  `}

  background-color: ${palette.primaryLight};
  // border-bottom: 2px solid ${palette.primaryLight};

  img {
    object-fit: contain;
  }
`;

const Text = styled.div`
  width: 100%;
  color: white; //${palette.primaryLight};
  background-color: ${palette.primaryLight};
  margin-${({ side }) => side}: 1em;
  line-height: 1.25;

  h3 {
    color: ${palette.yellow};
    margin: 0;
    margin-bottom: 1em;
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

  & > svg {
    // ${(p) => (p.iconLeft ? `margin-right: 0.25em;` : 'margin-left: 0.25em;')}
  }
`;

export default function About() {
  return (
    <Article>
      <Section>
        <Text>
          <h3>Origins</h3>
          u3t.io is an online implementation of <i>Ultimate tic-tac-toe</i>, a beautifully
          complex expansion on regular tic-tac-toe. You can find out more about the game
          on its{' '}
          <Anchor href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            <span>Wikipedia page</span>
            <FontAwesomeIcon size="sm" icon={faExternalLinkAlt} />
          </Anchor>
          .
        </Text>
      </Section>
      <Section>
        <Text>
          <h3>Features</h3>
          This site is also a progressive web application (PWA), meaning you can{' '}
          <button
            css={`
              padding: 0;
              outline: 0;
              border: 0;
              padding: 0;
              // border: 1px solid;
              // padding: 0.25em;
              // border-radius: 4px;
              background-color: inherit;
              color: inherit;
              cursor: pointer;

              & > span {
                font-weight: bold;
                // text-decoration: underline;
              }

              & > svg {
                vertical-align: top;
              }

              &:hover > span {
                text-decoration: none;
              }
            `}
          >
            <FontAwesomeIcon size="sm" icon={faDownload} /> <span>install it</span>
          </button>{' '}
          on your mobile device and play even while offline.
          <br />
          <br />
          The online multiplayer supports reconnection and spectating, and comes with a
          handy turn log to keep track of the game flow.
        </Text>
      </Section>
      <Section>
        <Text>
          <h3>Open Source</h3>
          u3t is developed in Typescript and Node.js using React and Socket.IO. The source
          code is made available on{' '}
          <Anchor href="https://www.github.com/chacestew">
            <span>Github</span>
            <FontAwesomeIcon icon={faGithub} />
          </Anchor>{' '}
          for learning purposes.
        </Text>
      </Section>
      <Section>
        <Text>
          <h3>u3t.io</h3>
          If you have feedback or questions, please reach out at email@example.com!
        </Text>
      </Section>
    </Article>
  );
}
