import {
  createApp,
  createFiber,
} from "../../packages/runtime/dist/listenjs.js";

import { notes } from "../../../../examples/notes/note-db.js";
import { EditForm, MainForm } from "./form.js";

const appConfig = {
  state: notes,
  reducers: {
    add: (state, payload) => [payload, ...state],
    edit: (state, payload) => {
      const { index, message } = payload;

      const nextNotes = [...state];
      nextNotes[index] = message;

      return nextNotes;
    },
  },
  view: App,
};

function App(notes, emit) {
  return createFiber("main", { className: "container" }, [
    createFiber("h1", {}, ["Мои заметки"]),

    MainForm({ emit }),

    createFiber("hr"),

    createFiber(
      "div",
      { id: "note-list" },
      notes.map((note, index) => EditForm({ inputValue: note, index, emit }))
    ),
  ]);
}

function main() {
  const root = document.getElementById("root");

  if (root == null) {
    throw new Error("Cannot find root");
  }

  const { mount } = createApp(appConfig);
  mount(root);
}

document.addEventListener("DOMContentLoaded", main);
