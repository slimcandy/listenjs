import {
  createElement,
  createFiber,
} from "../../packages/runtime/dist/listenjs.js";

const Form = createFiber({
  preventSend(event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  },

  render() {
    const { input, submit, formProps } = this.props;
    const {
      value: inputValue,
      props: { on: events, ...restProps },
    } = input;
    const { text: submitText = "Сохранить", className: submitClassName } =
      submit;

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
            on: {
              keydown: (event) => this.preventSend(event),
              ...events,
            },
            ...restProps,
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
  },
});

const MainForm = createFiber({
  state() {
    return { text: "" };
  },

  changeText(event) {
    const { key, target } = event;
    this.updateState({ text: target.value });

    if (key === "Enter") {
      event.preventDefault();
    }
  },

  saveText(event) {
    event.preventDefault();
    if (this.state.text.length > 3) {
      this.emit("add", this.state.text);
    }
  },

  render() {
    return createElement(Form, {
      input: {
        props: {
          autofocus: true,
          value: this.state.text,
          on: {
            input: (event) => this.changeText(event),
          },
        },
      },
      formProps: {
        on: {
          submit: (event) => this.saveText(event),
        },
      },
      submit: {
        text: "Сохранить",
      },
    });
  },
});

const EditForm = createFiber({
  state(props) {
    return { text: props.note.text };
  },

  changeText(event) {
    const { target } = event;
    this.updateState({ text: target.value });
  },

  saveText(event) {
    event.preventDefault();
    if (this.state.text.length > 3) {
      this.emit("edit", {
        text: this.state.text,
        index: this.props.note.index,
      });
    }
  },

  render() {
    return createElement("div", {}, [
      createElement("details", { name: "note" }, [
        createElement("summary", {}, [this.state.text.slice(0, 70) + "…"]),
        createElement(Form, {
          ...this.props,
          input: {
            value: this.state.text,
            props: {
              on: {
                change: (event) => this.changeText(event),
              },
            },
          },
          submit: {
            text: "Изменить",
            className: "secondary",
          },
          formProps: {
            on: {
              submit: (event) => this.saveText(event),
            },
          },
        }),
      ]),

      createElement("hr"),
    ]);
  },
});

export { MainForm, EditForm };
