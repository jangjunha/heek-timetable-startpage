import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import Editor from "./editor";
import Home from "./home";

const Pages = (): React.ReactElement => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:id`} component={Home} exact={true} />
      <Route path={`${path}/:id/edit`} component={Editor} exact={true} />
    </Switch>
  );
};

export default Pages;
