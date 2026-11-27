import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { map } from './MapView';
import { loadImage, prepareIcon } from './mapUtil';
import { useAsyncTask } from '../../reactHelper';
import mediaUrl from '../../common/util/mediaUrl';

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
              const data = prepareIcon(null, image);
              if (map.hasImage(url)) {
                map.updateImage(url, data);
              } else {
                map.addImage(url, data, { pixelRatio: window.devicePixelRatio });
              }
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
