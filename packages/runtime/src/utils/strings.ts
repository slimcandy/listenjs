function isNotEmptyString(str: string) {
  return str !== "";
}

function isNotBlankOrEmptyString(str: string) {
  return isNotEmptyString(str.trim());
}

export { isNotBlankOrEmptyString };
