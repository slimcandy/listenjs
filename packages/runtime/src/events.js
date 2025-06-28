function attachEventListener(eventType, handler, domElement) {
  domElement.addEventListener(eventType, handler);

  return handler;
}

function attachEventListeners(listeners = {}, domElement) {
  const attachedListeners = {};

  Object.entries(listeners).forEach(([eventType, handler]) => {
    const listener = addEventListener(eventType, handler, domElement);
    attachedListeners[eventType] = listener;
  });

  return attachedListeners;
}

export { attachEventListener, attachEventListeners };
