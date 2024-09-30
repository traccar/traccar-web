// Turbo Colormap
const turboPolynomials = {
  r: [0.13572138, 4.61539260, -42.66032258, 132.13108234, -152.94239396, 59.28637943],
  g: [0.09140261, 2.19418839, 4.84296658, -14.18503333, 4.27729857, 2.82956604],
  b: [0.10667330, 12.64194608, -60.58204836, 110.36276771, -89.90310912, 27.34824973]
};

function interpolateChannel(t, coeffs) {
  let result = 0;
  let tPower = 1;
  for (let i = 0; i < coeffs.length; i++) {
    result += coeffs[i] * tPower;
    tPower *= t;
  }
  return Math.max(0, Math.min(1, result));
}

function interpolateTurbo(t) {
  t = Math.max(0, Math.min(1, t));
  return [
    Math.round(255 * interpolateChannel(t, turboPolynomials.r)),
    Math.round(255 * interpolateChannel(t, turboPolynomials.g)),
    Math.round(255 * interpolateChannel(t, turboPolynomials.b))
  ];
}

export function getSpeedColor(speed, max) {
  const factor = Math.max(0, Math.min(1, speed / max));
  const [r, g, b] = interpolateTurbo(factor);
  return `rgb(${r}, ${g}, ${b})`;
}
