import { sessionActions } from './session';
import { devicesActions } from './devices';

const threshold = 3; // per second
const minInterval = 1500;
const maxInterval = 30000;
const scaleFactor = 1000;

// eslint-disable-next-line no-undef
const debugMode = process.env.NODE_ENV === 'development';
const debugLog = (message) => debugMode && console.log(message);

export default () => (next) => {
  const buffer = [];
  let throttled = false;
  let counter = 0;
  let currentInterval = minInterval;

  const tick = () => {
    if (throttled) {
      const start = performance.now();

      const flushed = buffer.splice(0, buffer.length);

      const deviceUpdates = {};
      const positionUpdates = {};

      flushed.forEach((action) => {
        if (action.type === devicesActions.update.type) {
          action.payload.forEach(item => deviceUpdates[item.id] = item);
        } else if (action.type === sessionActions.updatePositions.type) {
          action.payload.forEach(item => positionUpdates[item.deviceId] = item);
        }
      });

      const mergedDeviceUpdates = Object.values(deviceUpdates);
      if (mergedDeviceUpdates.length) {
        next({ type: devicesActions.update.type, payload: mergedDeviceUpdates });
      }

      const mergedPositionUpdates = Object.values(positionUpdates);
      if (mergedPositionUpdates.length) {
        next({ type: sessionActions.updatePositions.type, payload: mergedPositionUpdates });
      }

      const totalTime = performance.now() - start;
      debugLog(`Flushed ${mergedDeviceUpdates.length + mergedPositionUpdates.length} / ${flushed.length} events in ${totalTime.toFixed(2)} ms`);
      currentInterval = Math.min(Math.max(totalTime * scaleFactor, minInterval), maxInterval);
    }

    const shouldThrottle = (counter * 1000 / currentInterval) > threshold;
    if (throttled != shouldThrottle) {
      debugLog(`Throttling ${shouldThrottle}`);
      throttled = shouldThrottle;
    }
    counter = 0;
    if (!throttled) currentInterval = minInterval;
    setTimeout(tick, currentInterval);
  };

  setTimeout(tick, currentInterval);

  return (action) => {
    if (action.type !== devicesActions.update.type && action.type !== sessionActions.updatePositions.type) {
      return next(action);
    }

    counter += 1;

    if (throttled) {
      buffer.push(action);
      return;
    }

    if ((counter * 1000 / currentInterval) > threshold) {
      if (!throttled) debugLog(`Throttling started`);
      throttled = true;
    }

    return next(action);
  };
};
