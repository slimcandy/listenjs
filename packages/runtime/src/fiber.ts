import { destroyDOM } from "./destroy-dom";
import { mountHostComponent } from "./mount-host-component";
import { VNode } from "./types";

function createFiber({
  render,
  state,
}: {
  render: () => VNode;
  state: (props?: object) => object;
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

    render() {
      return render();
    }

    mount(hostDOMElement: HTMLElement, positionIndex: number | null = null) {
      if (this.#isMounted) throw new Error("Fiber is already mounted");

      this.#vNode = this.render();
      mountHostComponent(this.#vNode, hostDOMElement, positionIndex);
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
  }

  return Fiber;
}

export default createFiber;
