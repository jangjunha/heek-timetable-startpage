import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createGlobalStyle } from "styled-components";

import Index from "./pages/index";
import ExampleHome from "./pages/example-home";
import Pages from "./pages/pages";
import { GRAY_0, GRAY_9 } from "./utils/color";

const GlobalStyle = createGlobalStyle`
  html {
    color: ${GRAY_0};
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  body {
    background-color: ${GRAY_9};
  }

  a {
    color: inherit;
  }
`;

const App = (): React.ReactElement => (
  <>
    <GlobalStyle />
    <Router>
      <Switch>
        <Route path="/" exact={true} component={Index} />
        <Route path="/example" exact={true} component={ExampleHome} />
        <Route path="/p" component={Pages} />
      </Switch>
    </Router>
  </>
);

export default App;
