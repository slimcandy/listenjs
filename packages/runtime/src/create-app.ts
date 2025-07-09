import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";
import { Fiber } from "./types";

function createApp({ state, view, reducers = {} }) {
  let parentInstance: HTMLElement | null = null;
  let fiber: Fiber | null = null;

  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  function emit(eventType: string, payload: object = {}) {
    dispatcher.dispatch(eventType, payload);
  }

  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  function renderApp() {
    const newFiber = view(state, emit);

    if (fiber && parentInstance) {
      fiber = patchDOM(fiber, newFiber, parentInstance);
    }
  }

  return {
    mount(_parentInstance) {
      parentInstance = _parentInstance;
      fiber = view(state, emit);

      if (fiber && parentInstance) {
        mountDOM(fiber, parentInstance);
      }
    },
    unmount() {
      if (fiber) {
        destroyDOM(fiber);
      }
      fiber = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },
  };
}

export { createApp };
