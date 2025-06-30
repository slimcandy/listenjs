import { createApp } from "./app";
import { createElement } from "./create-element";

const state = {
  state: 0,
  reducers: {
    add: (state, payload) => state + payload,
  },
  view: (state, emit) =>
    createElement(
      "button",
      {
        on: {
          click: () => emit("add", 1),
        },
      },
      [createElement("p", {}, [`You clicked ${state} times.`])]
    ),
};

function main() {
  const root = document.getElementById("root");

  if (root == null) {
    throw new Error("Cannot find root");
  }

  const { mount } = createApp(state);
  mount(root);
}

document.addEventListener("DOMContentLoaded", main);
