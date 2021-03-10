import wellknown from 'wellknown';
import circle from '@turf/circle';

export const loadImage = (url) => {
  return new Promise(imageLoaded => {
    const image = new Image();
    image.onload = () => imageLoaded(image);
    image.src = url;
  });
};

export const loadIcon = async (key, background, url) => {
  const image = await loadImage(url);
  const pixelRatio = window.devicePixelRatio;

  const canvas = document.createElement('canvas');
  canvas.width = background.width * pixelRatio;
  canvas.height = background.height * pixelRatio;
  canvas.style.width = `${background.width}px`;
  canvas.style.height = `${background.height}px`;

  const context = canvas.getContext('2d');
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  const iconRatio = 0.5;
  const imageWidth = canvas.width * iconRatio;
  const imageHeight = canvas.height * iconRatio;
  context.drawImage(image, (canvas.width - imageWidth) / 2, (canvas.height - imageHeight) / 2, imageWidth, imageHeight);

  return context.getImageData(0, 0, canvas.width, canvas.height);
};

export const reverseCoordinates = it => {
  if (!it) {
    return it;
  } else if (Array.isArray(it)) {
    if (it.length === 2 && !Number.isNaN(it[0]) && !Number.isNaN(it[1])) {
      return [it[1], it[0]];
    } else {
      return it.map(it => reverseCoordinates(it));
    }
  } else {
    return {
      ...it,
      coordinates: reverseCoordinates(it.coordinates),
    }
  }
}

export const geofenceToFeature = (item) => {
  if (item.area.indexOf('CIRCLE') > -1) {
    let coordinates = item.area.replace(/CIRCLE|\(|\)|,/g, " ").trim().split(/ +/);
    var options = { steps: 32, units: 'meters' };
    let polygon = circle([Number(coordinates[1]), Number(coordinates[0])], Number(coordinates[2]), options);
    return { 
      type: 'Feature',
      geometry: polygon.geometry,
      properties: { name: item.name }
    };
  } else {
    return { 
      type: 'Feature',
      geometry: reverseCoordinates(wellknown(item.area)),
      properties: { name: item.name }
    };
  }
}

  
