import 'ol/ol.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import olms from 'ol-mapbox-style';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const mapStateToProps = state => ({
  positions: state.positions
});

class MainMap extends Component {
  componentDidMount() {
    this.map = new Map({
      target: this.el,
      view: new View({
        constrainResolution: true,
        center: fromLonLat([25.65, 60.98]),
        zoom: 9
      })
    });
    if (location.hostname === 'localhost') {
      olms(this.map, 'https://cdn.traccar.com/map/basic.json');
    } else {
      this.map.addLayer(
        new TileLayer({
          source: new OSM()
        })
      );
    }
  }

  render() {
    const style = {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%'
    };
    return <div style={style} ref={el => this.el = el} />;
  }
}

export default connect(mapStateToProps)(MainMap);
