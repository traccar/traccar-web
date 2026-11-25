import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import MapGeofenceEdit from '../map/draw/MapGeofenceEdit';
import GeofencesList from './GeofencesList';
import { useTranslation } from '../common/components/LocalizationProvider';
import { messagesActions } from '../store';
import MapListLayout from '../common/components/MapListLayout';
import fetchOrThrow from '../common/util/fetchOrThrow';

const GeofencesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const [selectedGeofenceId, setSelectedGeofenceId] = useState();

  const handleFile = (event) => {
    const files = Array.from(event.target.files);
    const [file] = files;
    const reader = new FileReader();
    reader.onload = async () => {
      const xml = new DOMParser().parseFromString(reader.result, 'text/xml');
      const segment = xml.getElementsByTagName('trkseg')[0];
      const coordinates = Array.from(segment.getElementsByTagName('trkpt'))
        .map((point) => `${point.getAttribute('lat')} ${point.getAttribute('lon')}`)
        .join(', ');
      const area = `LINESTRING (${coordinates})`;
      const newItem = { name: t('sharedGeofence'), area };
      try {
        const response = await fetchOrThrow('api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        const item = await response.json();
        navigate(`/settings/geofence/${item.id}`);
      } catch (error) {
        dispatch(messagesActions.push(error.message));
      }
    };
    reader.onerror = (event) => {
      dispatch(messagesActions.push(event.target.error));
    };
    reader.readAsText(file);
  };

  return (
    <MapListLayout
      title={t('sharedGeofences')}
      actions={
        <label htmlFor="upload-gpx">
          <input accept=".gpx" id="upload-gpx" type="file" hidden onChange={handleFile} />
          <IconButton edge="end" component="span" onClick={() => {}}>
            <Tooltip title={t('sharedUpload')}>
              <UploadFileIcon />
            </Tooltip>
          </IconButton>
        </label>
      }
      list={<GeofencesList onGeofenceSelected={setSelectedGeofenceId} />}
    >
      <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
    </MapListLayout>
  );
};

export default GeofencesPage;
