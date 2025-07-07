export const fetchOrThrow = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
};
