import type { FiberInstance } from "./fiber";
import type { DomEventMap, DOMEventName, DOMEmitGenerator } from "./types";

type DOMEventWithContext = (event: Event) => void;
type DOMEventListener = Partial<Record<DOMEventName, DOMEventWithContext>>;

function attachEventListener(
  domEventName: DOMEventName,
  emitGenerator: DOMEmitGenerator,
  domElement: HTMLElement,
  parentFiberInstance: FiberInstance | null = null
) {
  function boundContextToDOMEvent(...args: [Event]) {
    if (parentFiberInstance) {
      emitGenerator.apply(parentFiberInstance, args);
    } else {
      emitGenerator(...args);
    }
  }

  domElement.addEventListener(domEventName, boundContextToDOMEvent);

  return boundContextToDOMEvent;
}

function attachEventListeners(
  domEventMap: DomEventMap = {},
  domElement: HTMLElement,
  parentFiberInstance: FiberInstance | null = null
): DOMEventListener {
  const attachedDOMEventListeners: DOMEventListener = {};

  Object.entries(domEventMap).forEach(([domEventName, emitGenerator]) => {
    const listener = attachEventListener(
      domEventName as DOMEventName,
      emitGenerator,
      domElement,
      parentFiberInstance
    );
    attachedDOMEventListeners[domEventName] = listener;
  });

  return attachedDOMEventListeners;
}

function removeEventListeners(
  attachedDOMEventListeners: DOMEventListener = {},
  domElement: HTMLElement
) {
  Object.entries(attachedDOMEventListeners).forEach(
    ([domEventName, domEventWithContext]) => {
      domElement.removeEventListener(domEventName, domEventWithContext);
    }
  );
}

export {
  attachEventListener,
  attachEventListeners,
  removeEventListeners,
  type DOMEventListener,
};
