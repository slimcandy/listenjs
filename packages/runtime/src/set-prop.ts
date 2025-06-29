function setProp(domElement: HTMLElement, attrs: Record<string, unknown>) {
  const { class: className, style, ...restAttrs } = attrs;

  if (typeof className === "string" || Array.isArray(className)) {
    setClass(domElement, className);
  }

  if (style) {
    Object.entries(style).forEach(([key, value]) => {
      if (typeof value === "string") {
        setStyle(domElement, key, value);
      }
    });
  }

  for (const [key, value] of Object.entries(restAttrs)) {
    if (typeof value === "string") {
      setValueForAttribute(domElement, key, value);
    }
  }
}

function setClass(domElement: HTMLElement, className: string | string[]) {
  domElement.className = "";

  if (typeof className === "string") {
    domElement.className = className;
  }

  if (Array.isArray(className)) {
    domElement.classList.add(...className);
  }
}

function setStyle(domElement: HTMLElement, key: string, value: string) {
  domElement.style[key] = value;
}

function removeStyle(domElement: HTMLElement, key: string) {
  domElement.style[key] = null;
}

function setValueForAttribute(
  domElement: HTMLElement,
  key: string,
  value: string
) {
  if (value == null) {
    removeValueForAttribute(domElement, key);
  } else if (key.startsWith("data-")) {
    domElement.setAttribute(key, value);
  } else {
    domElement[key] = value;
  }
}

function removeValueForAttribute(domElement: HTMLElement, key: string) {
  domElement[key] = null;
  domElement.removeAttribute(key);
}

export { setProp };
