import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material';
import { loadImage, prepareIcon } from './mapUtil';

import directionSvg from '../../resources/images/direction.svg';
import backgroundSvg from '../../resources/images/background.svg';
import animalSvg from '@material-symbols/svg-600/outlined/pets.svg';
import bicycleSvg from '@material-symbols/svg-600/outlined/directions_bike.svg';
import boatSvg from '@material-symbols/svg-600/outlined/sailing.svg';
import busSvg from '@material-symbols/svg-600/outlined/directions_bus.svg';
import carSvg from '@material-symbols/svg-600/outlined/directions_car.svg';
import camperSvg from '@material-symbols/svg-600/outlined/rv_hookup.svg';
import craneSvg from '@material-symbols/svg-600/outlined/precision_manufacturing.svg';
import defaultSvg from '@material-symbols/svg-600/outlined/location_on.svg';
import startSvg from '@material-symbols/svg-600/outlined/play_circle.svg';
import finishSvg from '@material-symbols/svg-600/outlined/stop_circle.svg';
import helicopterSvg from '@material-symbols/svg-600/outlined/helicopter.svg';
import motorcycleSvg from '@material-symbols/svg-600/outlined/motorcycle.svg';
import personSvg from '@material-symbols/svg-600/outlined/person.svg';
import planeSvg from '@material-symbols/svg-600/outlined/flight.svg';
import scooterSvg from '@material-symbols/svg-600/outlined/moped.svg';
import shipSvg from '@material-symbols/svg-600/outlined/directions_boat.svg';
import tractorSvg from '@material-symbols/svg-600/outlined/agriculture.svg';
import trailerSvg from '@material-symbols/svg-600/outlined/auto_towing.svg';
import trainSvg from '@material-symbols/svg-600/outlined/train.svg';
import tramSvg from '@material-symbols/svg-600/outlined/tram.svg';
import truckSvg from '@material-symbols/svg-600/outlined/local_shipping.svg';
import vanSvg from '@material-symbols/svg-600/outlined/airport_shuttle.svg';

export const mapIcons = {
  animal: animalSvg,
  bicycle: bicycleSvg,
  boat: boatSvg,
  bus: busSvg,
  car: carSvg,
  camper: camperSvg,
  crane: craneSvg,
  default: defaultSvg,
  finish: finishSvg,
  helicopter: helicopterSvg,
  motorcycle: motorcycleSvg,
  person: personSvg,
  plane: planeSvg,
  scooter: scooterSvg,
  ship: shipSvg,
  start: startSvg,
  tractor: tractorSvg,
  trailer: trailerSvg,
  train: trainSvg,
  tram: tramSvg,
  truck: truckSvg,
  van: vanSvg,
};

export const mapIconKey = (category) => {
  switch (category) {
    case 'offroad':
    case 'pickup':
      return 'car';
    case 'trolleybus':
      return 'bus';
    default:
      return mapIcons.hasOwnProperty(category) ? category : 'default';
  }
};

export const mapImages = {};

const theme = createTheme({
  palette: {
    neutral: { main: grey[500] },
  },
});

export default async () => {
  const background = await loadImage(backgroundSvg);
  mapImages.background = await prepareIcon(background);
  mapImages.direction = await prepareIcon(await loadImage(directionSvg));
  await Promise.all(
    Object.keys(mapIcons).map(async (category) => {
      const results = [];
      ['info', 'success', 'error', 'neutral'].forEach((color) => {
        results.push(
          loadImage(mapIcons[category]).then((icon) => {
            mapImages[`${category}-${color}`] = prepareIcon(
              background,
              icon,
              theme.palette[color].main,
            );
          }),
        );
      });
      await Promise.all(results);
    }),
  );
};
