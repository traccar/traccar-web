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

export default () => {
  const t = useTranslation();

  const mapTilerKey = useAttributePreference('mapTilerKey');
  const locationIqKey = useAttributePreference('locationIqKey');
  const bingMapsKey = useAttributePreference('bingMapsKey');
  const tomTomKey = useAttributePreference('tomTomKey');
  const hereKey = useAttributePreference('hereKey');
  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const customMapUrl = useSelector((state) => state.session.server?.mapUrl);
  const disabledStyles = new Set((useSelector((state) => state.session.server.attributes?.disableMapLayers) || '').split(',') || []);
  const activeStyles = [];

  const Styles = {
    locationIqStreets: {
      id: 'locationIqStreets',
      title: t('mapLocationIqStreets'),
      style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${locationIqKey || 'pk.0f147952a41c555a5b70614039fd148b'}`,
      available: true,
    },
    locationIqEarth: {
      id: 'locationIqEarth',
      title: t('mapLocationIqEarth'),
      style: `https://tiles.locationiq.com/v3/earth/vector.json?key=${locationIqKey}`,
      available: !!locationIqKey,
      attribute: 'locationIqKey',
    },
    locationIqHybrid: {
      id: 'locationIqHybrid',
      title: t('mapLocationIqHybrid'),
      style: `https://tiles.locationiq.com/v3/hybrid/vector.json?key=${locationIqKey}`,
      available: !!locationIqKey,
      attribute: 'locationIqKey',
    },
    osm: {
      id: 'osm',
      title: t('mapOsm'),
      style: styleCustom(
        ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ),
      available: true,
    },
    carto: {
      id: 'carto',
      title: t('mapCarto'),
      style: styleCustom(
        ['a', 'b', 'c', 'd'].map((i) => `https://${i}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png`),
        '© <a target="_top" rel="noopener" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a target="_top" rel="noopener" href="https://carto.com/attribution">CARTO</a>',
      ),
      available: true,
    },
    mapTilerBasic: {
      id: 'mapTilerBasic',
      title: t('mapMapTilerBasic'),
      style: `https://api.maptiler.com/maps/basic/style.json?key=${mapTilerKey}`,
      available: !!mapTilerKey,
      attribute: 'mapTilerKey',
    },
    mapTilerHybrid: {
      id: 'mapTilerHybrid',
      title: t('mapMapTilerHybrid'),
      style: `https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`,
      available: !!mapTilerKey,
      attribute: 'mapTilerKey',
    },
    bingRoad: {
      id: 'bingRoad',
      title: t('mapBingRoad'),
      style: styleCustom(
        [0, 1, 2, 3].map((i) => `http://ak.dynamic.t${i}.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=G,L&shading=hill&og=1885&n=z`),
      ),
      available: !!bingMapsKey,
      attribute: 'bingMapsKey',
    },
    bingAerial: {
      id: 'bingAerial',
      title: t('mapBingAerial'),
      style: styleCustom(
        [0, 1, 2, 3].map((i) => `http://ecn.t${i}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=12327`),
      ),
      available: !!bingMapsKey,
      attribute: 'bingMapsKey',
    },
    bingHybrid: {
      id: 'bingHybrid',
      title: t('mapBingHybrid'),
      style: styleCustom(
        [0, 1, 2, 3].map((i) => `http://ak.dynamic.t${i}.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=A,G,L&og=1885&n=z`),
      ),
      available: !!bingMapsKey,
      attribute: 'bingMapsKey',
    },
    tomTomBasic: {
      id: 'tomTomBasic',
      title: t('mapTomTomBasic'),
      style: `https://api.tomtom.com/map/1/style/20.0.0-8/basic_main.json?key=${tomTomKey}`,
      available: !!tomTomKey,
      attribute: 'tomTomKey',
    },
    hereBasic: {
      id: 'hereBasic',
      title: t('mapHereBasic'),
      style: `https://assets.vector.hereapi.com/styles/berlin/base/mapbox/tilezen?apikey=${hereKey}`,
      available: !!hereKey,
      attribute: 'hereKey',
    },
    hereHybrid: {
      id: 'hereHybrid',
      title: t('mapHereHybrid'),
      style: styleCustom(
        [1, 2, 3, 4].map((i) => `https://${i}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/hybrid.day/{z}/{x}/{y}/256/png8?apiKey=${hereKey}`),
      ),
      available: !!hereKey,
      attribute: 'hereKey',
    },
    hereSatellite: {
      id: 'hereSatellite',
      title: t('mapHereSatellite'),
      style: styleCustom(
        [1, 2, 3, 4].map((i) => `https://${i}.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?apiKey=${hereKey}`),
      ),
      available: !!hereKey,
      attribute: 'hereKey',
    },
    autoNavi: {
      id: 'autoNavi',
      title: t('mapAutoNavi'),
      style: styleCustom(
        [1, 2, 3, 4].map((i) => `https://webrd0${i}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`),
      ),
      available: true,
    },
    mapboxStreets: {
      id: 'mapboxStreets',
      title: t('mapMapboxStreets'),
      style: styleCustom(
        [`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
      ),
      available: !!mapboxAccessToken,
      attribute: 'mapboxAccessToken',
    },
    mapboxOutdoors: {
      id: 'mapboxOutdoors',
      title: t('mapMapboxOutdoors'),
      style: styleCustom(
        [`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
      ),
      available: !!mapboxAccessToken,
      attribute: 'mapboxAccessToken',
    },
    mapboxSatellite: {
      id: 'mapboxSatellite',
      title: t('mapMapboxSatellite'),
      style: styleCustom(
        [`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
      ),
      available: !!mapboxAccessToken,
      attribute: 'mapboxAccessToken',
    },
    custom: {
      id: 'custom',
      title: t('mapCustom'),
      style: styleCustom([customMapUrl]),
      available: !!customMapUrl,
    },
  };

  Object.keys(Styles).forEach((key) => {
    if (!disabledStyles.has(key)) {
      activeStyles.push(Styles[key]);
    }
  });
  return activeStyles;
};
