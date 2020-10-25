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

export const calculateBounds = features => {
  if (features && features.length) {
    const first = features[0].geometry.coordinates;
    const bounds = [[...first], [...first]];
    for (let feature of features) {
      const longitude = feature.geometry.coordinates[0]
      const latitude = feature.geometry.coordinates[1]
      if (longitude < bounds[0][0]) {
        bounds[0][0] = longitude;
      } else if (longitude > bounds[1][0]) {
        bounds[1][0] = longitude;
      }
      if (latitude < bounds[0][1]) {
        bounds[0][1] = latitude;
      } else if (latitude > bounds[1][1]) {
        bounds[1][1] = latitude;
      }
    }
    return bounds;
  } else {
    return null;
  }
}

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
