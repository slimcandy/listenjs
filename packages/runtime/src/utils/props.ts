import type { ElementVNode, FiberVNode } from "../types";

function extractPropsAndEvents<T extends FiberVNode | ElementVNode>(vNode: T) {
  const { on: eventMap, ...props } = vNode.props;
  delete props.key;

  return { props, eventMap };
}

export { extractPropsAndEvents };
