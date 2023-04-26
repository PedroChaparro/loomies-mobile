/*
 * useRegisterBeforeRender Hook:
 * Allows updating the event runned before every frame
 */

import { useRef, useEffect } from 'react';
import * as Babylon from '@babylonjs/core';

export const useRegisterBeforeRender = (
  scene: Babylon.Scene | undefined,
  callback: () => void,
  stt: string | undefined
) => {
  const savedCallback = useRef<() => void>(() => {
    return;
  });

  useEffect(() => {
    savedCallback.current = callback;

    if (scene) {
      scene.registerBeforeRender(savedCallback.current);
      return () => {
        scene.unregisterBeforeRender(savedCallback.current);
      };
    }
  }, [callback, stt]);
};
