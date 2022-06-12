import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';

const sourceCustom = (url) => ({
  type: 'raster',
  tiles: [url],
  tileSize: 256,
});

export default () => {
  const t = useTranslation();

  const customMapOverlay = useSelector((state) => state.session.server?.overlayUrl);

  return [
    {
      id: 'openSeaMap',
      title: t('mapOpenSeaMap'),
      source: sourceCustom('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'),
      available: true,
    },
    {
      id: 'custom',
      title: t('mapOverlayCustom'),
      source: sourceCustom(customMapOverlay),
      available: !!customMapOverlay,
    },
  ];
};
