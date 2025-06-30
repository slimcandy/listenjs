import {
  createApp,
  createElement,
} from "../../packages/runtime/dist/listenjs.js";

import { notes } from "../../../../examples/notes/note-db.js";

const appConfig = {
  state: notes,
  reducers: {
    add: (state, payload) => ({
      ...state,
      payload,
    }),
    edit: (state, payload) => {
      const nextNotes = [...state];
      nextNotes[payload.id] = [payload.message];

      return nextNotes;
    },
  },
  view: App,
};

function App(notes, emit) {
  return createElement("main", { className: "container" }, [
    createElement("h1", {}, ["Мои заметки"]),

    createElement("form", { action: "#", id: "form" }, [
      createElement("fieldset", { role: "group" }, [
        createElement("input", {
          autofocus: true,
          name: "note-input",
          id: "note-input",
          placeholder: "Введите текст...",
        }),
        createElement(
          "button",
          {
            type: "submit",
            id: "note-submit",
            disabled: true,
          },
          ["Сохранить"]
        ),
      ]),
    ]),

    createElement("hr"),

    createElement(
      "div",
      { id: "note-list" },
      notes.map((note, index) =>
        createElement("div", {}, [
          createElement("details", { name: "note" }, [
            createElement("summary", {}, [note.slice(0, 70) + "…"]),

            createElement("form", { action: "#" }, [
              createElement("fieldset", { role: "group" }, [
                createElement("input", {
                  name: `note-input__${index}`,
                  placeholder: "Введите текст...",
                  value: note,
                }),
                createElement(
                  "button",
                  {
                    type: "submit",
                    className: "secondary",
                  },
                  ["Изменить"]
                ),
              ]),
            ]),
          ]),

          createElement("hr"),
        ])
      )
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
