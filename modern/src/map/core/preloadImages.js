import palette from '../../common/theme/palette';
import deviceCategories from '../../common/util/deviceCategories';
import { loadImage, prepareIcon } from './mapUtil';

export const mapImages = {};

export default async () => {
  const background = await loadImage('images/background.svg');
  mapImages.background = await prepareIcon(background);
  await Promise.all(deviceCategories.map(async (category) => {
    const results = [];
    ['positive', 'negative', 'neutral'].forEach((color) => {
      results.push(loadImage(`images/icon/${category}.svg`).then((icon) => {
        mapImages[`${category}-${color}`] = prepareIcon(background, icon, palette.colors[color]);
      }));
    });
    await Promise.all(results);
  }));
};
