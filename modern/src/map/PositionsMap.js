import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import { Provider, useSelector } from 'react-redux';

import { map } from './Map';
import store from '../store';
import { useHistory } from 'react-router-dom';
import StatusView from './StatusView';

const PositionsMap = () => {
  const id = 'positions';

  const history = useHistory();

  const createFeature = (state, position) => {
    const device = state.devices.items[position.deviceId] || null;
    return {
      deviceId: position.deviceId,
      name: device ? device.name : '',
      category: device && device.category || 'default',
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

  const onMouseEnter = () => map.getCanvas().style.cursor = 'pointer';
  const onMouseLeave = () => map.getCanvas().style.cursor = '';

  const onClick = event => {
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
      placeholder
    );

    new mapboxgl.Popup({
      offset: 25,
      anchor: 'top'
    })
      .setDOMContent(placeholder)
      .setLngLat(coordinates)
      .addTo(map);
  };

  useEffect(() => {
    map.addSource(id, {
      'type': 'geojson',
      'data': positions,
    });
    map.addLayer({
      'id': id,
      'type': 'symbol',
      'source': id,
      'layout': {
        'icon-image': '{category}',
        'icon-allow-overlap': true,
        'text-field': '{name}',
        'text-allow-overlap': true,
        'text-anchor': 'bottom',
        'text-offset': [0, -2],
        'text-font': ['Roboto Regular'],
        'text-size': 12,
      },
      'paint': {
        'text-halo-color': 'white',
        'text-halo-width': 1,
      },
    });

    map.on('mouseenter', id, onMouseEnter);
    map.on('mouseleave', id, onMouseLeave);
    map.on('click', id, onClick);

    return () => {
      Array.from(map.getContainer().getElementsByClassName('mapboxgl-popup')).forEach(el => el.remove());

      map.off('mouseenter', id, onMouseEnter);
      map.off('mouseleave', id, onMouseLeave);
      map.off('click', id, onClick);

      map.removeLayer(id);
      map.removeSource(id);
    };
  }, []);

  useEffect(() => {
    map.getSource(id).setData(positions);
  }, [positions]);

  return null;
}

export default PositionsMap;
