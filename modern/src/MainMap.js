import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import mapManager from './mapManager';

const MainMap = () => {
  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const mapCenter = useSelector(state => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return [position.longitude, position.latitude];
      }
    }
    return null;
  });
  
  const createFeature = (state, position) => {
    const device = state.devices.items[position.deviceId] || null;
    return {
      name: device ? device.name : '',
    }
  };
  
  const positions = useSelector(state => ({
    type: 'FeatureCollection',
    features: Object.values(state.positions.items).map(position => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [position.longitude, position.latitude]
      },
      properties: createFeature(state, position),
    })),
  }));
  
  useLayoutEffect(() => {
    const currentEl = containerEl.current;
    currentEl.appendChild(mapManager.element);
    if (mapManager.map) {
      mapManager.map.resize();
    }
    return () => {
      currentEl.removeChild(mapManager.element);
    };
  }, [containerEl]);

  useEffect(() => {
    mapManager.registerListener(() => setMapReady(true));
  }, []);

  useEffect(() => {
    if (mapReady) {
      mapManager.map.addSource('positions', {
        'type': 'geojson',
        'data': positions,
      });
      mapManager.addLayer('device-icon', 'positions', 'icon-marker', '{name}');

      const bounds = mapManager.calculateBounds(positions.features);
      if (bounds) {
        mapManager.map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 9
        });
      }

      return () => {
        mapManager.map.removeLayer('device-icon');
        mapManager.map.removeSource('positions');
      };
    }
  }, [mapReady]);

  useEffect(() => {
    mapManager.map.easeTo({
      center: mapCenter
    });
  }, [mapCenter]);

  useEffect(() => {
    const source = mapManager.map.getSource('positions');
    if (source) {
      source.setData(positions);
    }
  }, [positions]);

  const style = {
    width: '100%',
    height: '100%',
  };

  return <div style={style} ref={containerEl} />;
}

export default MainMap;
