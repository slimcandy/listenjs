import { createElement } from "./create-element";
import { mountHostComponent } from "./mount-host-component";

const vdom = createElement("section", {}, [
  createElement("h1", {}, ["My blog"]),
  createElement("p", {}, ["Welcome to my blog"]),
]);

function main() {
  mountHostComponent(vdom, document.getElementById("root"));
}

document.addEventListener("DOMContentLoaded", main);
