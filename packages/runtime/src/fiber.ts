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

function voidFunction() {}

type FiberEventListener = Record<FiberEventName, FiberEmitGenerator>;

type RegularProps = Record<string, VoidFunction>;
interface CreateFiberProps extends RegularProps {
  render: () => VNode;
  state: (props?: object) => object;
  onMounted: VoidFunction;
  onUnmounted: VoidFunction;
}

function createFiber({
  render,
  state,
  onMounted = voidFunction,
  onUnmounted = voidFunction,
  ...methods
}: CreateFiberProps) {
  class Fiber implements FiberInstance {
    #isMounted = false;
    #vNode: VNode | null;
    #domElement: HTMLElement | null;
    #fiberListeners: FiberEventListener;
    #parentFiberInstance: FiberInstance | null;
    #dispatcher = new Dispatcher();
    #unSubscriptions: Array<UnsubscribeFunction>;

    props: object;
    state: object;

    constructor(
      props: FiberProps = {},
      fiberEventMap: FiberEventMap = {},
      parentFiberInstance: FiberInstance | null = null
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

    onMounted() {
      return Promise.resolve<VoidFunction>(onMounted.call(this));
    }

    onUnmounted() {
      return Promise.resolve<VoidFunction>(onUnmounted.call(this));
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
export interface FiberInstance {
  props: object;
  state: object;
  domElements: (HTMLElement | Text)[];
  firstDOMElement: HTMLElement | Text | undefined;
  // остановился тут. Надо смотреть какой тип был раньше, что всё проходило и с текстом, и с элементом
  offset: number;

  render(): VNode;
  emit(fiberEventName: FiberEventName, actionPayload?: ActionPayload): void;
  updateProps(props: object): void;
  updateState(state: object): void;
  onMounted: () => Promise<VoidFunction>;
  onUnmounted: () => Promise<VoidFunction>;
  mount(hostDOMElement: HTMLElement, positionIndex?: number | null): void;
  unmount(): void;
}

export { createFiber };
