import palette from '../../common/theme/palette';
import { loadImage, prepareIcon } from './mapUtil';

import backgroundSvg from '../../../public/images/background.svg';
import animalSvg from '../../../public/images/icon/animal.svg';
import bicycleSvg from '../../../public/images/icon/bicycle.svg';
import boatSvg from '../../../public/images/icon/boat.svg';
import busSvg from '../../../public/images/icon/bus.svg';
import carSvg from '../../../public/images/icon/car.svg';
import craneSvg from '../../../public/images/icon/crane.svg';
import defaultSvg from '../../../public/images/icon/default.svg';
import helicopterSvg from '../../../public/images/icon/helicopter.svg';
import motorcycleSvg from '../../../public/images/icon/motorcycle.svg';
import offroadSvg from '../../../public/images/icon/offroad.svg';
import personSvg from '../../../public/images/icon/person.svg';
import pickupSvg from '../../../public/images/icon/pickup.svg';
import planeSvg from '../../../public/images/icon/plane.svg';
import scooterSvg from '../../../public/images/icon/scooter.svg';
import shipSvg from '../../../public/images/icon/ship.svg';
import tractorSvg from '../../../public/images/icon/tractor.svg';
import trainSvg from '../../../public/images/icon/train.svg';
import tramSvg from '../../../public/images/icon/tram.svg';
import trolleybusSvg from '../../../public/images/icon/trolleybus.svg';
import truckSvg from '../../../public/images/icon/truck.svg';
import vanSvg from '../../../public/images/icon/van.svg';

export const mapIcons = {
  animal: animalSvg,
  bicycle: bicycleSvg,
  boat: boatSvg,
  bus: busSvg,
  car: carSvg,
  crane: craneSvg,
  default: defaultSvg,
  helicopter: helicopterSvg,
  motorcycle: motorcycleSvg,
  offroad: offroadSvg,
  person: personSvg,
  pickup: pickupSvg,
  plane: planeSvg,
  scooter: scooterSvg,
  ship: shipSvg,
  tractor: tractorSvg,
  train: trainSvg,
  tram: tramSvg,
  trolleybus: trolleybusSvg,
  truck: truckSvg,
  van: vanSvg,
};

export const mapImages = {};

export default async () => {
  const background = await loadImage(backgroundSvg);
  mapImages.background = await prepareIcon(background);
  await Promise.all(Object.keys(mapIcons).map(async (category) => {
    const results = [];
    ['positive', 'negative', 'neutral'].forEach((color) => {
      results.push(loadImage(mapIcons[category]).then((icon) => {
        mapImages[`${category}-${color}`] = prepareIcon(background, icon, palette.colors[color]);
      }));
    });
    await Promise.all(results);
  }));
};
