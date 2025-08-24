import {
  createApp,
  createElement,
  createComponent,
} from "../../packages/runtime/dist/fe-fwk-ts-react.js";

import { notes } from "../../../../examples/notes/note-db.js";
import { EditForm, MainForm } from "./form.js";

const App = createComponent({
  state() {
    return {
      notes: notes.map(function addUniqueKey(noteText, index) {
        return {
          id: Date.now() + index,
          text: noteText,
        };
      }),
    };
  },

  addNote(text) {
    const newNote = { id: Date.now(), text: text };
    const newNotes = [newNote, ...this.state.notes];
    this.setState({ notes: newNotes });
  },
  editNote({ index, text }) {
    const newNotes = this.state.notes.map((note, currentIndex) => {
      if (currentIndex === index) {
        return { ...note, text: text };
      }
      return note;
    });

    this.setState({ notes: newNotes });
  },

  render() {
    const { notes } = this.state;

    return createElement("main", { class: "container" }, [
      createElement("h1", {}, ["Мои заметки"]),

      createElement(MainForm, {
        on: {
          add: this.addNote,
        },
      }),

      createElement("hr"),

      createElement(
        "section",
        { id: "note-list" },
        notes.map((note, index) =>
          createElement(EditForm, {
            key: note.id,
            note: {
              text: note.text,
              index: index,
            },
            on: {
              edit: this.editNote,
            },
          })
        )
      ),
    ]);
  },
});

function main() {
  const root = document.getElementById("root");

  if (root == null) {
    throw new Error("Cannot find root");
  }

  const { mount } = createApp(App);
  mount(root);
}

document.addEventListener("DOMContentLoaded", main);
