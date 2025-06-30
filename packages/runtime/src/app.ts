import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { mountHostComponent } from "./mount-host-component";
import { Fiber } from "./types";

function createApp({ state, view }) {
  let parentInstance: Node | null = null;
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
    if (fiber) {
      destroyDOM(fiber);
    }

    fiber = view(state);
    if (fiber && parentInstance) {
      mountHostComponent(fiber, parentInstance);
    }
  }

  return {
    mount(_parentInstance) {
      parentInstance = _parentInstance;
      renderApp();
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
