import {
  createElement,
  createComponent,
} from "../../packages/runtime/dist/listenjs.js";

const Form = createComponent({
  render() {
    const { input, submit, formProps } = this.props;
    const {
      value: inputValue,
      props: { on: events, ...restProps },
    } = input;
    const {
      text: submitText = "Сохранить",
      className: submitClassName,
      isDisabled = false,
    } = submit;

    console.log("input restProps", restProps);

    return createElement(
      "form",
      {
        action: "#",
        id: "form",
        ...formProps,
      },
      [
        createElement("fieldset", { role: "group" }, [
          createElement(
            "textarea",
            {
              placeholder: "Введите текст...",
              on: {
                ...events,
              },
              autocomplete: false,
              minLength: 3,
              required: true,
              ...restProps,
            },
            [inputValue]
          ),
          createElement(
            "button",
            {
              type: "submit",
              id: "note-submit",
              disabled: isDisabled,
              className: submitClassName,
            },
            [submitText]
          ),
        ]),
      ]
    );
  },
});

const MainForm = createComponent({
  state() {
    return { text: "", isInputValid: false };
  },

  changeText(event) {
    const { target } = event;

    let isInputValid = false;
    const nextText = target.value;

    if (nextText.length > 3) {
      isInputValid = true;
    }

    this.setState({ text: nextText, isInputValid });
  },

  saveText(event) {
    event.preventDefault();
    if (this.state.isInputValid) {
      this.emit("add", this.state.text);
      this.setState({ text: "", isInputValid: false });
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
        isDisabled: !this.state.isInputValid,
      },
    });
  },
});

const EditForm = createComponent({
  state(props) {
    return { text: props.note.text, isInputValid: props.note.text.length > 3 };
  },

  changeText(event) {
    const { target } = event;
    const nextText = target.value;

    this.setState({
      text: nextText,
      isInputValid: nextText.length > 3,
    });
  },

  saveText(event) {
    event.preventDefault();
    if (this.state.isInputValid) {
      this.emit("edit", {
        text: this.state.text,
        index: this.props.note.index,
      });
    }
  },

  render() {
    return createElement("article", {}, [
      createElement("details", { name: "note" }, [
        createElement("summary", {}, [
          createElement("blockquote", {}, [this.state.text]),
        ]),
        createElement(Form, {
          ...this.props,
          input: {
            value: this.state.text,
            props: {
              on: {
                input: (event) => this.changeText(event),
              },
              ariaInvalid: !this.state.isInputValid,
            },
          },
          submit: {
            text: "Изменить",
            className: "secondary",
            isDisabled: !this.state.isInputValid,
          },
          formProps: {
            on: {
              submit: (event) => this.saveText(event),
            },
          },
        }),
      ]),
    ]);
  },
});

export { MainForm, EditForm };
