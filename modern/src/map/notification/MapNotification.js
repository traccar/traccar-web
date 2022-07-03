import { useEffect } from 'react';
import { map } from '../core/MapView';
import './notification.css';

class NotificationControl {
  constructor(eventHandler) {
    this.eventHandler = eventHandler;
  }

  onAdd() {
    const button = document.createElement('button');
    button.className = 'maplibregl-ctrl-icon maplibre-ctrl-notification';
    button.type = 'button';
    button.onclick = this.eventHandler;

    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl-group maplibregl-ctrl';
    this.container.appendChild(button);

    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
  }
}

const MapNotification = () => {
  useEffect(() => {
    const control = new NotificationControl(() => {});
    map.addControl(control);
    return () => map.removeControl(control);
  }, []);

  return null;
};

export default MapNotification;
