import { FiberInstance } from "./fiber";

function attachEventListener(
  eventType: string,
  handler: EventListener,
  domElement: HTMLElement,
  parentFiberInstance: FiberInstance | null = null
) {
  function boundHandler(event: Event) {
    if (parentFiberInstance) {
      handler.apply(parentFiberInstance);
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
  parentFiberInstance: FiberInstance | null = null
) {
  const attachedListeners: Record<string, EventListener> = {};

  Object.entries(listeners).forEach(([eventType, handler]) => {
    const listener = attachEventListener(
      eventType,
      handler,
      domElement,
      parentFiberInstance
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
