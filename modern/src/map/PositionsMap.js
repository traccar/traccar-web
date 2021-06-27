import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import { Provider, useSelector } from 'react-redux';

import { map } from './Map';
import store from '../store';
import { useHistory } from 'react-router-dom';
import StatusView from './StatusView';

const PositionsMap = ({ positions }) => {
  const id = 'positions';
  const clusters = `${id}-clusters`;

  const history = useHistory();
  const devices = useSelector(state => state.devices.items);

  const createFeature = (devices, position) => {
    const device = devices[position.deviceId] || null;
    return {
      deviceId: position.deviceId,
      name: device ? device.name : '',
      category: device && (device.category || 'default'),
    }
  };

  const onMouseEnter = () => map.getCanvas().style.cursor = 'pointer';
  const onMouseLeave = () => map.getCanvas().style.cursor = '';

  const onMarkerClick = useCallback(event => {
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
  }, [history]);

  const onClusterClick = event => {
    const features = map.queryRenderedFeatures(event.point, {
      layers: [clusters],
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource(id).getClusterExpansionZoom(clusterId, (error, zoom) => {
      if (!error) map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
  };

  useEffect(() => {
    map.addSource(id, {
      'type': 'geojson',
      'data': {
        type: 'FeatureCollection',
        features: [],
      },
      'cluster': true,
      'clusterMaxZoom': 14,
      'clusterRadius': 50,
    });
    map.addLayer({
      'id': id,
      'type': 'symbol',
      'source': id,
      'filter': ['!', ['has', 'point_count']],
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
    map.addLayer({
      'id': clusters,
      'type': 'symbol',
      'source': id,
      'filter': ['has', 'point_count'],
      'layout': {
        'icon-image': 'background',
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Roboto Regular'],
        'text-size': 14,
      },
    });


    map.on('mouseenter', id, onMouseEnter);
    map.on('mouseleave', id, onMouseLeave);
    map.on('mouseenter', clusters, onMouseEnter);
    map.on('mouseleave', clusters, onMouseLeave);
    map.on('click', id, onMarkerClick);
    map.on('click', clusters, onClusterClick);

    return () => {
      Array.from(map.getContainer().getElementsByClassName('mapboxgl-popup')).forEach(el => el.remove());

      map.off('mouseenter', id, onMouseEnter);
      map.off('mouseleave', id, onMouseLeave);
      map.off('mouseenter', clusters, onMouseEnter);
      map.off('mouseleave', clusters, onMouseLeave);
      map.off('click', id, onMarkerClick);
      map.off('click', clusters, onClusterClick);

      map.removeLayer(id);
      map.removeLayer(clusters);
      map.removeSource(id);
    };
  }, [onMarkerClick]);

  useEffect(() => {
    map.getSource(id).setData({
      type: 'FeatureCollection',
      features: positions.map(position => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [position.longitude, position.latitude],
        },
        properties: createFeature(devices, position),
      }))
    });
  }, [devices, positions]);

  return null;
}

export default PositionsMap;
