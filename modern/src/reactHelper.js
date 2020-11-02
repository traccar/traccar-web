
import { useRef, useEffect } from 'react';

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useEffectAsync = (effect, deps) => {
  useEffect(() => {
    effect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};
