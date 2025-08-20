type ActionName = string;
type ActionPayload = string | number | object;
type ReducerWithInjectedState = (payload?: ActionPayload) => void;

type AfterCommandHandler = () => void;
type UnsubscribeFunction = () => void;

class Dispatcher {
  #actionSubscriptions: Map<string, ReducerWithInjectedState[]> = new Map();
  #afterHandlers: AfterCommandHandler[] = [];

  subscribe(
    actionName: ActionName,
    reducerWithInjectedState: ReducerWithInjectedState
  ): UnsubscribeFunction {
    if (!this.#actionSubscriptions.has(actionName)) {
      this.#actionSubscriptions.set(actionName, []);
    }

    const reducers = this.#actionSubscriptions.get(actionName);
    if (reducers?.includes(reducerWithInjectedState)) {
      return () => {};
    }
    reducers?.push(reducerWithInjectedState);

    return function unsubscribe() {
      if (reducers) {
        const index = reducers?.indexOf(reducerWithInjectedState);
        reducers?.splice(index, 1);
      }
    };
  }

  afterEveryCommand(afterHandler: AfterCommandHandler) {
    this.#afterHandlers.push(afterHandler);
    return () => {
      const index = this.#afterHandlers.indexOf(afterHandler);
      this.#afterHandlers.splice(index, 1);
    };
  }

  dispatch(actionName: ActionName, actionPayload?: ActionPayload) {
    if (this.#actionSubscriptions.has(actionName)) {
      this.#actionSubscriptions
        .get(actionName)
        ?.forEach((reducer) => reducer(actionPayload));
    } else {
      console.warn(`No handlers found for command: ${actionName}`);
    }

    this.#afterHandlers.forEach((afterHandler) => afterHandler());
  }
}

export {
  Dispatcher,
  type ActionName,
  type ActionPayload,
  type UnsubscribeFunction,
};
