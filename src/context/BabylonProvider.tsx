/*
 * Babylon provider:
 * Distributes the babylonjs engine, Map scene, and Loomies View scene.
 */

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import * as Babylon from '@babylonjs/core';
import { useEngineRenderLoop } from '@src/hooks/useEngineRenderLoop';
import { useEngine } from '@babylonjs/react-native';

export const enum APP_SCENE {
  // eslint-disable-next-line no-unused-vars
  NONE,
  // eslint-disable-next-line no-unused-vars
  MAP,
  // eslint-disable-next-line no-unused-vars
  DETAILS
}

interface iBabylonProvider {
  engine: Babylon.Engine | undefined;
  sceneMap: Babylon.Scene | undefined;
  sceneDetails: Babylon.Scene | undefined;

  cameraMap: Babylon.Camera | undefined;
  cameraDetails: Babylon.Camera | undefined;

  showSceneNone: () => void;
  showSceneMap: () => void;
  showSceneDetails: () => void;
  getCurrentScene: () => APP_SCENE;
}

export const BabylonContext = createContext<iBabylonProvider>({
  engine: undefined,
  sceneMap: undefined,
  sceneDetails: undefined,

  cameraMap: undefined,
  cameraDetails: undefined,

  showSceneNone: () => {
    return;
  },
  showSceneMap: () => {
    return;
  },
  showSceneDetails: () => {
    return;
  },
  getCurrentScene: () => APP_SCENE.NONE
});

// useful when debugging the engine
const DEBUG_RENDER_LOOP = false;

export const BabylonProvider = (props: { children: ReactNode }) => {
  const engine = useEngine();
  const [sceneMap, setSceneMap] = useState<Babylon.Scene>();
  const [sceneDetails, setSceneDetails] = useState<Babylon.Scene>();
  const [currentScene, setCurrentScene] = useState<APP_SCENE>(APP_SCENE.MAP);

  const [cameraMap, setCameraMap] = useState<Babylon.Camera>();
  const [cameraDetails, setCameraDetails] = useState<Babylon.Camera>();

  const showSceneNone = () => {
    setCurrentScene(APP_SCENE.NONE);
    clearSceneDetails();
  };

  const showSceneMap = () => {
    setCurrentScene(APP_SCENE.MAP);
  };

  const showSceneDetails = () => {
    clearSceneDetails();
    setCurrentScene(APP_SCENE.DETAILS);
  };

  const clearSceneDetails = () => {
    if (!sceneDetails) return;

    // dispose resources
    sceneDetails.meshes.forEach((mesh) => {
      mesh.dispose();
    });
  };

  const getCurrentScene = () => {
    return currentScene;
  };

  useEffect(() => {
    if (!engine) return;

    console.log('INFO: Creating scenes');

    // create scenes

    const sceneDetails = new Babylon.Scene(engine);
    const sceneMap = new Babylon.Scene(engine);

    // metadata

    sceneMap.metadata = { name: 'SceneMap' };
    sceneDetails.metadata = { name: 'SceneDetails' };

    // cameras

    sceneMap.createDefaultCamera(true, true, true);
    if (sceneMap.activeCamera) setCameraMap(sceneMap.activeCamera);

    sceneDetails.createDefaultCamera(true, true, true);
    if (sceneDetails.activeCamera) setCameraDetails(sceneDetails.activeCamera);

    // scene loomie details light

    new Babylon.HemisphericLight(
      'light',
      new Babylon.Vector3(0, 1, 0),
      sceneDetails
    );

    // set

    setSceneDetails(sceneDetails);
    setSceneMap(sceneMap);

    return () => {
      // dispose engine
      engine.dispose();
    };
  }, [engine]);

  // hook for updating the engine render loop

  useEngineRenderLoop(engine, () => {
    DEBUG_RENDER_LOOP && console.log('DEB: currentScene', currentScene);

    switch (currentScene) {
      case APP_SCENE.MAP:
        if (sceneMap) sceneMap.render();
        break;
      case APP_SCENE.DETAILS:
        if (sceneDetails) sceneDetails.render();
        break;
    }
  });

  return (
    <BabylonContext.Provider
      value={{
        engine,
        sceneMap,
        sceneDetails,

        cameraMap,
        cameraDetails,

        showSceneNone,
        showSceneMap,
        showSceneDetails,
        getCurrentScene
      }}
    >
      {props.children}
    </BabylonContext.Provider>
  );
};
