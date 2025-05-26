import { useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material';
import { map } from '../core/MapView';
import './notification.css';

const statusClass = (status) => `maplibregl-ctrl-icon maplibre-ctrl-notification maplibre-ctrl-notification-${status}`;

class NotificationControl {
  constructor(eventHandler) {
    this.eventHandler = eventHandler;
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

const MapNotification = ({ enabled, onClick }) => {
  const theme = useTheme();
  const control = useMemo(() => new NotificationControl(onClick), [onClick]);

  useEffect(() => {
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    return () => map.removeControl(control);
  }, [onClick]);

  useEffect(() => {
    control.setEnabled(enabled);
  }, [enabled]);

  return null;
};

export default MapNotification;
