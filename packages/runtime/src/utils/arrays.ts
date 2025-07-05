import { ARRAY_DIFF_OP } from "../types";

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

type ArrayToCompare = unknown[];
type EqualsFn = (a: unknown, b: unknown) => boolean;

interface Operation {
  op: ARRAY_DIFF_OP;
  index: number;
  item: unknown;
}

interface NoopOperation extends Operation {
  originalIndex: number;
}

interface MoveOperation extends Operation {
  originalIndex: number;
  from: number;
}

class ArrayWithOriginalIndices {
  #array: ArrayToCompare = [];
  #originalIndices: number[] = [];
  #equalsFn: EqualsFn;

  constructor(array, equalsFn) {
    this.#array = [...array];
    this.#originalIndices = array.map((index) => index);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#array.length;
  }

  originalIndexAt(index: number) {
    return this.#originalIndices[index];
  }

  findIndexFrom(item: unknown, fromIndex: number) {
    for (let index = fromIndex; index < this.length; index++) {
      if (this.#equalsFn(item, this.#array[index])) {
        return index;
      }
    }

    return -1;
  }

  wasElementRemoved(index: number, newArray: ArrayToCompare) {
    if (index >= this.length) {
      return false;
    }

    const item = this.#array[index];
    const indexInNewArray = newArray.findIndex((newItem) =>
      this.#equalsFn(item, newItem)
    );

    return indexInNewArray === -1;
  }

  wasElementTheSame(index: number, newArray: ArrayToCompare) {
    if (index >= this.length) {
      return false;
    }

    const item = this.#array[index];
    const newItem = newArray[index];

    return this.#equalsFn(item, newItem);
  }

  wasElementAdded(item: unknown, fromIndex: number) {
    return this.findIndexFrom(item, fromIndex) === -1;
  }

  removeItemAction(index: number): Operation {
    const operation: Operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#array[index],
    };

    this.#array.splice(index, 1);
    this.#originalIndices.splice(index, 1);

    return operation;
  }

  noopItemAction(index: number): NoopOperation {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(index),
      index,
      item: this.#array[index],
    };
  }

  addItemAction(item: unknown, index: number): Operation {
    const operation: Operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    };

    this.#array.splice(index, 0, item);
    this.#originalIndices.splice(index, 0, -1);

    return operation;
  }

  moveItemAction(item: unknown, toIndex: number): MoveOperation {
    const fromIndex = this.findIndexFrom(item, toIndex);

    const operation: MoveOperation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#array[fromIndex],
    };

    const [_item] = this.#array.splice(fromIndex, 1);
    this.#array.splice(toIndex, 0, _item);

    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1);
    this.#originalIndices.splice(toIndex, 0, originalIndex);

    return operation;
  }

  removeRestItems(index: number): Operation[] {
    const operations: Operation[] = [];

    while (this.length > index) {
      operations.push(this.removeItemAction(index));
    }

    return operations;
  }
}

function arraysDiffSequence(
  oldArray: ArrayToCompare,
  newArray: ArrayToCompare,
  equalsFn: EqualsFn = (a, b) => a === b
): Array<Operation | NoopOperation | MoveOperation> {
  const sequence: Array<Operation | NoopOperation | MoveOperation> = [];
  const array = new ArrayWithOriginalIndices(oldArray, equalsFn);

  for (let index = 0; index < newArray.length; index++) {
    if (array.wasElementRemoved(index, newArray)) {
      sequence.push(array.removeItemAction(index));
      index--;
      continue;
    }

    if (array.wasElementTheSame(index, newArray)) {
      sequence.push(array.noopItemAction(index));
      continue;
    }

    const item = newArray[index];

    if (array.wasElementAdded(item, index)) {
      sequence.push(array.addItemAction(item, index));
      continue;
    }

    sequence.push(array.moveItemAction(item, index));
  }

  sequence.push(...array.removeRestItems(newArray.length));

  return sequence;
}

export { withoutNulls, arraysDiff, arraysDiffSequence };
