import { createElement } from "../../packages/runtime/dist/listenjs.js";

function Form({ input = {}, submit = {}, emit = () => {} } = {}) {
  const { value: inputValue, props: inputProps } = input;
  const { text: submitText = "Сохранить", className: submitClassName } = submit;

  return createElement(
    "form",
    {
      action: "#",
      id: "form",
      on: {
        submit: (event) => {
          event.preventDefault();
        },
      },
    },
    [
      createElement("fieldset", { role: "group" }, [
        createElement("input", {
          name: "note-input",
          value: inputValue,
          id: "note-input",
          placeholder: "Введите текст...",
          ...inputProps,
        }),
        createElement(
          "button",
          {
            type: "submit",
            id: "note-submit",
            disabled: true,
            className: submitClassName,
          },
          [submitText]
        ),
      ]),
    ]
  );
}

function MainForm({ emit }) {
  return Form({
    input: {
      props: {
        autofocus: true,
      },
    },
    emit,
  });
}

function EditForm({ inputValue }) {
  return createElement("div", {}, [
    createElement("details", { name: "note" }, [
      createElement("summary", {}, [inputValue.slice(0, 70) + "…"]),
      Form({
        inputValue,
        submit: {
          text: "Изменить",
          className: "secondary",
        },
      }),
    ]),

    createElement("hr"),
  ]);
}

export { MainForm, EditForm };
