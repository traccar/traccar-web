import './legend.css';
import { formatSpeed } from '../../common/util/formatter';
import { interpolateTurbo } from '../../common/util/colors';

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
    // Create the control container
    this.controlContainer = document.createElement('div');
    this.controlContainer.className = 'maplibregl-ctrl';

    if (this.positions.length && this.maxSpeed) {
      this.controlContainer.appendChild(this.createSpeedLegend(this.minSpeed, this.maxSpeed, this.t));
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
    colorBar.classList.add('legend-color-bar');
    colorBar.style.background = `linear-gradient(to right, ${gradientStops})`;

    const speedLabels = document.createElement('div');
    speedLabels.classList.add('legend-speed-labels');

    const minSpeedLabel = document.createElement('span');
    minSpeedLabel.classList.add('legend-speed-label');
    minSpeedLabel.textContent = `${formatSpeed(this.minSpeed, this.speedUnit, this.t)}`;

    const middleSpeedLabel = document.createElement('span');
    middleSpeedLabel.classList.add('legend-speed-label');
    middleSpeedLabel.textContent = `${formatSpeed(this.maxSpeed / 2, this.speedUnit, this.t)}`;

    const maxSpeedLabel = document.createElement('span');
    maxSpeedLabel.classList.add('legend-speed-label');
    maxSpeedLabel.textContent = `${formatSpeed(this.maxSpeed, this.speedUnit, this.t)}`;

    speedLabels.appendChild(minSpeedLabel);
    speedLabels.appendChild(middleSpeedLabel);
    speedLabels.appendChild(maxSpeedLabel);

    legend.appendChild(colorBar);
    legend.appendChild(speedLabels);

    return legend;
  }
}

export default LegendControl;
