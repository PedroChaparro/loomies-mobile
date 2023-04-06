/*
 * useEngineRenderLoop Hook:
 * Allows to update en engine render loop
 */

import { useRef, useEffect } from 'react';
import * as Babylon from '@babylonjs/core';

export const useEngineRenderLoop = (
  engine: Babylon.Engine | undefined,
  callback: () => void
) => {
  const savedCallback = useRef<() => void>(() => {
    return;
  });

  useEffect(() => {
    savedCallback.current = callback;

    if (engine) {
      engine.stopRenderLoop();
      engine.runRenderLoop(savedCallback.current);
      return () => {
        engine.stopRenderLoop();
      };
    }
  }, [engine, callback]);
};
