import 'mapbox-gl/dist/mapbox-gl.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

const calculateMapCenter = (state) => {
  if (state.devices.selectedId) {
    const position = state.positions.items[state.devices.selectedId] || null;
    if (position) {
      return [position.longitude, position.latitude];
    }
  }
  return null;
}

const mapFeatureProperties = (state, position) => {
  const device = state.devices.items[position.deviceId] || null;
  return {
    name: device ? device.name : ''
  }
}

const mapStateToProps = state => ({
  mapCenter: calculateMapCenter(state),
  data: {
    type: 'FeatureCollection',
    features: Object.values(state.positions.items).map(position => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [position.longitude, position.latitude]
      },
      properties: mapFeatureProperties(state, position)
    }))
  }
});

class MainMap extends Component {
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'https://cdn.traccar.com/map/basic.json',
      center: [0, 0],
      zoom: 1
    });

    map.on('load', () => this.mapDidLoad(map));
  }

  loadImage(key, url) {
    return new Promise(resolutionFunc => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width * window.devicePixelRatio;
        canvas.height = image.height * window.devicePixelRatio;
        canvas.style.width = `${image.width}px`;
        canvas.style.height = `${image.height}px`;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.map.addImage(key, context.getImageData(0, 0, canvas.width, canvas.height), {
          pixelRatio: window.devicePixelRatio
        });
        resolutionFunc()
      }
      image.src = url;
    });
  }

  mapDidLoad(map) {
    this.map = map;

    Promise.all([
      this.loadImage('background', 'images/background.svg'),
      this.loadImage('icon-marker', 'images/icon/marker.svg')
    ]).then(() => {
      this.imagesDidLoad();
    });
  }

  imagesDidLoad() {
    this.map.addSource('positions', {
      'type': 'geojson',
      'data': this.props.data
    });

    this.map.addLayer({
      'id': 'device-background',
      'type': 'symbol',
      'source': 'positions',
      'layout': {
        'icon-image': 'background',
        'icon-allow-overlap': true,
        'text-field': '{name}',
        'text-allow-overlap': true,
        'text-anchor': 'bottom',
        'text-offset': [0, -2],
        'text-font': ['Roboto Regular'],
        'text-size': 12
      },
      'paint':{
        'text-halo-color': 'white',
        'text-halo-width': 1
     }
    });

    this.map.addLayer({
      'id': 'device-icon',
      'type': 'symbol',
      'source': 'positions',
      'layout': {
        'icon-image': 'icon-marker',
        'icon-allow-overlap': true
      }
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    const bounds = this.calculateBounds();
    if (bounds) {
      this.map.fitBounds(bounds, {
        padding: 100,
        maxZoom: 9
      });
    }
  }

  calculateBounds() {
    if (this.props.data.features && this.props.data.features.length) {
      const first = this.props.data.features[0].geometry.coordinates;
      const bounds = [[...first], [...first]];
      for (let feature of this.props.data.features) {
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

  componentDidUpdate(prevProps) {
    if (this.map) {
      if (prevProps.mapCenter !== this.props.mapCenter) {
        this.map.easeTo({
          center: this.props.mapCenter
        });
      }
      if (prevProps.data.features !== this.props.data.features) {
        this.map.getSource('positions').setData(this.props.data);
      }
    }
  }

  render() {
    const style = {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%'
    };
    return <div style={style} ref={el => this.mapContainer = el} />;
  }
}

export default connect(mapStateToProps)(MainMap);
