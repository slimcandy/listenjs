function setProp(domElement, attrs) {
  const { class: className, style, ...restAttrs } = attrs;

  if (className) {
    setClass(domElement, className);
  }

  if (style) {
    Object.entries(style).forEach(([key, value]) => {
      setStyle(domElement, key, value);
    });
  }

  for (const [key, value] of Object.entries(restAttrs)) {
    setValueForAttribute(domElement, key, value);
  }
}

function setClass(domElement, className) {
  domElement.className = "";

  if (typeof className === "string") {
    domElement = className;
  }

  if (Array.isArray(className)) {
    domElement.classList.add(...className);
  }
}

function setStyle(domElement, key, value) {
  domElement.style[key] = value;
}

function removeStyle(domElement, key) {
  domElement.style[key] = null;
}

function setValueForAttribute(domElement, key, value) {
  if (value == null) {
    removeValueForAttribute(domElement, key);
  } else if (key.startsWith("data-")) {
    domElement.setAttribute(key, value);
  } else {
    domElement[key] = value;
  }
}

function removeValueForAttribute(domElement, key) {
  domElement[key] = null;
  domElement.removeAttribute(key);
}
