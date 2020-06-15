import React from 'react';
import styled from 'styled-components';
import { Bar } from '../styles';

const SkeletonContent = styled.div`
  height: 2em;
  width: 25%;
  background: silver;
`;

const Loading = () => (
  <Bar>
    <SkeletonContent />
    <SkeletonContent />
  </Bar>
);

export default Loading;
