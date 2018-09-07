import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { connect } from 'react-redux'

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

    const markers = this.props.positions.map((position) =>
      <Marker key={position.id.toString()} position={{ lat: position.latitude, lng: position.longitude }}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    );

    return (
      <Map style={{height: this.props.height, width: this.props.width}} center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png" />
        {markers}
      </Map>
    )
  }
}

export default connect(mapStateToProps)(MainMap);
