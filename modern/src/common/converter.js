export const speedConverter = (value, unit) => {
  let factor;
  switch (unit) {
    case 'kmh':
      factor = 1.852;
    case 'mph':
      factor = 1.15078;
    case 'kn':
    default:
      factor = 1;
  }
  return (value * factor).toFixed(2);
};
