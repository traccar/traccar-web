import { useState } from 'react';
import MapCamera from '../map/MapCamera';
import PointsList from './PointsList';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAsyncTask } from '../reactHelper';
import MapListLayout from '../common/components/MapListLayout';
import fetchOrThrow from '../common/util/fetchOrThrow';

const PointsPage = () => {
  const t = useTranslation();

  const [items, setItems] = useState([]);
  const [selectedPointId, setSelectedPointId] = useState();
  const selectedPoint = items.find((item) => item.id === selectedPointId);

  useAsyncTask(async ({ signal }) => {
    const response = await fetchOrThrow('api/points', { signal });
    setItems(await response.json());
  }, []);

  return (
    <MapListLayout
      title={t('sharedPoints')}
      list={<PointsList items={items} onPointSelected={setSelectedPointId} />}
    >
      {selectedPoint && (
        <MapCamera latitude={selectedPoint.latitude} longitude={selectedPoint.longitude} />
      )}
    </MapListLayout>
  );
};

export default PointsPage;
