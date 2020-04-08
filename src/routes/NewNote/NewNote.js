import React from "react";
import { Form } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import {s3Upload} from "../../libs/storageLib"
import "./NewNote.css";
import bsCustomFileInput from 'bs-custom-file-input';

import { API } from "aws-amplify"

export default function NewNote(props) {
  const file = React.useRef(null);
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect( () => {
      bsCustomFileInput.init()

      if(props.noteToEdit) setContent(props.noteToEdit.content)
  },[props.noteToEdit])

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];

  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);


    try {
        const attachment = file.current
        ? await s3Upload(file.current)
        : null;

        if(props.noteToEdit) {
          await updateNote({content, attachment})
        } else {
          await createNote({ content, attachment });
        }
        props.history.push("/");
      } catch (e) {
        console.log(e)
        setIsLoading(false);
      }
}


function createNote(note) {
        return API.post("notes", "/notes", {
        body: note
    });
}

function updateNote(note) {
    return API.put("notes", `/notes/${props.noteToEdit.noteId}`, {
      body : note
    })
}

async function deleteNote(note) {
  setIsDeleting(true)

  try {

    await API.del("notes", `/delete/${props.noteToEdit.noteId}`)
    props.history.push("/");
  } catch (e) {
    console.log(e)
    setIsDeleting(false)
  }
}

  const attachmentURL = props.noteToEdit && props.noteToEdit.attachmentURL ?
    <p><a 
      target="_blank"
      rel="noopener noreferrer"
      href={props.noteToEdit.attachmentURL}>{props.noteToEdit.attachment}</a></p>
  : null

  const deleteButton = props.noteToEdit ? 
  <LoaderButton
    block
    size="lg"
    variant="danger"
    defaultText= "Delete Note"
    loadingText="Deleting ..."
    isLoading={isDeleting}
    disabled={isDeleting || isLoading}
    onClick={deleteNote}
  >
    Delete Note
  </LoaderButton>
  : null


  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            placeholder="New Note ..."
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          {attachmentURL}
          <Form.File 
            id="custom-file"
            label="Click to select a file"
            onChange={handleFileChange} 
            type="file" 
            custom
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          defaultText= { props.noteToEdit ? "Save Note Changes" : "Add New Note" }
          loadingText="Saving ..."
          isLoading={isLoading}
          disabled={!validateForm() || isDeleting}
        >
          Create
        </LoaderButton>
        {deleteButton}
      </Form>
    </div>
  );
}