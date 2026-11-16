import { parse, stringify } from 'wellknown';
import turfCircle from '@turf/circle';
import gcoord from 'gcoord';
import { map } from './MapView';

const coordinateSystem = (id) => {
  switch (id) {
    case 'gcj02':
      return gcoord.GCJ02;
    default:
      return gcoord.WGS84;
  }
};

export const toMapCoordinates = (longitude, latitude) =>
  map.coordinateSystem
    ? gcoord.transform([longitude, latitude], gcoord.WGS84, coordinateSystem(map.coordinateSystem))
    : [longitude, latitude];

export const fromMapCoordinates = (longitude, latitude) =>
  map.coordinateSystem
    ? gcoord.transform([longitude, latitude], coordinateSystem(map.coordinateSystem), gcoord.WGS84)
    : [longitude, latitude];

const transformGeometry = (geometry, from, to) =>
  gcoord.transform(structuredClone(geometry), from, to);

export const loadImage = (url) =>
  new Promise((imageLoaded, reject) => {
    const image = new Image();
    image.onload = () => imageLoaded(image);
    image.onerror = reject;
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

// Round marker for an uploaded device picture: white edge, ring in the state color, and the
// picture cropped to fill the inner circle (like the avatar in the device list)
export const prepareCircleIcon = (image, ringColor, size = 44) => {
  const ratio = devicePixelRatio;
  const canvas = document.createElement('canvas');
  canvas.width = size * ratio;
  canvas.height = size * ratio;
  const context = canvas.getContext('2d');
  const center = canvas.width / 2;
  const outer = center - 3 * ratio;
  const ring = outer - 1.5 * ratio;
  const inner = ring - 2.5 * ratio;

  context.save();
  context.shadowColor = 'rgba(15, 23, 42, 0.35)';
  context.shadowBlur = 4 * ratio;
  context.shadowOffsetY = 1 * ratio;
  context.beginPath();
  context.arc(center, center, outer, 0, 2 * Math.PI);
  context.fillStyle = '#FFFFFF';
  context.fill();
  context.restore();

  context.beginPath();
  context.arc(center, center, ring, 0, 2 * Math.PI);
  context.fillStyle = ringColor;
  context.fill();

  context.save();
  context.beginPath();
  context.arc(center, center, inner, 0, 2 * Math.PI);
  context.clip();
  context.fillStyle = '#FFFFFF';
  context.fillRect(center - inner, center - inner, inner * 2, inner * 2);
  const scale = Math.max((inner * 2) / image.width, (inner * 2) / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, center - width / 2, center - height / 2, width, height);
  context.restore();

  return context.getImageData(0, 0, canvas.width, canvas.height);
};

export const prepareIcon = (background, icon, color) => {
  const canvas = document.createElement('canvas');
  const width = background?.width ?? 48;
  const height = background?.height ?? 48;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext('2d');
  if (background) {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  }

  if (icon) {
    const iconRatio = background ? 0.5 : 1;
    const scale = Math.min(canvas.width / icon.width, canvas.height / icon.height) * iconRatio;
    const imageWidth = icon.width * scale;
    const imageHeight = icon.height * scale;
    context.drawImage(
      color ? canvasTintImage(icon, color) : icon,
      (canvas.width - imageWidth) / 2,
      (canvas.height - imageHeight) / 2,
      imageWidth,
      imageHeight,
    );
  }

  return context.getImageData(0, 0, canvas.width, canvas.height);
};

export const reverseCoordinates = (it) => {
  if (!it) {
    return it;
  }
  if (Array.isArray(it)) {
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
    const coordinates = item.area
      .replace(/CIRCLE|\(|\)|,/g, ' ')
      .trim()
      .split(/ +/);
    const options = { steps: 32, units: 'meters' };
    const polygon = turfCircle(
      toMapCoordinates(Number(coordinates[1]), Number(coordinates[0])),
      Number(coordinates[2]),
      options,
    );
    geometry = polygon.geometry;
  } else {
    geometry = reverseCoordinates(parse(item.area));
    if (map.coordinateSystem) {
      geometry = transformGeometry(geometry, gcoord.WGS84, coordinateSystem(map.coordinateSystem));
    }
  }
  return {
    id: item.id,
    type: 'Feature',
    geometry,
    properties: {
      name: item.name,
      color: item.attributes.color || theme.palette.geometry.main,
      width: item.attributes.mapLineWidth || 2,
      opacity: item.attributes.mapLineOpacity || 1,
    },
  };
};

export const geometryToArea = (geometry) => {
  const normalized = map.coordinateSystem
    ? transformGeometry(geometry, coordinateSystem(map.coordinateSystem), gcoord.WGS84)
    : geometry;
  return stringify(reverseCoordinates(normalized));
};

export const findFonts = (map) => {
  const { glyphs } = map.getStyle();
  if (glyphs.startsWith('https://tiles.openfreemap.org')) {
    return ['Noto Sans Regular'];
  }
  if (glyphs.startsWith('https://api.os.uk')) {
    return ['Source Sans Pro Regular'];
  }
  return ['Open Sans Regular', 'Arial Unicode MS Regular'];
};
