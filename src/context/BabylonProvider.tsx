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
  DETAILS,
  // eslint-disable-next-line no-unused-vars
  CAPTURE
}

interface iBabylonProvider {
  engine: Babylon.Engine | undefined;
  sceneMap: Babylon.Scene | undefined;
  sceneDetails: Babylon.Scene | undefined;
  sceneCapture: Babylon.Scene | undefined;

  cameraMap: Babylon.Camera | undefined;
  cameraDetails: Babylon.Camera | undefined;
  cameraCapture: Babylon.Camera | undefined;

  showScene: (_scene: APP_SCENE) => void;
  getCurrentScene: () => APP_SCENE;
}

export const BabylonContext = createContext<iBabylonProvider>({
  engine: undefined,
  sceneMap: undefined,
  sceneDetails: undefined,
  sceneCapture: undefined,

  cameraMap: undefined,
  cameraDetails: undefined,
  cameraCapture: undefined,

  showScene: (_scene: APP_SCENE) => {
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
  const [sceneCapture, setSceneCapture] = useState<Babylon.Scene>();
  const [currentScene, setCurrentScene] = useState<APP_SCENE>(APP_SCENE.MAP);

  const [cameraMap, setCameraMap] = useState<Babylon.Camera>();
  const [cameraDetails, setCameraDetails] = useState<Babylon.Camera>();
  const [cameraCapture, setCameraCapture] = useState<Babylon.Camera>();

  const showScene = (scene: APP_SCENE) => {
    switch (scene) {
      case APP_SCENE.NONE:
        showSceneNone();
        break;
      case APP_SCENE.MAP:
        showSceneMap();
        break;
      case APP_SCENE.DETAILS:
        showSceneDetails();
        break;
      case APP_SCENE.CAPTURE:
        showSceneCapture();
        break;
    }
  };

  const showSceneNone = () => {
    setCurrentScene(APP_SCENE.NONE);
    clearScene(sceneDetails);
    clearScene(sceneCapture);
  };

  const showSceneMap = () => {
    setCurrentScene(APP_SCENE.MAP);
  };

  const showSceneDetails = () => {
    setCurrentScene(APP_SCENE.DETAILS);
  };

  const showSceneCapture = () => {
    setCurrentScene(APP_SCENE.CAPTURE);
  };

  const clearScene = (scene: Babylon.Scene | undefined) => {
    if (!scene) return;
    console.log(`Info: Disposing scene ${scene.metadata.name}`);

    // dispose resources
    for (let i = 0; i < 10; i++){
      scene.meshes.forEach((mesh) => {
        console.log(`Info: Disposing (try ${i}) "${mesh.name}"`);
        mesh.dispose();
      });
      if (!scene.meshes.length) break;
    }
  }

  const getCurrentScene = () => {
    return currentScene;
  };

  useEffect(() => {
    if (!engine) return;

    console.log('INFO: Creating scenes');

    // create scenes

    const sceneMap = new Babylon.Scene(engine);
    const sceneDetails = new Babylon.Scene(engine);
    const sceneCapture = new Babylon.Scene(engine);

    // metadata

    sceneMap.metadata = { name: 'SceneMap' };
    sceneDetails.metadata = { name: 'SceneDetails' };
    sceneCapture.metadata = { name: 'SceneCapture' };

    // cameras

    sceneMap.createDefaultCamera(true, true, true);
    if (sceneMap.activeCamera) setCameraMap(sceneMap.activeCamera);

    sceneDetails.createDefaultCamera(true, true, true);
    if (sceneDetails.activeCamera) setCameraDetails(sceneDetails.activeCamera);

    sceneCapture.createDefaultCamera(true, true, true);
    if (sceneCapture.activeCamera) setCameraCapture(sceneCapture.activeCamera);

    // lights (only those that need it)

    new Babylon.HemisphericLight(
      'light',
      new Babylon.Vector3(0, 1, 0),
      sceneDetails
    );

    new Babylon.HemisphericLight(
      'light',
      new Babylon.Vector3(0, 1, 0),
      sceneCapture
    );

    // set

    setSceneMap(sceneMap);
    setSceneDetails(sceneDetails);
    setSceneCapture(sceneCapture);

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
      case APP_SCENE.CAPTURE:
        if (sceneCapture) sceneCapture.render();
        break;
    }
  });

  return (
    <BabylonContext.Provider
      value={{
        engine,
        sceneMap,
        sceneDetails,
        sceneCapture,

        cameraMap,
        cameraDetails,
        cameraCapture,

        showScene,
        getCurrentScene
      }}
    >
      {props.children}
    </BabylonContext.Provider>
  );
};
