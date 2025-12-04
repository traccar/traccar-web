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
    glyphs: 'https://cdn.traccar.com/map/fonts/{fontstack}/{range}.pbf',
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
      id: 'openFreeMap',
      title: t('mapOpenFreeMap'),
      style: 'https://tiles.openfreemap.org/styles/liberty',
      available: true,
    },
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
    },
    {
      id: 'osm',
      title: t('mapOsm'),
      style: styleCustom({
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        maxZoom: 19,
        attribution: '© <a target="_top" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
      available: true,
    },
    {
      id: 'openTopoMap',
      title: t('mapOpenTopoMap'),
      style: styleCustom({
        tiles: ['a', 'b', 'c'].map((i) => `https://${i}.tile.opentopomap.org/{z}/{x}/{y}.png`),
        maxZoom: 17,
      }),
      available: true,
    },
    {
      id: 'carto',
      title: t('mapCarto'),
      style: styleCustom({
        tiles: ['a', 'b', 'c', 'd'].map((i) => `https://${i}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png`),
        maxZoom: 22,
        attribution: '© <a target="_top" rel="noopener" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a target="_top" rel="noopener" href="https://carto.com/attribution">CARTO</a>',
      }),
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
    {
      id: 'mapTilerBasic',
      title: t('mapMapTilerBasic'),
      style: `https://api.maptiler.com/maps/basic/style.json?key=${mapTilerKey}`,
      available: Boolean(mapTilerKey),
      attribute: 'mapTilerKey',
    },
    {
      id: 'mapTilerHybrid',
      title: t('mapMapTilerHybrid'),
      style: `https://api.maptiler.com/maps/hybrid/style.json?key=${mapTilerKey}`,
      available: Boolean(mapTilerKey),
      attribute: 'mapTilerKey',
    },
    {
      id: 'bingRoad',
      title: t('mapBingRoad'),
      style: styleCustom({
        tiles: [0, 1, 2, 3].map((i) => `https://t${i}.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=G,L&shading=hill&og=1885&n=z`),
        maxZoom: 21,
      }),
      available: Boolean(bingMapsKey),
      attribute: 'bingMapsKey',
    },
    {
      id: 'bingAerial',
      title: t('mapBingAerial'),
      style: styleCustom({
        tiles: [0, 1, 2, 3].map((i) => `https://ecn.t${i}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=12327`),
        maxZoom: 19,
      }),
      available: Boolean(bingMapsKey),
      attribute: 'bingMapsKey',
    },
    {
      id: 'bingHybrid',
      title: t('mapBingHybrid'),
      style: styleCustom({
        tiles: [0, 1, 2, 3].map((i) => `https://t${i}.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=A,G,L&og=1885&n=z`),
        maxZoom: 19,
      }),
      available: Boolean(bingMapsKey),
      attribute: 'bingMapsKey',
    },
    {
      id: 'tomTomBasic',
      title: t('mapTomTomBasic'),
      style: `https://api.tomtom.com/map/1/style/20.0.0-8/basic_main.json?key=${tomTomKey}`,
      available: Boolean(tomTomKey),
      attribute: 'tomTomKey',
    },
    {
      id: 'hereBasic',
      title: t('mapHereBasic'),
      style: styleCustom({
        tiles: [`https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?apiKey=${hereKey}&size=512`],
        maxZoom: 20,
        attribution: '© HERE',
      }),
      available: Boolean(hereKey),
      attribute: 'hereKey',
    },
    {
      id: 'hereHybrid',
      title: t('mapHereHybrid'),
      style: styleCustom({
        tiles: [`https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/jpeg?style=explore.satellite.day&apiKey=${hereKey}&size=512`],
        maxZoom: 20,
        attribution: '© HERE',
      }),
      available: Boolean(hereKey),
      attribute: 'hereKey',
    },
    {
      id: 'hereSatellite',
      title: t('mapHereSatellite'),
      style: styleCustom({
        tiles: [`https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/jpeg?style=satellite.day&apiKey=${hereKey}&size=512`],
        maxZoom: 20,
        attribution: '© HERE',
      }),
      available: Boolean(hereKey),
      attribute: 'hereKey',
    },
    {
      id: 'yandexMap',
      title: t('mapYandexMap'),
      style: styleCustom({
        tiles: ['https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&projection=web_mercator'],
        maxZoom: 19,
      }),
      available: true,
    },
    {
      id: 'autoNavi',
      title: t('mapAutoNavi'),
      style: styleCustom({
        tiles: [1, 2, 3, 4].map((i) => `https://webrd0${i}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`),
        minZoom: 3,
        maxZoom: 18,
      }),
      available: true,
    },
    {
      id: 'ordnanceSurvey',
      title: t('mapOrdnanceSurvey'),
      style: 'https://api.os.uk/maps/vector/v1/vts/resources/styles?key=EAZ8p83u72FTGiLjLC2MsTAl1ko6XQHC',
      transformRequest: (url) => ({
        url: `${url}&srs=3857`,
      }),
      available: true,
    },
    {
      id: 'mapboxStreets',
      title: t('mapMapboxStreets'),
      style: styleCustom({
        tiles: [`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
        maxZoom: 22,
      }),
      available: Boolean(mapboxAccessToken),
      attribute: 'mapboxAccessToken',
    },
    {
      id: 'mapboxStreetsDark',
      title: t('mapMapboxStreetsDark'),
      style: styleCustom({
        tiles: [`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
        maxZoom: 22,
      }),
      available: Boolean(mapboxAccessToken),
      attribute: 'mapboxAccessToken',
    },
    {
      id: 'mapboxOutdoors',
      title: t('mapMapboxOutdoors'),
      style: styleCustom({
        tiles: [`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
        maxZoom: 22,
      }),
      available: Boolean(mapboxAccessToken),
      attribute: 'mapboxAccessToken',
    },
    {
      id: 'mapboxSatelliteStreet',
      title: t('mapMapboxSatellite'),
      style: styleCustom({
        tiles: [`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`],
        maxZoom: 22,
      }),
      available: Boolean(mapboxAccessToken),
      attribute: 'mapboxAccessToken',
    },
    {
      id: 'custom',
      title: t('mapCustom'),
      style: !customMapUrl?.includes('{z}') && !customMapUrl?.includes('{quadkey}') ? customMapUrl : styleCustom({
        tiles: [customMapUrl],
      }),
      available: Boolean(customMapUrl),
    },
  ], [t, mapTilerKey, locationIqKey, bingMapsKey, tomTomKey, hereKey, mapboxAccessToken, customMapUrl]);
};
