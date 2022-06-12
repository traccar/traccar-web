import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAttributePreference } from '../../common/util/preferences';

const sourceCustom = (urls) => ({
  type: 'raster',
  tiles: urls,
  tileSize: 256,
});

export default () => {
  const t = useTranslation();

  const openWeatherKey = useAttributePreference('openWeatherKey');
  const customMapOverlay = useSelector((state) => state.session.server?.overlayUrl);

  return [
    {
      id: 'openSeaMap',
      title: t('mapOpenSeaMap'),
      source: sourceCustom(['http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png']),
      available: true,
    },
    {
      id: 'openWeatherClouds',
      title: t('mapOpenWeatherClouds'),
      source: sourceCustom([`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${openWeatherKey}`]),
      available: !!openWeatherKey,
      attribute: 'openWeatherKey',
    },
    {
      id: 'openWeatherPrecipitation',
      title: t('mapOpenWeatherPrecipitation'),
      source: sourceCustom([`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${openWeatherKey}`]),
      available: !!openWeatherKey,
      attribute: 'openWeatherKey',
    },
    {
      id: 'openWeatherPressure',
      title: t('mapOpenWeatherPressure'),
      source: sourceCustom([`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${openWeatherKey}`]),
      available: !!openWeatherKey,
      attribute: 'openWeatherKey',
    },
    {
      id: 'openWeatherWind',
      title: t('mapOpenWeatherWind'),
      source: sourceCustom([`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${openWeatherKey}`]),
      available: !!openWeatherKey,
      attribute: 'openWeatherKey',
    },
    {
      id: 'openWeatherTemperature',
      title: t('mapOpenWeatherTemperature'),
      source: sourceCustom([`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${openWeatherKey}`]),
      available: !!openWeatherKey,
      attribute: 'openWeatherKey',
    },
    {
      id: 'custom',
      title: t('mapOverlayCustom'),
      source: sourceCustom(customMapOverlay),
      available: !!customMapOverlay,
    },
  ];
};
