import { createElement } from "./create-element";
import { mountHostComponent } from "./mount-host-component";
import { destroyDOM } from "./destroy-dom";

const fiber = createElement("section", {}, [
  createElement("h1", {}, ["My blog"]),
  createElement("p", {}, ["Welcome to my blog"]),
]);

function main() {
  mountHostComponent(fiber, document.getElementById("root"));

  document
    .getElementById("remove")
    .addEventListener("click", function removeListenJS() {
      destroyDOM(fiber);
    });
}

document.addEventListener("DOMContentLoaded", main);
