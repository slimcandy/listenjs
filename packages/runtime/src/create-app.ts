import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";

import type { ActionName, ActionPayload} from "./dispatcher";
import type { VNode } from "./types";

type State = Record<string, string | number | object>;
type View = (state: State, emit: Emit) => VNode;

type Reducer = (state: State, actionPayload?: ActionPayload) => State;
type Reducers = Record<ActionName, Reducer>;

type Emit = (actionName: ActionName, actionPayload?: ActionPayload) => void;

function createApp({
  state,
  view,
  reducers = {},
}: {
  state: State;
  view: View;
  reducers: Reducers;
}) {
  let parentElement: HTMLElement | null = null;
  let vDOMRootNode: VNode | null = null;

  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  function emit(actionName: ActionName, actionPayload?: ActionPayload) {
    dispatcher.dispatch(actionName, actionPayload);
  }

  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subs = dispatcher.subscribe(
      actionName,
      function reducerWithInjectedState(actionPayload) {
        state = reducer(state, actionPayload);
      }
    );
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
        mountDOM(vDOMRootNode, parentElement);
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

export { createApp, type Emit };
