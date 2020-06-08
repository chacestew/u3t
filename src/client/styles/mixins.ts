import { css } from 'styled-components';

export const flexColumns = `
  display: flex;
  flex-direction: column;
`;

export const media = {
  aboveMobile: (styles: TemplateStringsArray) => css`
    @media (min-width: 426px) {
      ${css(styles)}
    }
  `,
};
