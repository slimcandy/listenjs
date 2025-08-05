import { Fiber } from "./fiber";

function attachEventListener(
  eventType: string,
  handler: EventListener,
  domElement: HTMLElement,
  parentFiber: Fiber | null = null
) {
  function boundHandler(event: Event) {
    if (parentFiber) {
      handler.apply(parentFiber);
    } else {
      handler(event);
    }
  }

  domElement.addEventListener(eventType, boundHandler);

  return boundHandler;
}

function attachEventListeners(
  listeners: Record<string, EventListener> = {},
  domElement: HTMLElement,
  parentFiber: Fiber | null = null
) {
  const attachedListeners: Record<string, EventListener> = {};

  Object.entries(listeners).forEach(([eventType, handler]) => {
    const listener = attachEventListener(
      eventType,
      handler,
      domElement,
      parentFiber
    );
    attachedListeners[eventType] = listener;
  });

  return attachedListeners;
}

function removeEventListeners(
  listeners: Record<string, EventListener> = {},
  domElement: HTMLElement
) {
  Object.entries(listeners).forEach(([eventType, handler]) => {
    domElement.removeEventListener(eventType, handler);
  });
}

export { attachEventListener, attachEventListeners, removeEventListeners };
