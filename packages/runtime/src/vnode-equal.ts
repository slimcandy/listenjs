import { VDOMType } from "./types";

import type { VNode } from "./types";

function areVNodesEqual(vNodeA: VNode, vNodeB: VNode) {
  if (
    vNodeA.type === vNodeB.type &&
    vNodeA.type === VDOMType.ELEMENT &&
    vNodeB.type === VDOMType.ELEMENT
  ) {
    const {
      tag: tagA,
      props: { key: keyA },
    } = vNodeA;
    const {
      tag: tagB,
      props: { key: keyB },
    } = vNodeB;

    return tagA === tagB && keyA === keyB;
  }

  if (
    vNodeA.type === vNodeB.type &&
    vNodeA.type === VDOMType.FIBER &&
    vNodeB.type === VDOMType.FIBER
  ) {
    const {
      tag: tagA,
      props: { key: keyA },
    } = vNodeA;
    const {
      tag: tagB,
      props: { key: keyB },
    } = vNodeB;

    return tagA === tagB && keyA === keyB;
  }

  return false;
}

export { areVNodesEqual };
