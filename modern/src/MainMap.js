import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { connect } from 'react-redux'
import DivIcon from './leaflet/DivIcon';

const mapStateToProps = state => ({
  positions: state.positions
});

class MainMap extends Component {
  state = {
    lat: 0,
    lng: 0,
    zoom: 3,
  }

  render() {
    const position = [this.state.lat, this.state.lng]

    const markers = this.props.positions.map(position =>
      <DivIcon key={position.id.toString()} position={{ lat: position.latitude, lng: position.longitude }} className="" iconSize={[50, 50]}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" stroke="#fff" stroke-width="2.5" fill="#008000" />
          <path d="m25 5v5" stroke="#fff" stroke-width="2.5" />
          <image x="13" y="13" fill="#fff" href="/category/car.svg" />
        </svg>
      </DivIcon>
    );

    return (
      <Map style={{height: this.props.height, width: this.props.width}} center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png" />
        {markers}
      </Map>
    )
  }
}

export default connect(mapStateToProps)(MainMap);
