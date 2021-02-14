const speedConverter = (value, unit, back = false) => {
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
  return back ? value / factor: value * factor;
};

const distanceConverter = (value, unit, back = false) => {
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

export const speedFromKnots = (value, unit) => {
  return speedConverter(value, unit);
}

export const speedToKnots = (value, unit) => {
  return speedConverter(value, unit, true);
}

export const distanceFromMeters = (value, unit) => {
  return distanceConverter(value, unit);
}

export const distanceToMeters = (value, unit) => {
  return distanceConverter(value, unit, true);
}
