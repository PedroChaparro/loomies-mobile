/*
 * useScenePointerObservable Hook:
 * Allows to set an event when clicking a 3D Model on a Scene
 * While keeping updated the react references
 */

import { useRef, useEffect } from 'react';
import * as Babylon from '@babylonjs/core';

export const useScenePointerObservable = (
  scene: Babylon.Scene | null,
  callback: (_pointer: Babylon.PointerInfo) => void
) => {
  const savedCallback = useRef<(_pointer: Babylon.PointerInfo) => void>(() => {
    return;
  });

  useEffect(() => {
    savedCallback.current = callback;

    if (scene !== null) {
      const observer = scene.onPointerObservable.add(savedCallback.current);
      return () => {
        scene.onPointerObservable.remove(observer);
      };
    }
  }, [callback]);
};
