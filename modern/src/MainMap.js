import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';

import mapManager from './mapManager';
import store from './store';
import StatusView from './StatusView';
import { useHistory } from 'react-router-dom';

const MainMap = () => {
  const history = useHistory();

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
      deviceId: position.deviceId,
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

  const markerClickHandler = (event) => {
    const feature = event.features[0];
    let coordinates = feature.geometry.coordinates.slice();
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const placeholder = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <StatusView deviceId={feature.properties.deviceId} onShowDetails={positionId => history.push(`/position/${positionId}`)} />
      </Provider>,
      placeholder);

    new mapboxgl.Popup({
      offset: 25,
      anchor: 'top'
    })
      .setDOMContent(placeholder)
      .setLngLat(coordinates)
      .addTo(mapManager.map);
  };

  useEffect(() => {
    if (mapReady) {
      mapManager.map.addSource('positions', {
        'type': 'geojson',
        'data': positions,
      });
      mapManager.addLayer('device-icon', 'positions', 'icon-marker', '{name}', markerClickHandler);

      const bounds = mapManager.calculateBounds(positions.features);
      if (bounds) {
        mapManager.map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 9
        });
      }

      return () => {
        mapManager.removeLayer('device-icon', 'positions');
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
