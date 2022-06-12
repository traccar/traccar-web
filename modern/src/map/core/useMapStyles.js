import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';

const styleCustom = (urls, attribution) => ({
  version: 8,
  sources: {
    custom: {
      type: 'raster',
      tiles: urls,
      attribution,
      tileSize: 256,
    },
  },
  glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
  layers: [{
    id: 'custom',
    type: 'raster',
    source: 'custom',
  }],
});

const styleOsm = () => styleCustom(
  [
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  ],
  '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
);

const styleCarto = () => styleCustom(
  [
    'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
    'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
    'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
    'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
  ],
  '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a target="_top" rel="noopener" href="https://carto.com/attribution">CARTO</a>',
);

const styleBingMaps = (url) => styleCustom(
  [
    url.replace('{subdomain}', 't0'),
    url.replace('{subdomain}', 't1'),
    url.replace('{subdomain}', 't2'),
    url.replace('{subdomain}', 't3'),
  ],
  '© Microsoft Corporation',
);

const styleMapbox = (style) => `mapbox://styles/mapbox/${style}`;

const styleMapTiler = (style, key) => `https://api.maptiler.com/maps/${style}/style.json?key=${key}`;

const styleLocationIq = (style, key) => `https://tiles.locationiq.com/v3/${style}/vector.json?key=${key}`;

export default () => {
  const t = useTranslation();

  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const mapTilerKey = useAttributePreference('mapTilerKey');
  const locationIqKey = useAttributePreference('locationIqKey');
  const bingMapsKey = useAttributePreference('bingMapsKey');
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
      id: 'bingRoad',
      title: t('mapBingRoad'),
      uri: styleBingMaps('http://ak.dynamic.{subdomain}.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=G,L&shading=hill&og=1885&n=z'),
      available: !!bingMapsKey,
      attribute: 'bingMapsKey',
    },
    {
      id: 'bingAerial',
      title: t('mapBingAerial'),
      uri: styleBingMaps('http://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=12327'),
      available: !!bingMapsKey,
      attribute: 'bingMapsKey',
    },
    {
      id: 'bingHybrid',
      title: t('mapBingHybrid'),
      uri: styleBingMaps('http://ak.dynamic.{subdomain}.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=A,G,L&og=1885&n=z'),
      available: !!bingMapsKey,
      attribute: 'bingMapsKey',
    },
    {
      id: 'custom',
      title: t('mapCustom'),
      uri: styleCustom(customMapUrl),
      available: !!customMapUrl,
    },
  ];
};
