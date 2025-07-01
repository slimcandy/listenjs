import { notes } from "../../../../examples/notes/note-db.js";

/**
 * Constants
 */
/** @type {HTMLInputElement} */
const noteInput = document.getElementById("note-input");

/** @type {HTMLButtonElement} */
const submitButton = document.getElementById("note-submit");

/** @type {HTMLDivElement} */
const noteList = document.getElementById("note-list");

/**
 * Events
 */
noteInput.addEventListener("input", function toggleSubmitButtonAbility() {
  submitButton.disabled = noteInput.value.length < 3;
});

/**
 * Render
 */
function getNote(index = 0, text = "", shortText = "") {
  /** @type {DocumentFragment} */
  const templateClone = document
    .getElementsByTagName("template")[0]
    .content.cloneNode(true);

  const summary = templateClone.querySelector("summary");
  const form = templateClone.querySelector("form");
  const input = templateClone.querySelector("input");

  summary.textContent = shortText;
  input.value = text;

  form.addEventListener("submit", function submitForm(event) {
    event.preventDefault();

    const nextNote = getNote(
      index,
      input.value,
      input.value.slice(0, 70) + "…"
    );
    noteList.replaceChild(nextNote, noteList.children[index]);
  });

  return templateClone;
}
notes.forEach(function renderNoteForm(note, index) {
  const nextNote = getNote(index, note, note.slice(0, 70) + "…");

  noteList.appendChild(nextNote);
});
