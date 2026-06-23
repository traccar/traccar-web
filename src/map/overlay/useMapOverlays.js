import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';

const sourceCustom = (urls, maxZoom) => {
  const source = {
    type: 'raster',
    tiles: urls,
    tileSize: 256,
    maxzoom: maxZoom,
  };
  Object.keys(source).forEach((key) => source[key] === undefined && delete source[key]);
  return source;
};

const sourceOpenWeather = (style, key) =>
  sourceCustom([`https://tile.openweathermap.org/map/${style}/{z}/{x}/{y}.png?appid=${key}`], 18);

export default () => {
  const t = useTranslation();

  const googleKey = useAttributePreference('googleKey');
  const openWeatherKey = useAttributePreference('openWeatherKey');
  const tomTomKey = useAttributePreference('tomTomKey');
  const hereKey = useAttributePreference('hereKey');
  const customMapOverlay = useSelector((state) => state.session.server.overlayUrl);

  return useMemo(
    () => [
      {
        id: 'googleTraffic',
        title: t('mapGoogleTraffic'),
        source: sourceCustom(
          [`google://satellite/{z}/{x}/{y}?key=${googleKey}&layerType=layerTraffic&overlay=true`],
          20,
        ),
        available: Boolean(googleKey),
        attribute: 'googleKey',
      },
      {
        id: 'openSeaMap',
        title: t('mapOpenSeaMap'),
        source: sourceCustom(['https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'], 18),
        available: true,
      },
      {
        id: 'openRailwayMap',
        title: t('mapOpenRailwayMap'),
        source: sourceCustom(['https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png'], 19),
        available: true,
      },
      {
        id: 'openWeatherClouds',
        title: t('mapOpenWeatherClouds'),
        source: sourceOpenWeather('clouds_new', openWeatherKey),
        available: Boolean(openWeatherKey),
        attribute: 'openWeatherKey',
      },
      {
        id: 'openWeatherPrecipitation',
        title: t('mapOpenWeatherPrecipitation'),
        source: sourceOpenWeather('precipitation_new', openWeatherKey),
        available: Boolean(openWeatherKey),
        attribute: 'openWeatherKey',
      },
      {
        id: 'openWeatherPressure',
        title: t('mapOpenWeatherPressure'),
        source: sourceOpenWeather('pressure_new', openWeatherKey),
        available: Boolean(openWeatherKey),
        attribute: 'openWeatherKey',
      },
      {
        id: 'openWeatherWind',
        title: t('mapOpenWeatherWind'),
        source: sourceOpenWeather('wind_new', openWeatherKey),
        available: Boolean(openWeatherKey),
        attribute: 'openWeatherKey',
      },
      {
        id: 'openWeatherTemperature',
        title: t('mapOpenWeatherTemperature'),
        source: sourceOpenWeather('temp_new', openWeatherKey),
        available: Boolean(openWeatherKey),
        attribute: 'openWeatherKey',
      },
      {
        id: 'tomTomFlow',
        title: t('mapTomTomFlow'),
        source: sourceCustom(
          [
            `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=${tomTomKey}`,
          ],
          22,
        ),
        available: Boolean(tomTomKey),
        attribute: 'tomTomKey',
      },
      {
        id: 'tomTomIncidents',
        title: t('mapTomTomIncidents'),
        source: sourceCustom(
          [
            `https://api.tomtom.com/traffic/map/4/tile/incidents/s3/{z}/{x}/{y}.png?key=${tomTomKey}`,
          ],
          22,
        ),
        available: Boolean(tomTomKey),
        attribute: 'tomTomKey',
      },
      {
        id: 'hereFlow',
        title: t('mapHereFlow'),
        source: sourceCustom(
          [1, 2, 3, 4].map(
            (i) =>
              `https://${i}.traffic.maps.ls.hereapi.com/maptile/2.1/flowtile/newest/normal.day/{z}/{x}/{y}/256/png8?apiKey=${hereKey}`,
          ),
          20,
        ),
        available: Boolean(hereKey),
        attribute: 'hereKey',
      },
      {
        id: 'custom',
        title: t('mapOverlayCustom'),
        source: sourceCustom([customMapOverlay]),
        available: Boolean(customMapOverlay),
      },
    ],
    [t, googleKey, openWeatherKey, tomTomKey, hereKey, customMapOverlay],
  );
};
