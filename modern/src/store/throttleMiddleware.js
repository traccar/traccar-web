import { batch } from "react-redux";

const threshold = 3;
const interval = 1500;

export default () => (next) => {
  const buffer = [];
  let throttle = false;
  let counter = 0;
  
  setInterval(() => {
    console.log('batch');
    if (throttle) {
      if (buffer.length < threshold) {
        throttle = false;
      }
      batch(() => buffer.splice(0, buffer.length).forEach((action) => next(action)));
    } else {
      if (counter > threshold) {
        throttle = true;
      }
      counter = 0;
    }
  }, interval);

  return (action) => {
    console.log(action);
    if (action.type === 'devices/update' || action.type === 'positions/update') {
      if (throttle) {
        buffer.push(action);
      } else {
        counter += 1;
        return next(action);
      }
    } else {
      return next(action);
    }
  };
};
