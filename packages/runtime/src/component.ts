import { destroyDOM } from "./destroy-dom";
import { extractChildren, mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";
import { DOMType, Fiber } from "./types";

function defineComponent({
  render,
  state,
}: {
  render: () => void;
  state?: (props: object) => object;
}) {
  class Component {
    #isMounted: boolean = false;
    #fiber: Fiber | null = null;
    #domElement: HTMLElement | null = null;

    state: object = {};
    props: object = {};

    constructor(props = {}) {
      this.props = props;
      this.state = state ? state(props) : {};
    }

    get elements() {
      if (this.#fiber == null) {
        return [];
      }

      if (this.#fiber.type === DOMType.FRAGMENT) {
        return extractChildren(this.#fiber).map((child) => child.domElement);
      }

      return [this.#fiber.domElement];
    }

    get firstElement() {
      return this.elements[0];
    }

    get offset() {
      if (
        this.#domElement &&
        this.#fiber?.type === DOMType.FRAGMENT &&
        this.firstElement
      ) {
        return Array.from(this.#domElement.children ?? []).indexOf(
          this.firstElement
        );
      }

      return 0;
    }

    updateState(state) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    render() {
      return render.call(this);
    }

    mount(domElement: HTMLElement, positionIndex: number = NaN) {
      if (this.#isMounted) {
        throw new Error("Component is already mounted");
      }

      this.#fiber = this.render();
      if (this.#fiber) mountDOM(this.#fiber, domElement, positionIndex);

      this.#domElement = domElement;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error("Component is not mounted. Cannot unmount.");
      }

      if (this.#fiber) {
        destroyDOM(this.#fiber);

        this.#fiber = null;
        this.#domElement = null;
        this.#isMounted = false;
      }
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error("Component is not mounted. Cannot patch.");
      }

      if (!this.#domElement || !this.#fiber) {
        throw new Error("Fiber or DOM element does not exists!");
      }

      const newFiber: Fiber = this.render();
      this.#fiber = patchDOM(this.#fiber, newFiber, this.#domElement);
    }
  }

  return Component;
}

export { defineComponent };
