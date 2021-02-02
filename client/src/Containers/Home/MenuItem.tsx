import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import palette from '../../utils/palette';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Button from '../../Components/Button';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.p`
  color: ${palette.white};
  line-height: 1.5;
  margin-top: 1em;
  font-size: 16px;
`;

interface Props {
  url: string;
  text: string;
  icon: IconProp;
  description: string;
}

function MenuItem({ url, text, icon, description }: Props) {
  return (
    <NavContainer>
      <Button svgLeft borderRadius="4px" to={url}>
        <FontAwesomeIcon icon={icon} />
        {text}
      </Button>
      <Description>{description}</Description>
    </NavContainer>
  );
}

export default MenuItem;
