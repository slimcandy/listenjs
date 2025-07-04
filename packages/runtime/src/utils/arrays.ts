function withoutNulls<T>(children: (T | null | undefined)[]): T[] {
  return children.filter((child) => child != null);
}

function arraysDiff<T>(
  oldArray: T[],
  newArray: T[]
): {
  added: T[];
  removed: T[];
} {
  return {
    added: newArray.filter((newArrayItem) => !oldArray.includes(newArrayItem)),
    removed: oldArray.filter(
      (oldArrayItem) => !newArray.includes(oldArrayItem)
    ),
  };
}

class ArrayWithOriginalIndices {
  #array = [];
  #originalIndices = [];
  #equalsFn;

  constructor(array, equalsFn) {
    this.#array = [...array];
    this.#originalIndices = array.map((index) => index);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#array.length;
  }
}

export { withoutNulls, arraysDiff };
