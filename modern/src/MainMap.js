import 'ol/ol.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import olms from 'ol-mapbox-style';

const mapStateToProps = state => ({
  positions: state.positions
});

class MainMap extends Component {
  componentDidMount() {
    this.map = new Map({
      target: this.el,
      view: new View({
        constrainResolution: true,
        center: fromLonLat([14.5, 46.05]),
        zoom: 3
      })
    });
    olms(this.map, 'https://cdn.traccar.com/map/basic.json');
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
