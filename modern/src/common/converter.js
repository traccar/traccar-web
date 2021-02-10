export const speedConverter = (value, unit, back = false) => {
  let factor;
  switch (unit) {
    case 'kmh':
      factor = 1.852;
      break;
    case 'mph':
      factor = 1.15078;
      break;
    case 'kn':
    default:
      factor = 1;
  }
  return back ? (value / factor).toFixed(2):(value * factor).toFixed(2);
};

export const distanceConverter = (value, unit, back = false) => {
  let factor;
  switch (unit) {
    case 'mi':
      factor = 0.000621371;
      break;
    case 'nmi':
      factor = 0.000539957;
      break;
    case 'km':
    default:
      factor = 0.001;
  }
  return back ? value / factor : value * factor;  
}