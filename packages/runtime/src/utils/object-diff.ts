function objectsDiff(
  oldObject: object,
  newObject: object
): {
  added: string[];
  removed: string[];
  updated: string[];
} {
  const oldKeys = Object.keys(oldObject);
  const newKeys = Object.keys(newObject);

  return {
    added: newKeys.filter((newKey) => !(newKey in oldObject)),
    removed: oldKeys.filter((oldKey) => !(oldKey in newObject)),
    updated: newKeys.filter(
      (newKey) => newKey in oldObject && oldObject[newKey] !== newObject[newKey]
    ),
  };
}

export { objectsDiff };
