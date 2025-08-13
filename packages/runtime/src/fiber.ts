import { destroyDOM } from "./destroy-dom";
import { extractChildren, mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";
import { VDOMType, VNode } from "./types";
import { hasOwnProperty } from "./utils/objects";

function createFiber({
  render,
  state,
  methods,
}: {
  render: () => VNode;
  state: (props?: object) => object;
  methods: Record<string, () => void>[];
}) {
  class Fiber {
    #isMounted = false;
    #vNode: VNode | null;
    #domElement: HTMLElement | null;

    props: object;
    state: object;

    constructor(props = {}) {
      this.props = props;
      this.state = state ? state(props) : {};
    }

    get domElements() {
      if (this.#vNode == null) {
        return [];
      }

      if (this.#vNode.type === VDOMType.FRAGMENT) {
        return extractChildren(this.#vNode).flatMap((child) => {
          if (child.type === VDOMType.FIBER) {
            return child.fiberInstance.domElements;
          }
          return child.domElement ? [child.domElement] : [];
        });
      }

      return this.#vNode.domElement ? [this.#vNode.domElement] : [];
    }

    get firstDOMElement() {
      return this.domElements[0];
    }

    get offset() {
      if (
        this.#domElement &&
        this.firstDOMElement &&
        this.#vNode?.type === VDOMType.FRAGMENT
      ) {
        return Array.from(this.#domElement?.childNodes).indexOf(
          this.firstDOMElement
        );
      }

      return 0;
    }

    render() {
      return render.call(this);
    }

    updateState(state: object) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    mount(hostDOMElement: HTMLElement, positionIndex: number | null = null) {
      if (this.#isMounted) throw new Error("Fiber is already mounted");

      this.#vNode = this.render();
      if (this.#vNode)
        mountDOM(this.#vNode, hostDOMElement, positionIndex, this);
      this.#domElement = hostDOMElement;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) throw new Error("Fiber is not mounted");

      if (this.#vNode) destroyDOM(this.#vNode);
      this.#vNode = null;
      this.#domElement = null;
      this.#isMounted = false;
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error("Fiber is not mounted");
      }

      const nextVNode = this.render();
      if (this.#vNode && this.#domElement)
        this.#vNode = patchDOM(this.#vNode, nextVNode, this.#domElement, this);
    }
  }

  for (const methodName in methods) {
    if (hasOwnProperty(Fiber, methodName)) {
      throw new Error(`Method ${methodName} already exists in the component.`);
    }

    Fiber.prototype[methodName] = methods[methodName];
  }

  return Fiber;
}

export type FiberClass = ReturnType<typeof createFiber>;
export type FiberInstance = InstanceType<FiberClass>;

export default createFiber;
