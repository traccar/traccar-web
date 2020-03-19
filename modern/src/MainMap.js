import 'ol/ol.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import olms from 'ol-mapbox-style';

const mapStateToProps = state => ({
  positions: state.positions
});

class MainMap extends Component {
  componentDidMount() {
    olms(this.el, 'https://cdn.traccar.com/map/basic.json');
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
