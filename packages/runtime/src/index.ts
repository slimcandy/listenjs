import { createElement } from "./create-element";
import { mountHostComponent } from "./mount-host-component";
import { destroyDOM } from "./destroy-dom";

const fiber = createElement("section", {}, [
  createElement("h1", {}, ["My blog"]),
  createElement("p", {}, ["Welcome to my blog"]),
]);

function main() {
  const root = document.getElementById("root");
  const removeButton = document.getElementById("remove");

  if (root == null) {
    throw new Error("Cannot find root");
  }
  if (removeButton == null) {
    throw new Error("Cannot find button to destroy DOM");
  }

  mountHostComponent(fiber, root);

  removeButton.addEventListener("click", function removeListenJS() {
    destroyDOM(fiber);
  });
}

document.addEventListener("DOMContentLoaded", main);
