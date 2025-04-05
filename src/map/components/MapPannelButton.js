import { useEffect, useMemo } from 'react';
import { map } from '../core/MapView';
import './map-pannel-button.css';

class PanelButton {
  constructor(eventHandler, iconClass) {
    this.eventHandler = eventHandler;
    this.iconClass = iconClass;
  }

  static getDefaultPosition() {
    return 'top-right';
  }

  onAdd() {
    this.button = document.createElement('button');
    this.button.className = this.iconClass('off');
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
    this.button.className = this.iconClass(enabled ? 'on' : 'off');
  }
}

const MapPanelButton = ({ enabled, onClick, iconClass }) => {
  const control = useMemo(
    () => new PanelButton(onClick, iconClass),
    [onClick, iconClass],
  );

  useEffect(() => {
    map.addControl(control);
    return () => map.removeControl(control);
  }, [control]);

  useEffect(() => {
    control.setEnabled(enabled);
  }, [enabled, control]);

  return null;
};

export default MapPanelButton;
