import type { DomEventMap, DOMEventName } from "../types";

function objectsDiff(
  oldObject: DomEventMap,
  newObject: DomEventMap
): {
  added: DOMEventName[];
  removed: DOMEventName[];
  updated: DOMEventName[];
} {
  const oldKeys = Object.keys(oldObject) as DOMEventName[];
  const newKeys = Object.keys(newObject) as DOMEventName[];

  return {
    added: newKeys.filter((newKey) => !(newKey in oldObject)),
    removed: oldKeys.filter((oldKey) => !(oldKey in newObject)),
    updated: newKeys.filter(
      (newKey) => newKey in oldObject && oldObject[newKey] !== newObject[newKey]
    ),
  };
}

function hasOwnProperty(obj: object, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export { objectsDiff, hasOwnProperty };
