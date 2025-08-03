import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { mountHostComponent } from "./mount-host-component";
import { patchDOM } from "./patch-dom";
import { VNode } from "./types";

function createApp({ state, view, reducers = {} }) {
  let parentElement: HTMLElement | null = null;
  let vDOMRootNode: VNode | null = null;

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
    const nextVDOMRootNode = view(state, emit);

    if (vDOMRootNode && parentElement) {
      vDOMRootNode = patchDOM(vDOMRootNode, nextVDOMRootNode, parentElement);
    }
  }

  return {
    mount(_parentElement: HTMLElement | null) {
      parentElement = _parentElement;
      vDOMRootNode = view(state, emit);

      if (vDOMRootNode && parentElement) {
        mountHostComponent(vDOMRootNode, parentElement);
      }
    },
    unmount() {
      if (vDOMRootNode) {
        destroyDOM(vDOMRootNode);
      }
      vDOMRootNode = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },
  };
}

export { createApp };
