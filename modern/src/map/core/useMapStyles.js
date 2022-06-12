import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';

const styleCustom = (url, attribution) => ({
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [url],
      attribution,
      tileSize: 256,
    },
  },
  glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
  layers: [{
    id: 'osm',
    type: 'raster',
    source: 'osm',
  }],
});

const styleOsm = () => styleCustom(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
);

const styleCarto = () => ({
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a target="_top" rel="noopener" href="https://carto.com/attribution">CARTO</a>',
    },
  },
  glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
});

const styleMapbox = (style) => `mapbox://styles/mapbox/${style}`;

const styleMapTiler = (style, key) => `https://api.maptiler.com/maps/${style}/style.json?key=${key}`;

const styleLocationIq = (style, key) => `https://tiles.locationiq.com/v3/${style}/vector.json?key=${key}`;

export default () => {
  const t = useTranslation();

  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const mapTilerKey = useAttributePreference('mapTilerKey');
  const locationIqKey = useAttributePreference('locationIqKey');
  const customMapUrl = useSelector((state) => state.session.server?.mapUrl);

  return [
    {
      id: 'locationIqStreets',
      title: t('mapLocationIqStreets'),
      uri: styleLocationIq('streets', locationIqKey || 'pk.0f147952a41c555a5b70614039fd148b'),
      available: true,
    },
    {
      id: 'locationIqEarth',
      title: t('mapLocationIqEarth'),
      uri: styleLocationIq('earth', locationIqKey),
      available: !!locationIqKey,
      attribute: 'locationIqKey',
    },
    {
      id: 'locationIqHybrid',
      title: t('mapLocationIqHybrid'),
      uri: styleLocationIq('hybrid', locationIqKey),
      available: !!locationIqKey,
      attribute: 'locationIqKey',
    },
    {
      id: 'osm',
      title: t('mapOsm'),
      uri: styleOsm(),
      available: true,
    },
    {
      id: 'carto',
      title: t('mapCarto'),
      uri: styleCarto(),
      available: true,
    },
    {
      id: 'mapboxStreets',
      title: t('mapMapboxStreets'),
      uri: styleMapbox('streets-v11'),
      available: !!mapboxAccessToken,
      attribute: 'mapboxAccessToken',
    },
    {
      id: 'mapboxOutdoors',
      title: t('mapMapboxOutdoors'),
      uri: styleMapbox('outdoors-v11'),
      available: !!mapboxAccessToken,
      attribute: 'mapboxAccessToken',
    },
    {
      id: 'mapboxSatellite',
      title: t('mapMapboxSatellite'),
      uri: styleMapbox('satellite-v9'),
      available: !!mapboxAccessToken,
      attribute: 'mapboxAccessToken',
    },
    {
      id: 'mapTilerBasic',
      title: t('mapMapTilerBasic'),
      uri: styleMapTiler('basic', mapTilerKey),
      available: !!mapTilerKey,
      attribute: 'mapTilerKey',
    },
    {
      id: 'mapTilerHybrid',
      title: t('mapMapTilerHybrid'),
      uri: styleMapTiler('hybrid', mapTilerKey),
      available: !!mapTilerKey,
      attribute: 'mapTilerKey',
    },
    {
      id: 'custom',
      title: t('mapCustom'),
      uri: styleCustom(customMapUrl),
      available: !!customMapUrl,
    },
  ];
};
