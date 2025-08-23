import {
  createApp,
  createElement,
  createFiber,
} from "../../packages/runtime/dist/listenjs.js";

import { notes } from "../../../../examples/notes/note-db.js";
import { EditForm, MainForm } from "./form.js";

const App = createFiber({
  state() {
    return {
      notes: notes,
    };
  },

  addNote(text) {
    const newNotes = [text, ...this.state.notes];
    this.updateState({ notes: newNotes });
  },
  editNote({ index, text }) {
    const notes = [...this.state.notes];
    notes[index] = text;

    this.updateState({ notes: notes });
  },

  render() {
    const { notes } = this.state;

    return createElement("main", { className: "container" }, [
      createElement("h1", {}, ["Мои заметки"]),

      createElement(MainForm, {
        on: {
          add: this.addNote,
        },
      }),

      createElement("hr"),

      createElement(
        "div",
        { id: "note-list" },
        notes.map((note, index) =>
          createElement(EditForm, {
            key: note,
            note: {
              text: note,
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
