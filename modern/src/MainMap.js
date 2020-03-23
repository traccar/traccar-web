import 'mapbox-gl/src/css/mapbox-gl.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

const mapFeatureProperties = (state, position) => {
  return {
    name: state.devices.get(position.deviceId).name
  }
}

const mapStateToProps = state => ({
  data: {
    type: 'FeatureCollection',
    features: Array.from(state.positions.values()).map(position => ({
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
      center: [25.65, 60.98],
      zoom: 0
    });

    map.on('load', () => this.mapDidLoad(map));
  }

  loadImage(key, url) {
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
    }
    image.src = url;
  }

  mapDidLoad(map) {
    this.map = map;

    this.loadImage('background', 'images/background.svg');
    this.loadImage('icon-marker', 'images/icon/marker.svg');

    map.addSource('positions', {
      'type': 'geojson',
      'data': this.props.data
    });

    map.addLayer({
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

    map.addLayer({
      'id': 'device-icon',
      'type': 'symbol',
      'source': 'positions',
      'layout': {
        'icon-image': 'icon-marker',
        'icon-allow-overlap': true
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.map && prevProps.data !== this.props.data) {
      this.map.getSource('positions').setData(this.props.data);
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
