import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import maplibregl from 'maplibre-gl';
import { Provider, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { map } from './Map';
import store from '../store';
import StatusView from './StatusView';
import theme from '../theme';

let popup;

const SelectedDeviceMap = () => {
  const history = useHistory();

  const mapCenter = useSelector((state) => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return { deviceId: state.devices.selectedId, position: [position.longitude, position.latitude] };
      }
    }
    return null;
  });

  const showStatus = (deviceId, coordinates) => {
    const placeholder = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StatusView
            deviceId={deviceId}
            onShowDetails={(positionId) => history.push(`/position/${positionId}`)}
            onShowHistory={() => history.push('/replay')}
            onEditClick={(deviceId) => history.push(`/device/${deviceId}`)}
          />
        </ThemeProvider>
      </Provider>,
      placeholder,
    );

    if (popup) {
      popup.remove();
    }
    popup = new maplibregl.Popup({
      offset: 25,
      anchor: 'top',
      closeOnClick: true,
    });

    popup.setDOMContent(placeholder).setLngLat(coordinates).addTo(map);
  };

  useEffect(() => {
    if (mapCenter) {
      map.easeTo({ center: mapCenter.position });
      showStatus(mapCenter.deviceId, mapCenter.position);
    }
  }, [mapCenter]);

  return null;
};

export default SelectedDeviceMap;
