import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { map } from './MapView';
import { loadImage, prepareCircleIcon } from './mapUtil';
import { markerColors, markerPalette } from './preloadImages';
import { useAsyncTask } from '../../reactHelper';
import mediaUrl from '../../common/util/mediaUrl';

// Map image name of an uploaded device icon drawn with the ring in the given marker color
export const deviceIconImage = (url, color) =>
  `${url}#${markerColors.includes(color) ? color : 'neutral'}`;

// Loads uploaded device icons as round markers (one image per marker color).
// Returns device id -> icon url for the icons that loaded; others keep the category icon.
export default () => {
  const [images, setImages] = useState({});
  const icons = useSelector(
    (state) =>
      Object.fromEntries(
        Object.values(state.devices.items)
          .filter((device) => device.attributes?.deviceIcon)
          .map((device) => [device.id, mediaUrl(device.uniqueId, device.attributes.deviceIcon)]),
      ),
    shallowEqual,
  );

  useAsyncTask(
    async ({ signal }) => {
      await Promise.all(
        Object.entries(icons).map(async ([id, url]) => {
          try {
            const response = await fetch(url, { cache: 'no-cache', signal });
            if (!response.ok) return;
            const objectUrl = URL.createObjectURL(await response.blob());
            try {
              const image = await loadImage(objectUrl);
              if (signal.aborted) return;
              markerColors.forEach((color) => {
                const name = deviceIconImage(url, color);
                const data = prepareCircleIcon(image, markerPalette[color].main);
                if (map.hasImage(name)) {
                  map.updateImage(name, data);
                } else {
                  map.addImage(name, data, { pixelRatio: window.devicePixelRatio });
                }
              });
              setImages((previous) => ({ ...previous, [id]: url }));
            } finally {
              URL.revokeObjectURL(objectUrl);
            }
          } catch {
            // Keep fallback icon.
          }
        }),
      );
    },
    [icons],
  );

  return Object.fromEntries(Object.entries(icons).filter(([id, url]) => images[id] === url));
};
