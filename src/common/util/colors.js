/*
 * Polynomial approximation for the Turbo colormap
 * Original GLSL implementation:
 *   https://gist.github.com/mikhailov-work/0d177465a8151eb6ede1768d51d476c7
 * Original LUT:
 *   https://gist.github.com/mikhailov-work/ee72ba4191942acecc03fe6da94fc73f
 *
 * Adapted to JavaScript by Kalabint
 *
 * Authors:
 *   Colormap Design: Anton Mikhailov (mikhailov@google.com)
 *   GLSL Approximation: Ruofei Du (ruofei@google.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 */

function interpolateTurbo(t) {
  t = Math.max(0, Math.min(1, t)); // Clamp t to [0, 1]
  const r = Math.round(255 * interpolateTurbo_srgb_fn_r(t));
  const g = Math.round(255 * interpolateTurbo_srgb_fn_g(t));
  const b = Math.round(255 * interpolateTurbo_srgb_fn_b(t));
  return [r, g, b];
}

function interpolateTurbo_srgb_fn_r(t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t2 * t2;
  const t5 = t3 * t2;
  return (
    0.13572138 +
    4.61539260 * t -
    42.66032258 * t2 +
    132.13108234 * t3 -
    152.94239396 * t4 +
    59.28637943 * t5
  );
}

function interpolateTurbo_srgb_fn_g(t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t2 * t2;
  const t5 = t3 * t2;
  return (
    0.09140261 +
    2.19418839 * t +
    4.84296658 * t2 -
    14.18503333 * t3 +
    4.27729857 * t4 +
    2.82956604 * t5
  );
}

function interpolateTurbo_srgb_fn_b(t) {
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t2 * t2;
  const t5 = t3 * t2;
  return (
    0.10667330 +
    12.64194608 * t -
    60.58204836 * t2 +
    110.36276771 * t3 -
    89.90310912 * t4 +
    27.34824973 * t5
  );
}

export const getSpeedColor = (speed, max) => {
  let factor = speed / max;
  if (factor > 1) factor = 1;
  if (factor < 0) factor = 0;

  const [r, g, b] = interpolateTurbo(factor);
  return `rgb(${r}, ${g}, ${b})`;
};
