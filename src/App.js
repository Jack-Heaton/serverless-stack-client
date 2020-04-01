import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import Routes from "./Routes"
import "./App.css";

function App(props) {
  return (
    <div className="App container">
      <Navbar bg="light" collapseOnSelect>
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
          </Navbar.Collapse>
          <Nav className="mr-auto">
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
        </Nav>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;