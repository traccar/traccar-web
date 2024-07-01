import { decomposeColor } from '@mui/material';

export const interpolateColor = (color1, color2, factor) => {
  if (factor > 1) factor = 1;
  if (factor < 0) factor = 0;

  const c1 = decomposeColor(color1).values;
  const c2 = decomposeColor(color2).values;

  const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
  const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
  const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));

  return `rgb(${r}, ${g}, ${b})`;
};

export const getSpeedColor = (color1, color2, color3, speed, max) => {
  const factor = speed / max;
  if (factor <= 0.5) {
    return interpolateColor(color1, color2, factor * 2);
  }
  return interpolateColor(color2, color3, (factor - 0.5) * 2);
};
