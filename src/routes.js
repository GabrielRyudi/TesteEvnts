
import React from "react";
import { BrowserRouter, Route, Switch} from "react-router-dom";

import Landing from './pages/landing';
import Lista from './pages/lista';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={ Landing } />
      <Route path="/lista" component={ Lista } />
      <Route path="*" component={() => <h1>Pagina não encontrada</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
