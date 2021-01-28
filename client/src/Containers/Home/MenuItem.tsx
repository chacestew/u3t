import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import palette from '../../utils/palette';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Button from '../../Components/Button';

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
    color: ${palette.white};
  }
`;

const Description = styled.p`
  margin-bottom: 0;
  color: ${palette.white};
`;

interface Props {
  url: string;
  text: string;
  icon: IconProp;
  description: string;
}

export default ({ url, text, icon, description }: Props) => {
  return (
    <NavContainer>
      <Button svgLeft borderRadius="4px" to={url}>
        <FontAwesomeIcon icon={icon} />
        {text}
      </Button>
      <Description>{description}</Description>
    </NavContainer>
  );
};
