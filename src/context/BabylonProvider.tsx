/*
 * Babylon provider:
 * Distributes the babylonjs engine, Map scene, and Loomies View scene.
 */

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import * as Babylon from '@babylonjs/core';
import { useEngineRenderLoop } from '@src/hooks/useEngineRenderLoop';
import { useEngine } from '@babylonjs/react-native';
import { ArcRotateCamera } from '@babylonjs/core';
import { delay } from '@src/utils/delay';

export const enum APP_SCENE {
  NONE,
  MAP,
  DETAILS,
  CAPTURE,
  COMBAT
}

export interface iBabylonProvider {
  engine: Babylon.Engine | undefined;
  sceneMap: Babylon.Scene | undefined;
  sceneDetails: Babylon.Scene | undefined;
  sceneCapture: Babylon.Scene | undefined;
  sceneCombat: Babylon.Scene | undefined;

  cameraMap: Babylon.Camera | undefined;
  cameraDetails: Babylon.Camera | undefined;
  cameraCapture: Babylon.Camera | undefined;
  cameraCombat: Babylon.Camera | undefined;

  showScene: (_scene: APP_SCENE) => void;
  getCurrentScene: () => APP_SCENE;
}

export const BabylonContext = createContext<iBabylonProvider>({
  engine: undefined,
  sceneMap: undefined,
  sceneDetails: undefined,
  sceneCapture: undefined,
  sceneCombat: undefined,

  cameraMap: undefined,
  cameraDetails: undefined,
  cameraCapture: undefined,
  cameraCombat: undefined,

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
  const [sceneCombat, setSceneCombat] = useState<Babylon.Scene>();
  const [currentScene, setCurrentScene] = useState<APP_SCENE>(APP_SCENE.MAP);

  const [cameraMap, setCameraMap] = useState<Babylon.Camera>();
  const [cameraDetails, setCameraDetails] = useState<Babylon.Camera>();
  const [cameraCapture, setCameraCapture] = useState<Babylon.Camera>();
  const [cameraCombat, setCameraCombat] = useState<Babylon.Camera>();

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
      case APP_SCENE.COMBAT:
        showSceneCombat();
        break;
    }
  };

  const showSceneNone = async () => {
    clearScene(sceneDetails);
    clearScene(sceneCapture);
    clearScene(sceneCombat);
    stopCameras();
    setCurrentScene(APP_SCENE.NONE);
  };

  const showSceneMap = async () => {
    await delay(500);
    setCurrentScene(APP_SCENE.MAP);
    stopCameras();
  };

  const showSceneDetails = async () => {
    await delay(500);
    setCurrentScene(APP_SCENE.DETAILS);
    stopCameras();
  };

  const showSceneCapture = async () => {
    await delay(500);
    setCurrentScene(APP_SCENE.CAPTURE);
    stopCameras();
  };

  const showSceneCombat = async () => {
    await delay(500);
    setCurrentScene(APP_SCENE.COMBAT);
    stopCameras();
  };

  const clearScene = (scene: Babylon.Scene | undefined) => {
    if (!scene) return;
    console.log(`Info: Disposing scene ${scene.metadata.name}`);

    // dispose resources
    for (let i = 0; i < 10; i++) {
      scene.meshes.forEach((mesh) => {
        console.log(`Info: Disposing (try ${i}) "${mesh.name}"`);
        mesh.dispose();
      });
      if (!scene.meshes.length) break;
    }
  };

  const stopCameras = () => {
    if (!cameraMap) return;
    if (!cameraDetails) return;
    if (!cameraCapture) return;
    if (!cameraCombat) return;

    // reset transforms

    [cameraDetails, cameraCapture, cameraCombat].forEach((cameraOri) => {
      const camera = cameraOri as ArcRotateCamera;
      camera.position = new Babylon.Vector3(0, 0, 0);
      camera.rotation = new Babylon.Vector3(0, 0, 0);
    });

    // stop movement

    [cameraMap, cameraDetails, cameraCapture, cameraCombat].forEach((cameraOri) => {
      const camera = cameraOri as ArcRotateCamera;
      camera.cameraRotation = new Babylon.Vector2(0, 0);
      camera.inertialAlphaOffset = 0;
      camera.inertialBetaOffset = 0;
      camera.inertialPanningX = 0;
      camera.inertialPanningY = 0;
      camera.inertialRadiusOffset = 0;
    });
  };

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
    const sceneCombat = new Babylon.Scene(engine);

    // metadata

    sceneMap.metadata = { name: 'SceneMap' };
    sceneDetails.metadata = { name: 'SceneDetails' };
    sceneCapture.metadata = { name: 'SceneCapture' };
    sceneCombat.metadata = { name: 'SceneCombat' };

    // cameras

    sceneMap.createDefaultCamera(true, true, true);
    if (sceneMap.activeCamera) setCameraMap(sceneMap.activeCamera);

    sceneDetails.createDefaultCamera(true, true, true);
    if (sceneDetails.activeCamera) setCameraDetails(sceneDetails.activeCamera);

    sceneCapture.createDefaultCamera(true, true, true);
    if (sceneCapture.activeCamera) setCameraCapture(sceneCapture.activeCamera);

    sceneCombat.createDefaultCamera(true, true, true);
    if (sceneCombat.activeCamera) setCameraCombat(sceneCombat.activeCamera);

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

    new Babylon.HemisphericLight(
      'light',
      new Babylon.Vector3(0, 1, 0),
      sceneCombat
    );

    // set

    setSceneMap(sceneMap);
    setSceneDetails(sceneDetails);
    setSceneCapture(sceneCapture);
    setSceneCombat(sceneCombat);

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
      case APP_SCENE.COMBAT:
        if (sceneCombat) sceneCombat.render();
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
        sceneCombat,

        cameraMap,
        cameraDetails,
        cameraCapture,
        cameraCombat,

        showScene,
        getCurrentScene
      }}
    >
      {props.children}
    </BabylonContext.Provider>
  );
};
