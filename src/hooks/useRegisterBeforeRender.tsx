/*
 * useRegisterBeforeRender Hook:
 * Allows updating the event runned before every frame
 */

import { useRef, useEffect } from 'react';
import * as Babylon from '@babylonjs/core';
import { LOOMBALL_STATE } from '@src/components/CaptureLoomie3D/CaptureLoomie3D';

export const useRegisterBeforeRender = (
  scene: Babylon.Scene | undefined,
  callback: () => void,
  stt: LOOMBALL_STATE | undefined
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
