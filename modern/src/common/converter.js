const speedConverter = unit => {
  switch (unit) {
    case 'kmh':
      return 1.852;
    case 'mph':
      return 1.15078;
    case 'kn':
    default:
      return 1;
  }
};

const distanceConverter = unit => {
  switch (unit) {
    case 'mi':
      return 0.000621371;
    case 'nmi':
      return 0.000539957;
    case 'km':
    default:
      return 0.001;
  } 
}

export const speedFromKnots = (value, unit) => {
  return value * speedConverter(unit);
}

export const speedToKnots = (value, unit) => {
  return value / speedConverter(unit);
}

export const distanceFromMeters = (value, unit) => {
  return value * distanceConverter(unit);
}

export const distanceToMeters = (value, unit) => {
  return value / distanceConverter(unit);
}
