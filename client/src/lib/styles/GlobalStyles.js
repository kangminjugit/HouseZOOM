import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import palette from './palette';

const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  min-height: 100%;
  }

  #root{
    min-height: 100%;
    /* background-color: ${palette.background}; */
  }

  html{
    height: 100%;
  }

  a{
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: inherit;
  }

  code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  }

`;

export default GlobalStyle;
