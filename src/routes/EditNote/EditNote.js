import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import NewNote from "../NewNote/NewNote"
import LoaderPage from "../../components/LoaderPage"
export default function Notes(props) {
  const file = useRef(null);
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
        setIsLoading(false)
      } catch (e) {
        console.log(e);
        setIsLoading(false)
      }
    }

    onLoad();
  }, [props.match.params.id]);

  if(isLoading) {
    return <LoaderPage />
  }

  return (
    <NewNote noteToEdit={note} {...props}/>
  );
}