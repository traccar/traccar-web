import React, {Component} from 'react';
import {render} from 'react-dom';
import {DivIcon, marker} from 'leaflet';
import {MapLayer, withLeaflet} from 'react-leaflet';
import PropTypes from 'prop-types';

function createContextProvider(context) {
  class ContextProvider extends Component {
    getChildContext() {
      return context;
    }

    render() {
      return this.props.children;
    }
  }

  ContextProvider.childContextTypes = {};
  Object.keys(context).forEach(key => {
    ContextProvider.childContextTypes[key] = PropTypes.any;
  });
  return ContextProvider;
}

export class Divicon extends MapLayer {
  static propTypes = {
    opacity: PropTypes.number,
    zIndexOffset: PropTypes.number,
  }

  static childContextTypes = {
    popupContainer: PropTypes.object,
  }

  getChildContext() {
    return {
      popupContainer: this.leafletElement,
    }
  }

  // See https://github.com/PaulLeCam/react-leaflet/issues/275
  createLeafletElement(newProps) {
    const {map: _map, layerContainer: _lc, position, ...props} = newProps;
    this.icon = new DivIcon(props);
    return marker(position, {icon: this.icon, ...props});
  }

  updateLeafletElement(fromProps, toProps) {
    if (toProps.position !== fromProps.position) {
      this.leafletElement.setLatLng(toProps.position);
    }
    if (toProps.zIndexOffset !== fromProps.zIndexOffset) {
      this.leafletElement.setZIndexOffset(toProps.zIndexOffset);
    }
    if (toProps.opacity !== fromProps.opacity) {
      this.leafletElement.setOpacity(toProps.opacity);
    }
    if (toProps.draggable !== fromProps.draggable) {
      if (toProps.draggable) {
        this.leafletElement.dragging.enable();
      }
      else {
        this.leafletElement.dragging.disable();
      }
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.renderComponent();
  }

  componentDidUpdate(fromProps) {
    this.renderComponent();
    this.updateLeafletElement(fromProps, this.props);
  }

  renderComponent = () => {
    const ContextProvider = createContextProvider({...this.context, ...this.getChildContext()});
    const container = this.leafletElement._icon;
    const component = (
      <ContextProvider>
        {this.props.children}
      </ContextProvider>
    );
    if (container) {
      render(
        component,
        container
      );
    }
  }

  render() {
    return null;
  }
}

export default withLeaflet(Divicon)
