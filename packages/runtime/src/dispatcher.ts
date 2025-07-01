type VoidFunction = (payload?: object) => void;

class Dispatcher {
  #subs: Map<string, VoidFunction[]> = new Map();
  #afterHandlers: VoidFunction[] = [];

  subscribe(commandName: string, handler: VoidFunction) {
    if (!this.#subs.has(commandName)) {
      this.#subs.set(commandName, []);
    }

    const handlers = this.#subs.get(commandName);
    if (handlers?.includes(handler)) {
      return () => {};
    }
    handlers?.push(handler);

    return () => {
      if (handlers) {
        const index = handlers?.indexOf(handler);
        handlers?.splice(index, 1);
      }
    };
  }

  afterEveryCommand(handler: VoidFunction) {
    this.#afterHandlers.push(handler);
    return () => {
      const index = this.#afterHandlers.indexOf(handler);
      this.#afterHandlers.splice(index, 1);
    };
  }

  dispatch(commandName: string, payload: object) {
    if (this.#subs.has(commandName)) {
      this.#subs.get(commandName)?.forEach((handler) => handler(payload));
    } else {
      console.warn(`No handlers found for command: ${commandName}`);
    }

    this.#afterHandlers.forEach((handler) => handler());
  }
}

export { Dispatcher };
