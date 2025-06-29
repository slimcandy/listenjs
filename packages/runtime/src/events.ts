function attachEventListener(
  eventType: string,
  handler: EventListener,
  domElement: HTMLElement
) {
  domElement.addEventListener(eventType, handler);

  return handler;
}

function attachEventListeners(
  listeners: Record<string, EventListener> = {},
  domElement: HTMLElement
) {
  const attachedListeners: Record<string, EventListener> = {};

  Object.entries(listeners).forEach(([eventType, handler]) => {
    const listener = attachEventListener(eventType, handler, domElement);
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
