import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./routes/Home/Home";
import Login from "./routes/Login/Login";
import Signup from "./routes/Signup/Signup";
import VerifyContact from "./routes/VerifyContact/VerifyContact";
import NewNote from "./routes/NewNote/NewNote";
import EditNote from "./routes/EditNote/EditNote";

import NotFound from "./routes/NotFound/NotFound";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute"
import AppliedRoute from "./components/AppliedRoutes";

export default function Routes({appProps}) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
      <AuthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} />
      <AuthenticatedRoute path="/verify_mobile" exact component={VerifyContact} appProps={{item:"phone_number", ...appProps}} />
      <AuthenticatedRoute path="/notes/new" exact component={NewNote} appProps={appProps} />
      <AuthenticatedRoute path="/notes/:id" exact component={EditNote} appProps={appProps} />

      <Route component={NotFound} />
    </Switch>
  );
}