import { useEffect, useState } from "react";
import CreateNote from "./CreateNote";
import Note from "./Note";
import "./notes.css";
import { v4 as uuidv4 } from "uuid";

const Notes = () => {
  const [inputText, setInputText] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load notes from localStorage (once)
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  // Save notes to localStorage (on change)
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const editHandler = (id, text) => {
    setEditId(id);
    setInputText(text);
  };

  const saveHandler = () => {
    if (!inputText.trim()) return;

    if (editId !== null) {
      setNotes(
        notes.map((note) =>
          note.id === editId ? { ...note, text: inputText } : note
        )
      );
    } else {
      setNotes([
        ...notes,
        {
          id: uuidv4(),
          text: inputText,
        },
      ]);
    }

    setInputText("");
    setEditId(null);
  };

  const deleteHandler = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="notes">
      {notes.map((note) =>
        editId === note.id ? (
          <CreateNote
            key={note.id}
            inputText={inputText}
            setInputText={setInputText}
            saveHandler={saveHandler}
          />
        ) : (
          <Note
            key={note.id}
            id={note.id}
            text={note.text}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
          />
        )
      )}

      {editId === null && (
        <CreateNote
          inputText={inputText}
          setInputText={setInputText}
          saveHandler={saveHandler}
        />
      )}
    </div>
  );
};

export default Notes;
