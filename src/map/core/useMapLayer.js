import { useId, useEffect } from 'react';
import { map } from './MapView';

const emptyFeatureCollection = { type: 'FeatureCollection', features: [] };

const useMapLayer = ({ source, layers, layersDeps, data, dataDeps = [] }) => {
  const id = useId();

  useEffect(() => {
    const isGeoJson = !source?.type || source.type === 'geojson';
    map.addSource(
      id,
      isGeoJson ? { type: 'geojson', data: data ?? emptyFeatureCollection, ...source } : source,
    );
    layers.forEach((layer) => {
      const { on, key, ...spec } = layer;
      const layerId = key ? `${id}-${key}` : id;
      map.addLayer({ ...spec, id: layerId, source: id });
      if (on) {
        Object.entries(on).forEach(([type, listener]) => map.on(type, layerId, listener));
      }
    });
    return () => {
      layers.forEach((layer) => {
        const { on, key } = layer;
        const layerId = key ? `${id}-${key}` : id;
        if (on) {
          Object.entries(on).forEach(([type, listener]) => map.off(type, layerId, listener));
        }
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [id, ...layersDeps]);

  useEffect(() => {
    if (data !== undefined) {
      map.getSource(id)?.setData(data ?? emptyFeatureCollection);
    }
    // eslint-disable-next-line @eslint-react/exhaustive-deps
  }, [id, ...dataDeps]);

  return id;
};

export default useMapLayer;
