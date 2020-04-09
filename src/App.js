import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import Routes from "./Routes"
import "./App.css";

import Auth from "@aws-amplify/auth"

//Import need app icons
import { library } from '@fortawesome/fontawesome-svg-core';
import {  faSyncAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

library.add(
  faSyncAlt,
  faCheckCircle
)

function App(props) {

  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isAuthenticating, setIsAuthenticating] = React.useState(true)

  useEffect (() => {
    onLoad();
  },[])

  async function onLoad () {
      
      try {
        await Auth.currentSession();
        setIsAuthenticated(true)
      }
      catch (e) {
        if( e !== "No current user") {
          console.error(e)
        }
      }

      setIsAuthenticating(false)
  }

  async function handleLogout() { 
    await Auth.signOut()
    setIsAuthenticated(false)
    props.history.push('/login')
  }

  const loginNav = isAuthenticated ?
    <Link to="/login">
      <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
    </Link>
  :
    <React.Fragment>
      <Nav.Item>
        <LinkContainer to="/signup">
          <Nav.Link>Signup</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/login">
          <Nav.Link>Login</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </React.Fragment>

  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar bg="light" collapseOnSelect>
        <Navbar.Brand>
          <Link to="/">Scratch</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
        </Navbar.Collapse>
        <Nav className="mr-auto">
          {loginNav}
        </Nav>
      </Navbar>
      <Routes appProps={{ isAuthenticated, setIsAuthenticated }} />
    </div>
  );
}

export default withRouter(App);