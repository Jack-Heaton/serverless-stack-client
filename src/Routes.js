import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./routes/Home/Home";
import Login from "./routes/Login/Login";
import Signup from "./routes/Signup/Signup";
import VerifyContact from "./routes/VerifyContact/VerifyContact";
import NewNote from "./routes/NewNote/NewNote";

import NotFound from "./routes/NotFound/NotFound";
import AppliedRoute from "./components/AppliedRoutes";

export default function Routes({appProps}) {
  return (
    <Switch>
        <AppliedRoute path="/" exact component={Home} appProps={appProps} />
        <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
        <AppliedRoute path="/signup" exact component={Signup} appProps={appProps} />
        <AppliedRoute path="/verify_mobile" exact component={VerifyContact} appProps={{item:"phone_number", ...appProps}} />
        <AppliedRoute path="/notes/new" exact component={NewNote} appProps={appProps} />

      <Route component={NotFound} />
    </Switch>
  );
}