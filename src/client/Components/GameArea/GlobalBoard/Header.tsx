import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { StaticCell } from '../LocalBoard/Cell';
import palette from '../../../utils/palette';

const HeaderText = styled.div<{ fontSize?: string }>`
  font-size: ${props => props.fontSize || '18px'};
  font-weight: bold;
  display: flex;
  align-items: baseline;
`;

const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.gameBarBg};
  padding: 1em;
  color: ${palette.textColor};
  margin-bottom: 10px;
`;

const HeaderCell = styled(StaticCell)`
  margin-left: 10px;
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

export const Header = ({
  children,
  turn,
  seat,
}: {
  children: React.ReactNode;
  turn: number;
  seat: 1 | 2 | null;
}) => {
  if (children) {
    return <Bar>{children}</Bar>;
  }
  return (
    <Bar>
      <HeaderText>
        You are <HeaderCell cellType={seat} />
      </HeaderText>
      <HeaderText
        css={`
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: baseline;
        `}
      >
        <HeaderCell cellType={turn % 2 ? 1 : 2} /> to play
      </HeaderText>
    </Bar>
  );
};

export const Loading = () => {
  return (
    <>
      <div
        css={`
          height: 32px;
          width: 30%;
          background: silver;
        `}
      />
      <div
        css={`
          height: 32px;
          width: 30%;
          background: silver;
        `}
      />
    </>
  );
};

export const ShareHeader = () => {
  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <HeaderText
      css={`
        cursor: pointer;
      `}
      onClick={handleCopy}
    >
      <div>
        <b>Share link to your opponent:</b>{' '}
        {window.location.host + window.location.pathname}{' '}
        <FontAwesomeIcon icon={faCopy} />
      </div>
    </HeaderText>
  );
};
