import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import palette from '../../utils/palette';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const NavItem = styled(Link)`
  text-decoration: none;
  padding: 10px;
  background: ${palette.menuButtonBg};
  color: ${palette.textColor2};
  border-radius: 4px;
  width: 100%;
  font-weight: bold;
  justify-content: center;
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
  display: flex;

  svg {
    margin-right: 1em;
  }
`;

const NavContainer = styled.div`
  line-height: 1.15;
  font-family: 'Open Sans', sans-serif;
  box-sizing: inherit;
  width: 100%;
  // border: 1px solid silver;
  // border-radius: 4px;
  // padding: 1em 1em;
  display: flex;
  flex-direction: column;

  p {
    line-height: 1.5;
    margin: 0;
    margin-top: 1em;
    font-weight: bold;
    font-size: 14px;
    color: ${palette.textColor};
  }
`;

const Description = styled.p`
  margin-bottom: 0;
  color: ${palette.textColor};
`;

interface Props {
  url: string;
  text: string;
  icon: IconProp;
  description: string;
}

export default ({ url, text, icon, description, lastChild }: Props) => {
  return (
    <NavContainer lastChild={lastChild}>
      <NavItem to={url}>
        <FontAwesomeIcon icon={icon} />
        {text}
      </NavItem>
      <Description>{description}</Description>
    </NavContainer>
  );
};
