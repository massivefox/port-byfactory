/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import "@babel/polyfill";

// Import all the third party stuff
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import FontFaceObserver from "fontfaceobserver";
import { QueryClient, QueryClientProvider } from "react-query";
import { createGlobalStyle } from "styled-components";
import history from "utils/history";
import "sanitize.css/sanitize.css";
import LanguageProvider from "components/LanguageProvider";
import { ConnectedRouter } from "connected-react-router";
import "semantic-ui-css/semantic.min.css";
import { RecoilRoot } from "recoil";
// Import root app
import App from "containers/App";

// Import Language Provider

// Load the favicon and the .htaccess file
import "!file-loader?name=[name].[ext]!./images/favicon.ico";
import "file-loader?name=.htaccess!./.htaccess"; // eslint-disable-line import/extensions

import { ToastContainer } from "react-toastify";
import { NovuCredentials } from "./components/Novu/credential";
import "react-toastify/dist/ReactToastify.min.css";
import configureStore from "./configureStore";

// Import i18n messages
import { translationMessages } from "./i18n";
import GlobalStyle from "./global-styles";

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver("Open Sans", {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add("fontLoaded");
});

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById("app");
const root = createRoot(MOUNT_NODE);

const render = (messages) => {
  root.render(
    <Provider store={store}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider messages={messages}>
            {/* <ConnectedRouter history={history}> */}
            <BrowserRouter>
              <GlobalStyle />
              <App />
              {/* TODO: Apply after novu backend */}
              {/* <NovuCredentials /> */}
              <ToastContainer autoClose={2500} style={{ zIndex: "10001" }} />
            </BrowserRouter>
            {/* </ConnectedRouter> */}
          </LanguageProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </Provider>
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(["./i18n", "containers/App"], () => {
    // root.unmount();
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise((resolve) => {
    resolve(import("intl"));
  })
    .then(() =>
      Promise.all([
        import("intl/locale-data/jsonp/en.js"),
        import("intl/locale-data/jsonp/ko.js"),
      ])
    ) // eslint-disable-line prettier/prettier
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === "production") {
  require("offline-plugin/runtime").install(); // eslint-disable-line global-require
}
