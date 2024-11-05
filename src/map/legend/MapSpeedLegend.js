import { interpolateTurbo } from '../../common/util/colors';
import { speedFromKnots, speedUnitString } from '../../common/util/converter';

export class LegendControl {
  constructor(positions, speedUnit, t) {
    this.positions = positions;
    this.t = t;
    this.speedUnit = speedUnit;
    this.maxSpeed = positions.map((p) => p.speed).reduce((a, b) => Math.max(a, b), -Infinity);
    this.minSpeed = positions.map((p) => p.speed).reduce((a, b) => Math.min(a, b), Infinity);
  }

  onAdd(map) {
    this.map = map;
    this.controlContainer = document.createElement('div');
    this.controlContainer.className = 'maplibregl-ctrl maplibregl-ctrl-scale';

    if (this.positions.length && this.maxSpeed) {
      this.controlContainer.appendChild(this.createSpeedLegend());
    }

    return this.controlContainer;
  }

  onRemove() {
    if (this.controlContainer && this.controlContainer.parentNode) {
      this.controlContainer.parentNode.removeChild(this.controlContainer);
      this.map = undefined;
    }
  }

  createSpeedLegend() {
    const gradientStops = Array.from({ length: 10 }, (_, i) => {
      const t = i / 9;
      const [r, g, b] = interpolateTurbo(t);
      return `rgb(${r}, ${g}, ${b})`;
    }).join(', ');

    const legend = document.createElement('div');

    const colorBar = document.createElement('div');
    colorBar.style.background = `linear-gradient(to right, ${gradientStops})`;
    colorBar.style.height = '10px';

    const speedLabel = document.createElement('span');
    speedLabel.textContent = `${Math.round(speedFromKnots(this.minSpeed, this.speedUnit))} - ${
      Math.round(speedFromKnots(this.maxSpeed, this.speedUnit))} ${speedUnitString(this.speedUnit, this.t)}`;

    legend.appendChild(colorBar);
    legend.appendChild(speedLabel);

    return legend;
  }
}

export default LegendControl;
