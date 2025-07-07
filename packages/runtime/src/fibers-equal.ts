import { DOMType, Fiber } from "./types";

function areFibersEqual(fiberA: Fiber, fiberB: Fiber) {
  if (
    fiberA.type === fiberB.type &&
    fiberA.type === DOMType.ELEMENT &&
    fiberB.type === DOMType.ELEMENT
  ) {
    const { tag: tagA } = fiberA;
    const { tag: tagB } = fiberB;

    return tagA === tagB;
  }

  return false;
}

export { areFibersEqual };
