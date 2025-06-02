import { sessionActions } from './session';
import { devicesActions } from './devices';

const threshold = 5;
const interval = 1500;

// eslint-disable-next-line no-undef
const debugMode = process.env.NODE_ENV === 'development';
const debugLog = (message) => {
  if (debugMode) console.log(message);
}

export default () => (next) => {
  const buffer = [];
  let throttled = false;
  let counter = 0;

  setInterval(() => {
    if (throttled) {
      const flushed = buffer.splice(0, buffer.length);
      flushed.forEach(next);
      debugLog(`Throttle flushed ${flushed.length}`);
      throttled = flushed.length >= threshold;
      if (!throttled) debugLog(`Throttle stopped`);
    }
    counter = 0;
  }, interval);

  return (action) => {
    if (action.type !== devicesActions.update.type && action.type !== sessionActions.updatePositions.type) {
      return next(action);
    }
    if (throttled) {
      buffer.push(action);
      return;
    }
    counter += 1;
    if (counter >= threshold) {
      if (!throttled) debugLog(`Throttle started`);
      throttled = true;
    }
    return next(action);
  };
};
