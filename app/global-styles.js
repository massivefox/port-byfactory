import { createGlobalStyle } from 'styled-components';

// const GlobalStyle = createGlobalStyle`
// html {
//   height: 100%;
//   overflow: scroll;
// }

// #title {
//   left: 0;
//   right: 0;
//   color: #FFF;
//   text-align: center;
//   font-family: "lato", sans-serif;
//   font-weight: 300;
//   font-size: 50px;
//   letter-spacing: 10px;
//   padding-left: 10px;
// }
// #title span {
//   background: -webkit-linear-gradient(white, #38495a);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// }

// @keyframes animStar {
//   from {
//     transform: translateY(0px);
//   }
//   to {
//     transform: translateY(-2000px);
//   }
// }
// `;

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretendard', sans-serif;
  }

  .header, .button, h1, h2, h3, h4, h5, p, div {
    font-family: 'Pretendard', sans-serif !important;
  }

  .ui.dimmer {
  background-color: rgba(0,0,0,0.25) !important;
  }

  .inverted.dimmer {
    background-color: rgba(255,255,255,.6) !important;
  }

  .ui.page.dimmer.desktop {
    width: calc(100vw - 235px);
    left: 235px !important;
  }

  .ui.page.dimmer.global {
    width: 100vw;
    left: 0px !important;
  }
`;

export default GlobalStyle;
