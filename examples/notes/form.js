import { createElement } from "../../packages/runtime/dist/listenjs.js";

function Form({ input = {}, submit = {}, formProps = {} } = {}) {
  const { value: inputValue, props: inputProps } = input;
  const { text: submitText = "Сохранить", className: submitClassName } = submit;

  return createElement(
    "form",
    {
      action: "#",
      id: "form",
      ...formProps,
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
  var currentText = "";

  return Form({
    input: {
      props: {
        autofocus: true,
        on: {
          change: (event) => {
            const { target } = event;
            currentText = target.value;
          },
        },
      },
    },
    formProps: {
      on: {
        submit: (event) => {
          event.preventDefault();
          if (currentText.length > 3) {
            emit("add", currentText);
          }
        },
      },
    },
  });
}

function EditForm({ inputValue, emit, index }) {
  var currentText = inputValue;

  return createElement("div", {}, [
    createElement("details", { name: "note" }, [
      createElement("summary", {}, [inputValue.slice(0, 70) + "…"]),
      Form({
        input: {
          value: inputValue,
          props: {
            on: {
              change: (event) => {
                const { target } = event;
                currentText = target.value;
              },
            },
          },
        },
        submit: {
          text: "Изменить",
          className: "secondary",
        },
        formProps: {
          on: {
            submit: (event) => {
              event.preventDefault();
              if (currentText.length > 3) {
                emit("edit", { index, message: currentText });
              }
            },
          },
        },
      }),
    ]),

    createElement("hr"),
  ]);
}

export { MainForm, EditForm };
