export const prefixString = (prefix, value) => {
  return prefix + value.charAt(0).toUpperCase() + value.slice(1);
}

export const unprefixString = (prefix, value) => {
  return value.charAt(prefix.length).toLowerCase() + value.slice(prefix.length + 1);
}
