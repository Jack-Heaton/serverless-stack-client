import React, { useState, useEffect } from "react";
import {LinkContainer} from "react-router-bootstrap"
import { ListGroup } from "react-bootstrap";
import LoaderPage from "../../components/LoaderPage"
import "./Home.css";
import {API} from "aws-amplify"

export default function Home(props) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }
  
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [props.isAuthenticated]);
  
  function loadNotes() {
    return API.get("notes","/notes");
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).sort( (a,b) => b.createdAt - a.createdAt ).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroup.Item className="note-item Home">
            <h5>{note.content.trim().split("\n")[0]}</h5>
            <small>{"Created: " + new Date(note.createdAt).toLocaleString()}</small>
          </ListGroup.Item>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroup.Item>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroup.Item>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h3>Your Notes</h3>
        <hr/>
        <ListGroup className="note-list">
          {isLoading ? <LoaderPage /> : renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}