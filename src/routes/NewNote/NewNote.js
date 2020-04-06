import React from "react";
import { Form } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import config from "../../config";
import "./NewNote.css";
import bsCustomFileInput from 'bs-custom-file-input';

import { API } from "aws-amplify"

export default function NewNote(props) {
  const file = React.useRef(null);
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect( () => {
      bsCustomFileInput.init()
  })

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    console.log(content)

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);


    try {
        await createNote({ content });
        props.history.push("/");
      } catch (e) {
        alert(e);
        setIsLoading(false);
      }
}


function createNote(note) {
        return API.post("notes", "/notes", {
        body: note
    });
}


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
          defaultText="Add New Note"
          loadingText="Saving ..."
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
}