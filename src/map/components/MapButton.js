import { useEffect, useMemo } from 'react';
import { map } from '../core/MapView';
import './map-button.css';

class Button {
  constructor(eventHandler, type) {
    this.eventHandler = eventHandler;
    this.type = type;
  }

  static getDefaultPosition() {
    return 'top-right';
  }

  onAdd() {
    this.button = document.createElement('button');
    this.button.className = this.buildButtonClasses();
    this.button.type = 'button';
    this.button.onclick = () => this.eventHandler(this);

    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    this.container.appendChild(this.button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
  }

  setEnabled(enabled) {
    this.button.className = this.buildButtonClasses(enabled);
  }

  buildButtonClasses(enabled = false) {
    const classes = [
      'maplibre-ctrl-icon',
      `maplibre-ctrl-${this.type}-${enabled ? 'on' : 'off'}`,
    ];

    return classes.join(' ');
  }
}

const MapButton = ({ enabled, onClick, type }) => {
  const control = useMemo(() => new Button(onClick, type), [onClick, type]);

  useEffect(() => {
    map.addControl(control);
    return () => map.removeControl(control);
  }, [control]);

  useEffect(() => {
    control.setEnabled(enabled);
  }, [enabled, control]);

  return null;
};

export default MapButton;
