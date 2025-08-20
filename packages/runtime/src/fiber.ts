import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { extractChildren, mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";
import { VDOMType } from "./types";
import { hasOwnProperty } from "./utils/objects";

import type { ActionPayload, UnsubscribeFunction } from "./dispatcher";
import type {
  FiberEmitGenerator,
  FiberEventMap,
  FiberEventName,
  FiberProps,
  VNode,
} from "./types";

type FiberEventListener = Record<FiberEventName, FiberEmitGenerator>;

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
    #fiberListeners: FiberEventListener;
    #parentFiberInstance: unknown; // Changed to unknown to break circularity
    #dispatcher = new Dispatcher();
    #unSubscriptions: Array<UnsubscribeFunction>;

    props: object;
    state: object;

    constructor(
      props: FiberProps = {},
      fiberEventMap: FiberEventMap = {},
      parentFiberInstance: unknown = null // Changed to unknown to break circularity
    ) {
      this.props = props;
      this.state = state ? state(props) : {};
      this.#fiberListeners = fiberEventMap;
      this.#parentFiberInstance = parentFiberInstance;
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

    emit(fiberEventName: FiberEventName, actionPayload?: ActionPayload) {
      this.#dispatcher.dispatch(fiberEventName, actionPayload);
    }

    updateProps(props) {
      this.props = { ...this.props, ...props };
      this.#patch();
    }

    updateState(state: object) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    mount(hostDOMElement: HTMLElement, positionIndex: number | null = null) {
      if (this.#isMounted) {
        throw new Error("Fiber is already mounted");
      }

      this.#vNode = this.render();
      if (this.#vNode) {
        mountDOM(this.#vNode, hostDOMElement, positionIndex, this);
      }
      this.#wireFiberEventListeners();
      this.#domElement = hostDOMElement;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error("Fiber is not mounted");
      }

      if (this.#vNode) {
        destroyDOM(this.#vNode);
      }
      this.#unSubscriptions.forEach((unsubscribe) => unsubscribe());

      this.#vNode = null;
      this.#domElement = null;
      this.#isMounted = false;
      this.#unSubscriptions = [];
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error("Fiber is not mounted");
      }

      const nextVNode = this.render();
      if (this.#vNode && this.#domElement) {
        this.#vNode = patchDOM(this.#vNode, nextVNode, this.#domElement, this);
      }
    }

    #wireFiberEventListener(
      fiberEventName: FiberEventName,
      emitGenerator: FiberEmitGenerator
    ) {
      return this.#dispatcher.subscribe(fiberEventName, (payload) => {
        if (this.#parentFiberInstance) {
          emitGenerator.call(this.#parentFiberInstance, payload);
        } else {
          emitGenerator(payload);
        }
      });
    }

    #wireFiberEventListeners() {
      this.#unSubscriptions = Object.entries(this.#fiberListeners).map(
        ([fiberEventName, fiberEmitGenerator]) =>
          this.#wireFiberEventListener(fiberEventName, fiberEmitGenerator)
      );
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
