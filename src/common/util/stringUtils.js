export const prefixString = (prefix, value) => prefix + value.charAt(0).toUpperCase() + value.slice(1);

export const unprefixString = (prefix, value) => value.charAt(prefix.length).toLowerCase() + value.slice(prefix.length + 1);
