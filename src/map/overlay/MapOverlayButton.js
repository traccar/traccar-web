import { useEffect, useMemo } from 'react';
import { map } from '../core/MapView';
import './overlay.css';

const statusClass = (status) => `maplibregl-ctrl-icon maplibre-ctrl-overlay maplibre-ctrl-overlay-${status}`;

class OverlayControl {
  constructor(eventHandler) {
    this.eventHandler = eventHandler;
  }

  static getDefaultPosition() {
    return 'top-right';
  }

  onAdd() {
    this.button = document.createElement('button');
    this.button.className = statusClass('off');
    this.button.type = 'button';
    this.button.onclick = () => this.eventHandler(this);

    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl-group maplibregl-ctrl';
    this.container.appendChild(this.button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
  }

  setEnabled(enabled) {
    this.button.className = statusClass(enabled ? 'on' : 'off');
  }
}

const MapOverlayButton = ({ enabled, onClick }) => {
  const control = useMemo(() => new OverlayControl(onClick), [onClick]);

  useEffect(() => {
    map.addControl(control);
    return () => map.removeControl(control);
  }, [onClick]);

  useEffect(() => {
    control.setEnabled(enabled);
  }, [enabled]);

  return null;
};

export default MapOverlayButton;
