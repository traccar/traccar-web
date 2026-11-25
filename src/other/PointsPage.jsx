import { useReducer, useState } from 'react';
import MapCamera from '../map/MapCamera';
import PoiMap from '../map/main/PoiMap';
import MapPointCreate from '../map/draw/MapPointCreate';
import PointsList from './PointsList';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAsyncTask } from '../reactHelper';
import MapListLayout from '../common/components/MapListLayout';
import { useRestriction } from '../common/util/permissions';
import fetchOrThrow from '../common/util/fetchOrThrow';

const PointsPage = () => {
  const t = useTranslation();
  const readonly = useRestriction('readonly');

  const [reloadKey, reload] = useReducer((key) => key + 1, 0);
  const [items, setItems] = useState([]);
  const [selectedPointId, setSelectedPointId] = useState();
  const selectedPoint = items.find((item) => item.id === selectedPointId);

  useAsyncTask(
    async ({ signal }) => {
      void reloadKey;
      const response = await fetchOrThrow('api/points', { signal });
      setItems(await response.json());
    },
    [reloadKey],
  );

  return (
    <MapListLayout
      title={t('sharedPoints')}
      list={<PointsList items={items} onPointSelected={setSelectedPointId} onReload={reload} />}
    >
      <PoiMap key={reloadKey} />
      {!readonly && <MapPointCreate />}
      {selectedPoint && (
        <MapCamera latitude={selectedPoint.latitude} longitude={selectedPoint.longitude} />
      )}
    </MapListLayout>
  );
};

export default PointsPage;
