import { destroyDOM } from "./destroy-dom";
import { attachEventListener } from "./events";
import { areFibersEqual } from "./fibers-equal";
import { extractChildren, mountHostComponent } from "./mount-host-component";
import {
  removeStyle,
  removeValueForAttribute,
  setStyle,
  setValueForAttribute,
} from "./set-prop";
import {
  ARRAY_DIFF_OP,
  Attributes,
  DomElement,
  DOMType,
  ElementFiber,
  Fiber,
  Props,
  TextFiber,
} from "./types";
import { arraysDiff, arraysDiffSequence } from "./utils/arrays";
import { objectsDiff } from "./utils/object-diff";
import { isNotBlankOrEmptyString } from "./utils/strings";

function patchDOM(
  oldFiber: Fiber,
  newFiber: Fiber,
  parentDOMNode: HTMLElement
) {
  if (!areFibersEqual(oldFiber, newFiber)) {
    const positionIndex = oldFiber.domElement
      ? findIndexInParent(parentDOMNode, oldFiber.domElement)
      : undefined;

    destroyDOM(oldFiber);
    mountHostComponent(newFiber, parentDOMNode, positionIndex);

    return newFiber;
  }

  newFiber.domElement = oldFiber.domElement;

  switch (newFiber.type) {
    case DOMType.TEXT: {
      if (oldFiber.type === DOMType.TEXT) {
        patchText(oldFiber, newFiber);
      }

      return newFiber;
    }

    case DOMType.ELEMENT: {
      if (oldFiber.type === DOMType.ELEMENT) {
        patchElement(oldFiber, newFiber);
      }
      break;
    }
  }

  patchChildren(oldFiber, newFiber);

  return newFiber;
}

function findIndexInParent(
  parentDOMNode: Node,
  domElement: DomElement
): number | null {
  const positionIndex = Array.from(parentDOMNode.childNodes).indexOf(
    domElement
  );

  if (positionIndex < 0) {
    return null;
  }

  return positionIndex;
}

function patchText(oldFiber: TextFiber, newFiber: TextFiber) {
  if (!oldFiber.domElement) {
    throw new Error(`Cannot find DOM Element for old fiber: ${oldFiber}`);
  }

  const domElement: Text = oldFiber.domElement;
  const { value: oldText } = oldFiber;
  const { value: newText } = newFiber;

  if (oldText !== newText) {
    domElement.nodeValue = newText;
  }
}

function patchElement(oldFiber: ElementFiber, newFiber: ElementFiber) {
  if (!oldFiber.domElement) {
    throw new Error(`Cannot find DOM Element for old fiber: ${oldFiber}`);
  }

  const domElement: HTMLElement = oldFiber.domElement;
  const {
    class: oldClass,
    style: oldStyle,
    on: oldOnEvents,
    ...oldRestAttributes
  } = oldFiber.props;
  const {
    class: newClass,
    style: newStyle,
    on: newOnEvents,
    ...newRestAttributes
  } = newFiber.props;
  const { listeners: oldListeners } = oldFiber;

  patchAttributes(domElement, oldRestAttributes, newRestAttributes);
  patchClasses(domElement, oldClass, newClass);
  patchStyles(domElement, oldStyle, newStyle);
  newFiber.listeners = patchEvents(
    domElement,
    oldListeners,
    oldOnEvents,
    newOnEvents
  );

  function patchAttributes(
    domElement: HTMLElement,
    oldRestAttributes: Attributes,
    newRestAttributes: Attributes
  ) {
    const { added, removed, updated } = objectsDiff(
      oldRestAttributes,
      newRestAttributes
    );

    for (const key of removed) {
      removeValueForAttribute(domElement, key);
    }

    for (const key of added.concat(updated)) {
      setValueForAttribute(domElement, key, newRestAttributes[key]);
    }
  }

  function patchClasses(
    domElement: HTMLElement,
    oldClass: Props["class"],
    newClass: Props["class"]
  ) {
    const oldClasses = toClassList(oldClass);
    const newClasses = toClassList(newClass);

    const { added, removed } = arraysDiff(oldClasses, newClasses);

    if (removed.length > 0) {
      domElement.classList.remove(...removed);
    }
    if (added.length > 0) {
      domElement.classList.add(...added);
    }

    function toClassList(classes: Props["class"] = "") {
      return Array.isArray(classes)
        ? classes.filter(isNotBlankOrEmptyString)
        : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
    }
  }

  function patchStyles(
    domElement: HTMLElement,
    oldStyle: Props["style"] = {},
    newStyle: Props["style"] = {}
  ) {
    const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

    for (const key of removed) {
      removeStyle(domElement, key);
    }

    for (const key of added.concat(updated)) {
      setStyle(domElement, key, newStyle[key]);
    }
  }

  function patchEvents(
    domElement: HTMLElement,
    oldListeners: ElementFiber["listeners"] = {},
    oldOnEvents: Props["on"] = {},
    newOnEvents: Props["on"] = {}
  ) {
    const { added, removed, updated } = objectsDiff(oldOnEvents, newOnEvents);

    for (const eventType of removed.concat(updated)) {
      domElement.removeEventListener(eventType, oldListeners[eventType]);
    }

    const addedListeners: ElementFiber["listeners"] = {};

    for (const eventType of added.concat(updated)) {
      addedListeners[eventType] = attachEventListener(
        eventType,
        newOnEvents[eventType],
        domElement
      );
    }

    return addedListeners;
  }
}

function patchChildren(oldFiber: Fiber, newFiber: Fiber) {
  if (!oldFiber.domElement) {
    throw new Error(`Cannot find DOM Element for old fiber: ${oldFiber}`);
  }

  console.log("Patching children...");

  const oldChildren = extractChildren(oldFiber);
  const newChildren = extractChildren(newFiber);
  const parentDomElement = oldFiber.domElement;

  const diffSequence = arraysDiffSequence<Fiber>(
    oldChildren,
    newChildren,
    areFibersEqual
  );

  for (const operation of diffSequence) {
    const { index, item, op } = operation;

    switch (op) {
      case ARRAY_DIFF_OP.ADD: {
        if (parentDomElement instanceof HTMLElement) {
          mountHostComponent(item, parentDomElement, index);
        }
        break;
      }
      case ARRAY_DIFF_OP.REMOVE: {
        destroyDOM(item);
        break;
      }
      case ARRAY_DIFF_OP.MOVE: {
        if (parentDomElement instanceof HTMLElement) {
          if ("originalIndex" in operation) {
            const oldChild = oldChildren[operation.originalIndex];
            const newChild = newChildren[index];

            if (!oldChild.domElement) {
              throw new Error(
                `Cannot find DOM Element for old fiber: ${oldFiber}`
              );
            }

            const domElement = oldChild.domElement;
            const domElementAtTargetPosition =
              parentDomElement.childNodes[index];

            parentDomElement.insertBefore(
              domElement,
              domElementAtTargetPosition
            );
            patchDOM(oldChild, newChild, parentDomElement);
          }
        }
        break;
      }
      case ARRAY_DIFF_OP.NOOP: {
        if (parentDomElement instanceof HTMLElement) {
          if ("originalIndex" in operation) {
            patchDOM(
              oldChildren[operation.originalIndex],
              newChildren[index],
              parentDomElement
            );
          }
        }
        break;
      }
    }
  }
}

export { patchDOM };
