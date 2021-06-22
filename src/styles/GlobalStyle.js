import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
    font-size: 16px;
    font-family: 'Noto Sans KR', sans-serif;

    @media ${({ theme }) => theme.media.mobile} {
      font-size: 12px;
    }
  }

  body {
    @media ${({ theme }) => theme.media.desktop} {
      max-width: 1080px;
      margin: auto;
    }

    @media ${({ theme }) => theme.media.tablet} {
      width: 100vw;
    }

    @media ${({ theme }) => theme.media.mobile} {
      width: 100%;
    }
  }

  
  
  button,
  input {
    background-color: transparent;
    outline: none;
    border: none;
    font-size: inherit;
  }

ul,li {
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
}
  `;
export default GlobalStyle;
