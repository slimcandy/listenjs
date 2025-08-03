import { VDOMType, VNode } from "./types";

function areVNodesEqual(vNodeA: VNode, vNodeB: VNode) {
  if (
    vNodeA.type === vNodeB.type &&
    vNodeA.type === VDOMType.ELEMENT &&
    vNodeB.type === VDOMType.ELEMENT
  ) {
    const { tag: tagA } = vNodeA;
    const { tag: tagB } = vNodeB;

    return tagA === tagB;
  }

  return false;
}

export { areVNodesEqual };
