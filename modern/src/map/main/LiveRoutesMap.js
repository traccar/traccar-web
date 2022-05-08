import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { map } from '../core/Map';
import { usePrevious } from '../../reactHelper';

const LiveRoutesMap = () => {
  const id = 'liveRoute';

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const currentDeviceId = usePrevious(selectedDeviceId);

  const position = useSelector((state) => state.positions.items[selectedDeviceId]);

  const [route, setRoute] = useState([]);

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      },
    });
    map.addLayer({
      source: id,
      id,
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3bb2d0',
        'line-width': 2,
      },
    });

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDeviceId !== currentDeviceId) {
      if (!selectedDeviceId) {
        setRoute([]);
      } else if (position) {
        setRoute([position]);
      }
    } else if (position) {
      const last = route.at(-1);
      if (!last || (last.latitude !== position.latitude && last.longitude !== position.longitude)) {
        setRoute([...route.slice(-9), position]);
      }
    }
  }, [selectedDeviceId, currentDeviceId, position, route]);

  useEffect(() => {
    map.getSource(id).setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route.map((item) => [item.longitude, item.latitude]),
      },
    });
  }, [route]);

  return null;
};

export default LiveRoutesMap;
