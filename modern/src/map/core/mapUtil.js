import { parse, stringify } from 'wellknown';
import circle from '@turf/circle';

export const loadImage = (url) => new Promise((imageLoaded) => {
  const image = new Image();
  image.onload = () => imageLoaded(image);
  image.src = url;
});

const canvasTintImage = (image, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width * devicePixelRatio;
  canvas.height = image.height * devicePixelRatio;
  canvas.style.width = `${image.width}px`;
  canvas.style.height = `${image.height}px`;

  const context = canvas.getContext('2d');

  context.save();
  context.fillStyle = color;
  context.globalAlpha = 1;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = 'destination-atop';
  context.globalAlpha = 1;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  context.restore();

  return canvas;
};

export const prepareIcon = (background, icon, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = background.width * devicePixelRatio;
  canvas.height = background.height * devicePixelRatio;
  canvas.style.width = `${background.width}px`;
  canvas.style.height = `${background.height}px`;

  const context = canvas.getContext('2d');
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  if (icon) {
    const iconRatio = 0.5;
    const imageWidth = canvas.width * iconRatio;
    const imageHeight = canvas.height * iconRatio;
    context.drawImage(canvasTintImage(icon, color), (canvas.width - imageWidth) / 2, (canvas.height - imageHeight) / 2, imageWidth, imageHeight);
  }

  return context.getImageData(0, 0, canvas.width, canvas.height);
};

export const reverseCoordinates = (it) => {
  if (!it) {
    return it;
  } if (Array.isArray(it)) {
    if (it.length === 2 && typeof it[0] === 'number' && typeof it[1] === 'number') {
      return [it[1], it[0]];
    }
    return it.map((it) => reverseCoordinates(it));
  }
  return {
    ...it,
    coordinates: reverseCoordinates(it.coordinates),
  };
};

export const geofenceToFeature = (theme, item) => {
  let geometry;
  if (item.area.indexOf('CIRCLE') > -1) {
    const coordinates = item.area.replace(/CIRCLE|\(|\)|,/g, ' ').trim().split(/ +/);
    const options = { steps: 32, units: 'meters' };
    const polygon = circle([Number(coordinates[1]), Number(coordinates[0])], Number(coordinates[2]), options);
    geometry = polygon.geometry;
  } else {
    geometry = reverseCoordinates(parse(item.area));
  }
  return {
    id: item.id,
    type: 'Feature',
    geometry,
    properties: {
      name: item.name,
      color: item.attributes.color || theme.palette.colors.geometry,
    },
  };
};

export const geometryToArea = (geometry) => stringify(reverseCoordinates(geometry));

export const findFonts = (map) => {
  const fontSet = new Set();
  const { layers } = map.getStyle();
  layers?.forEach?.((layer) => {
    layer.layout?.['text-font']?.forEach?.(fontSet.add, fontSet);
  });
  const availableFonts = [...fontSet];
  const regularFont = availableFonts.find((it) => it.includes('Regular'));
  if (regularFont) {
    return [regularFont];
  }
  const anyFont = availableFonts.find(Boolean);
  if (anyFont) {
    return [anyFont];
  }
  return ['Roboto Regular'];
};
