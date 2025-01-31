import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';

const styleCustom = ({ tiles, minZoom, maxZoom, attribution }) => {
  const source = {
    type: 'raster',
    tiles,
    attribution,
    tileSize: 256,
    minzoom: minZoom,
    maxzoom: maxZoom,
  };
  Object.keys(source).forEach((key) => source[key] === undefined && delete source[key]);
  return {
    version: 8,
    sources: {
      custom: source,
    },
    glyphs: 'https://api.mapbox.com/fonts/v1/mapbox/{fontstack}/{range}.pbf',
    layers: [{
      id: 'custom',
      type: 'raster',
      source: 'custom',
    }],
  };
};

export default () => {
  const t = useTranslation();

  const googleKey = useAttributePreference('googleKey');
  const mapTilerKey = useAttributePreference('mapTilerKey');
  const locationIqKey = useAttributePreference('locationIqKey') || 'pk.0f147952a41c555a5b70614039fd148b';
  const bingMapsKey = useAttributePreference('bingMapsKey');
  const tomTomKey = useAttributePreference('tomTomKey');
  const hereKey = useAttributePreference('hereKey');
  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const customMapUrl = useSelector((state) => state.session.server.mapUrl);

  return useMemo(() => [

    {
      id: 'locationIqStreets',
      title: t('mapLocationIqStreets'),
      style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${locationIqKey}`,
      available: true,
    },
    {
      id: 'locationIqDark',
      title: t('mapLocationIqDark'),
      style: `https://tiles.locationiq.com/v3/dark/vector.json?key=${locationIqKey}`,
      available: true,
    }, {
      id: 'locationIqLight',
      title: t('mapLocationIqLight'),
      style: `https://tiles.locationiq.com/v3/light/vector.json?key=${locationIqKey}`,
      available: true,
    },
    {
      id: 'googleRoad',
      title: t('mapGoogleRoad'),
      style: styleCustom({
        tiles: googleKey
          ? [`google://roadmap/{z}/{x}/{y}?key=${googleKey}`]
          : [0, 1, 2, 3].map((i) => `https://mt${i}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga`),
        maxZoom: 20,
        attribution: '© Google',
      }),
      available: true,
      attribute: 'googleKey',
    },
    {
      id: 'googleSatellite',
      title: t('mapGoogleSatellite'),
      style: styleCustom({
        tiles: googleKey
          ? [`google://satellite/{z}/{x}/{y}?key=${googleKey}`]
          : [0, 1, 2, 3].map((i) => `https://mt${i}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga`),
        maxZoom: 20,
        attribution: '© Google',
      }),
      available: true,
      attribute: 'googleKey',
    },
    {
      id: 'googleHybrid',
      title: t('mapGoogleHybrid'),
      style: styleCustom({
        tiles: googleKey
          ? [`google://satellite/{z}/{x}/{y}?key=${googleKey}&layerType=layerRoadmap`]
          : [0, 1, 2, 3].map((i) => `https://mt${i}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga`),
        maxZoom: 20,
        attribution: '© Google',
      }),
      available: true,
      attribute: 'googleKey',
    },
  ], [t, mapTilerKey, locationIqKey, bingMapsKey, tomTomKey, hereKey, mapboxAccessToken, customMapUrl]);
};
