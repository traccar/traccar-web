import { useRef, useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { errorsActions } from './store';

export const pageSize = 50;

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useEffectAsync = (effect, deps) => {
  const dispatch = useDispatch();
  const ref = useRef();
  useEffect(() => {
    effect()
      .then((result) => (ref.current = result))
      .catch((error) => dispatch(errorsActions.push(error.message)));

    return () => {
      const result = ref.current;
      if (result) {
        result();
      }
    };
  }, [...deps, dispatch]);
};

export const useCatch = (method) => {
  const dispatch = useDispatch();
  return (...parameters) => {
    method(...parameters).catch((error) => dispatch(errorsActions.push(error.message)));
  };
};

export const useCatchCallback = (method, deps) => {
  return useCallback(useCatch(method), deps);
};

export const useScrollToLoad = (loadMore) => {
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef();
  const loadingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && loadMore && !loadingRef.current) {
        loadingRef.current = true;
        Promise.resolve(loadMore()).finally(() => {
          loadingRef.current = false;
        });
      }
    });
    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMore]);

  return { sentinelRef, hasMore, setHasMore };
};
