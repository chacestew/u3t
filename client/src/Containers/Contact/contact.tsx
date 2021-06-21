import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { send } from 'process';
import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '../../Components/Button';
import { media } from '../../styles/mixins';
import palette from '../../utils/palette';
import { Section } from '../About/About';

const emailRegex =
  /^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$/;

const Label = styled.label`
  color: white;
  font-weight: bold;
`;

const Input = styled.input<{ invalid: boolean }>`
  height: 2em;

  ${({ invalid }) => invalid && `border-color: ${palette.red};`}
`;

const Field = styled.div<{ gridArea: string }>`
  display: flex;
  flex-direction: column;
  grid-area: ${(p) => p.gridArea};

  label {
    margin-bottom: 0.5em;
  }
`;

const Textarea = styled.textarea<{ invalid: boolean }>`
  height: 8em;
  resize: vertical;

  ${({ invalid }) => invalid && `border-color: ${palette.red};`}
`;

const B = styled(Button)`
  grid-area: 'button';
`;

const Form = styled(Section)`
  display: flex;
  flex-direction: column;
  color: white;

  > * + * {
    margin-top: 1em;
  }

  button {
    margin-top: 1em;

    ${media.aboveMobileS`
      align-self: flex-end;
    `}
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-areas:
    'name'
    'email'
    'message';

  ${media.aboveMobileL`
  grid-template-areas:
    'name email'
    'message message';
  `}
`;

const Text = styled.p<{ color: string }>`
  color: ${({ color }) => color};
`;

type SentStates = 'ready' | 'sending' | 'sent' | 'failed';

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [state, setState] = useState<ContactBody>({ name: '', email: '', message: '' });
  const [sentStatus, setSentStatus] = useState<SentStates>('ready');
  const [invalidFields, setInvalidFields] = useState<(keyof ContactBody)[]>([]);

  const set = (key: keyof ContactBody, value: string) =>
    setState((s) => ({ ...s, [key]: value }));

  const validate = () => {
    const invalidFields = Object.entries(state)
      .filter(
        ([key, value]) => value.length < 2 || (key === 'email' && !emailRegex.test(value))
      )
      .map(([key]) => key as keyof ContactBody);

    setInvalidFields(invalidFields);

    return !invalidFields.length;
  };

  return (
    <div>
      <Form
        as="form"
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();

          const isValid = validate();

          if (!isValid) {
            setSentStatus('ready');
            return;
          }

          setSentStatus('sending');

          const response = await fetch('http://localhost:8001/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
          });

          if (response.ok) {
            setSentStatus('sent');
          } else {
            setSentStatus('failed');
          }
        }}
      >
        <h2>Contact Form</h2>
        <Text color={palette.white}>
          Please feel free to send me your questions or share any feedback or bug reports
          via the form below.
        </Text>
        <FormGrid>
          <Field gridArea="name">
            <Label htmlFor="name">Your name</Label>
            <Input
              name="name"
              id="name"
              invalid={invalidFields.includes('name')}
              onChange={(e) => set('name', e.target.value)}
              value={state.name}
            />
          </Field>
          <Field gridArea="email">
            <Label htmlFor="email">Your email address</Label>
            <Input
              name="email"
              id="email"
              type="email"
              invalid={invalidFields.includes('email')}
              onChange={(e) => set('email', e.target.value)}
              value={state.email}
            />
          </Field>
          <Field gridArea="message">
            <Label htmlFor="message">Message</Label>
            <Textarea
              name="message"
              id="message"
              invalid={invalidFields.includes('message')}
              onChange={(e) => set('message', e.target.value)}
              value={state.message}
            />
          </Field>
        </FormGrid>
        {sentStatus === 'failed' && (
          <Text color={palette.red}>Something went wrong. Please try again.</Text>
        )}
        {!!invalidFields.length && (
          <Text color={palette.red}>Please complete the highlighted fields.</Text>
        )}
        {sentStatus === 'sent' && (
          <Text color={palette.white}>
            Thank you for reaching out. I hope to get back to you soon!
          </Text>
        )}
        <B
          disabled={sentStatus === 'sent' || sentStatus === 'sending'}
          type="submit"
          $rounded
          $shadow
        >
          {sentStatus === 'sent'
            ? 'Sent!'
            : sentStatus === 'sending'
            ? 'Sending...'
            : 'Send Message'}
        </B>
      </Form>
    </div>
  );
}