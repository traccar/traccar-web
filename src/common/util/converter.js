const roundFloat = (value) => Number(value.toPrecision(12));

const speedConverter = (unit) => {
  switch (unit) {
    case 'kmh':
      return 1.852;
    case 'mph':
      return 1852 / 1609.344;
    case 'kn':
    default:
      return 1;
  }
};

export const speedUnitString = (unit, t) => {
  switch (unit) {
    case 'kmh':
      return t('sharedKmh');
    case 'mph':
      return t('sharedMph');
    case 'kn':
    default:
      return t('sharedKn');
  }
};

export const speedFromKnots = (value, unit) => roundFloat(value * speedConverter(unit));

export const speedToKnots = (value, unit) => value / speedConverter(unit);

const distanceConverter = (unit) => {
  switch (unit) {
    case 'mi':
      return 1 / 1609.344;
    case 'nmi':
      return 1 / 1852;
    case 'km':
    default:
      return 0.001;
  }
};

export const distanceUnitString = (unit, t) => {
  switch (unit) {
    case 'mi':
      return t('sharedMi');
    case 'nmi':
      return t('sharedNmi');
    case 'km':
    default:
      return t('sharedKm');
  }
};

export const distanceFromMeters = (value, unit) => roundFloat(value * distanceConverter(unit));

export const distanceToMeters = (value, unit) => value / distanceConverter(unit);

const altitudeConverter = (unit) => {
  switch (unit) {
    case 'ft':
      return 1 / 0.3048;
    case 'm':
    default:
      return 1;
  }
};

export const altitudeUnitString = (unit, t) => {
  switch (unit) {
    case 'ft':
      return t('sharedFeet');
    case 'm':
    default:
      return t('sharedMeters');
  }
};

export const altitudeFromMeters = (value, unit) => roundFloat(value * altitudeConverter(unit));

export const altitudeToMeters = (value, unit) => value / altitudeConverter(unit);

const volumeConverter = (unit) => {
  switch (unit) {
    case 'impGal':
      return 4.54609;
    case 'usGal':
      return 3.785411784;
    case 'ltr':
    default:
      return 1;
  }
};

export const volumeUnitString = (unit, t) => {
  switch (unit) {
    case 'impGal':
      return t('sharedGallonAbbreviation');
    case 'usGal':
      return t('sharedGallonAbbreviation');
    case 'ltr':
    default:
      return t('sharedLiterAbbreviation');
  }
};

export const volumeFromLiters = (value, unit) => roundFloat(value / volumeConverter(unit));

export const volumeToLiters = (value, unit) => value * volumeConverter(unit);
