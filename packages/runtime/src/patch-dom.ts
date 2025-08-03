import { destroyDOM } from "./destroy-dom";
import { attachEventListener } from "./events";
import { areVNodesEqual } from "./vnode-equal";
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
  VDOMType,
  ElementVNode,
  Props,
  TextVNode,
  VNode,
} from "./types";
import { arraysDiff, arraysDiffSequence } from "./utils/arrays";
import { objectsDiff } from "./utils/object-diff";
import { isNotBlankOrEmptyString } from "./utils/strings";

function patchDOM(
  oldVNode: VNode,
  newVNode: VNode,
  parentDOMNode: HTMLElement
) {
  if (!areVNodesEqual(oldVNode, newVNode)) {
    const positionIndex = oldVNode.domElement
      ? findIndexInParent(parentDOMNode, oldVNode.domElement)
      : undefined;

    destroyDOM(oldVNode);
    mountHostComponent(newVNode, parentDOMNode, positionIndex);

    return newVNode;
  }

  newVNode.domElement = oldVNode.domElement;

  switch (newVNode.type) {
    case VDOMType.TEXT: {
      if (oldVNode.type === VDOMType.TEXT) {
        patchText(oldVNode, newVNode);
      }

      return newVNode;
    }

    case VDOMType.ELEMENT: {
      if (oldVNode.type === VDOMType.ELEMENT) {
        patchElement(oldVNode, newVNode);
      }
      break;
    }
  }

  patchChildren(oldVNode, newVNode);

  return newVNode;
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

function patchText(oldVNode: TextVNode, newVNode: TextVNode) {
  if (!oldVNode.domElement) {
    throw new Error(`Cannot find DOM Element for old vNode: ${oldVNode}`);
  }

  const domElement: Text = oldVNode.domElement;
  const { value: oldText } = oldVNode;
  const { value: newText } = newVNode;

  if (oldText !== newText) {
    domElement.nodeValue = newText;
  }
}

function patchElement(oldVNode: ElementVNode, newVNode: ElementVNode) {
  if (!oldVNode.domElement) {
    throw new Error(`Cannot find DOM Element for old vNode: ${oldVNode}`);
  }

  const domElement: HTMLElement = oldVNode.domElement;
  const {
    class: oldClass,
    style: oldStyle,
    on: oldOnEvents,
    ...oldRestAttributes
  } = oldVNode.props;
  const {
    class: newClass,
    style: newStyle,
    on: newOnEvents,
    ...newRestAttributes
  } = newVNode.props;
  const { listeners: oldListeners } = oldVNode;

  patchAttributes(domElement, oldRestAttributes, newRestAttributes);
  patchClasses(domElement, oldClass, newClass);
  patchStyles(domElement, oldStyle, newStyle);
  newVNode.listeners = patchEvents(
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
    oldListeners: ElementVNode["listeners"] = {},
    oldOnEvents: Props["on"] = {},
    newOnEvents: Props["on"] = {}
  ) {
    const { added, removed, updated } = objectsDiff(oldOnEvents, newOnEvents);

    for (const eventType of removed.concat(updated)) {
      domElement.removeEventListener(eventType, oldListeners[eventType]);
    }

    const addedListeners: ElementVNode["listeners"] = {};

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

function patchChildren(oldVNode: VNode, newVNode: VNode) {
  if (!oldVNode.domElement) {
    throw new Error(`Cannot find DOM Element for old vNode: ${oldVNode}`);
  }

  const oldChildren = extractChildren(oldVNode);
  const newChildren = extractChildren(newVNode);
  const parentDomElement = oldVNode.domElement;

  const diffSequence = arraysDiffSequence<VNode>(
    oldChildren,
    newChildren,
    areVNodesEqual
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
                `Cannot find DOM Element for old vNode: ${oldVNode}`
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
