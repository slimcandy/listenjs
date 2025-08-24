# My Educational Frontend Framework (fe-fwk-ts-react)

This repository contains my implementation of a frontend JavaScript framework, built as an educational exercise. The project is based on the book ["Build a web frontend framework (from scratch)"](https://www.manning.com/books/build-a-frontend-web-framework-from-scratch) by Ángel Sola Orbaiceta and closely follows the concepts and code from his [companion GitHub repository](https://github.com/angelsolaorbaiceta/fe-fwk-book).

The primary goal of this project was to gain a deeper understanding of the inner workings of modern frontend frameworks like React, Vue, and Angular by building one from the ground up.

## About The Project

This framework, named `fe-fwk-ts-react`, is a lightweight, component-based library for building user interfaces. It includes many of the core features you would expect from a modern framework, all built from scratch in vanilla JavaScript (and TypeScript).

The repository includes the complete source code for the framework itself, as well as a sample "Notes" application that demonstrates its usage.

### Core Features Implemented

- **Virtual DOM:** A programming concept where a virtual representation of a UI is kept in memory and synced with the "real" DOM. This allows for efficient updates and rendering.
- **Reconciliation Algorithm:** The logic that compares the old virtual DOM tree with the new one to determine the most efficient way to update the actual DOM.
- **Component-Based Architecture:** The ability to build encapsulated and reusable UI components with their own state and lifecycle.
- **State Management:** A system for managing the state of components and re-rendering them when the state changes.
- **JSX-like `createElement` function:** A function for creating virtual DOM nodes, similar to what JSX compiles down to in React.
- **Event Handling:** A mechanism for handling DOM events and dispatching them to the appropriate components.
- **Lifecycle Methods:** Components can define methods like `componentDidMount` and `componentWillUnmount` that are called at specific points in their lifecycle.

## The Sample Application: Notes

Included in this repository is a simple note-taking application that demonstrates how to use the `fe-fwk-ts-react` framework. The application allows you to:

- View a list of predefined notes.
- Add new notes to the list.
- Edit existing notes.

This application showcases how to create components, manage state, and handle user input within the framework.

## Getting Started

To run the sample application locally:

1.  Clone this repository:
    ```sh
    git clone https://github.com/slimcandy/fe-fwk-ts-react
    ```
2.  Navigate to the project directory:
    ```sh
    cd fe-fwk-ts-react/packages/runtime
    ```
3.  Install the dependencies (you will need Node.js and npm installed):
    ```sh
    npm install
    ```
4.  Build the framework and the application:
    ```sh
    npm run build
    ```
5.  Open the `index.html` file in your web browser to see the application in action.

## Acknowledgements

This project would not have been possible without the excellent guidance and clear explanations provided in the book "Build a web frontend framework (from scratch)" by Ángel Sola Orbaiceta. I highly recommend it to anyone interested in learning more about how frontend frameworks work under the hood.
