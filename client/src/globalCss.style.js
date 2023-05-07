import { createGlobalStyle } from 'styled-components';

const GlobalCSS = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    
  }
  body{
    background: linear-gradient(179.4deg, rgb(12, 20, 69) -16.9%, rgb(33, 33, 33) 119.9%);
    min-height: 100vh;

  }
`;

export default GlobalCSS;