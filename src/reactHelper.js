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
  const [sentinel, setSentinel] = useState(null);
  const loadingRef = useRef(false);
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  useEffect(() => {
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loadingRef.current) {
        loadingRef.current = true;
        Promise.resolve(loadMoreRef.current?.()).finally(() => {
          loadingRef.current = false;
        });
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel]);

  return { sentinelRef: setSentinel, hasMore, setHasMore };
};
