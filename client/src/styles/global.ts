import { createGlobalStyle, css } from 'styled-components';
import styledNormalize from 'styled-normalize';
import palette from '../utils/palette';
import { media } from '../styles/mixins';

const globalStyles = css`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    padding: 0;
  }

  body {
    font-family: 'Open Sans', sans-serif;

    #root {
      background-color: ${palette.background};
      height: 100vh;
      min-height: 100vh;
      margin: 0 auto;
      display: flex;
      flex-direction: column;

      ${media.aboveMobileL`height: auto`}
    }
  }
`;

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  ${globalStyles}
`;

export default GlobalStyle;
