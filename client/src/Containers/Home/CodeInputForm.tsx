import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../Components/Button';
import palette from '../../utils/palette';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';

export type CodeInputMode = null | 'join' | 'spectate';

const Container = styled.div`
  grid-area: join-code;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25em;
`;

const Form = styled.form`
  display: flex;

  & > input {
    width: 0;
    flex: 1;
    align-self: stretch;
    margin-right: 1em;
    color: ${palette.primaryDark};
    padding: 0 0.5em;
  }
`;

export default function CodeInputForm({ mode }: { mode: CodeInputMode }) {
  const [code, setCode] = useState('');
  const history = useHistory();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mode === 'join') {
        history.push(`/game/${code}`);
      } else if (mode === 'spectate') {
        history.push(`/game/${code}/spectate`);
      }
    },
    [mode, code, history]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value === '' || /^[A-Z]+$/.test(value)) {
      setCode(value);
    }
  };

  return (
    <Container>
      <Label>Input game code to {mode}</Label>
      <Form onSubmit={onSubmit}>
        <input maxLength={4} value={code} placeholder="CODE" onChange={onChange} />
        <Button type="submit" rounded shadow disabled={code.length !== 4}>
          <FontAwesomeIcon icon={faCheck} />
        </Button>
      </Form>
    </Container>
  );
}
