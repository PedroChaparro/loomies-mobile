import { useRef, useEffect } from 'react';

export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>(() => {
    return;
  });

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
