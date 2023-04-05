/*
 * Babylon provider:
 * Distributes the babylonjs engine, Map scene, and Loomies View scene.
 */

import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  ReactNode
} from 'react';
import * as Babylon from '@babylonjs/core';
import { useEngineRenderLoop } from '@src/hooks/useEngineRenderLoop';
import { useEngine } from '@babylonjs/react-native';

export const enum APP_SCENE {
  NONE,
  MAP,
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
  getCurrentScene: () => APP_SCENE.NONE,
});


export const BabylonProvider = (props: { children: ReactNode }) => {
  const engine = useEngine();
  const [sceneMap, setSceneMap] = useState<Babylon.Scene>();
  const [sceneDetails, setSceneDetails] = useState<Babylon.Scene>();
  const [currentScene, setCurrentScene] = useState<APP_SCENE>(APP_SCENE.MAP);
  //const [currentScene = useRef<APP_SCENE>(APP_SCENE.MAP);

  const [cameraMap, setCameraMap] = useState<Babylon.Camera>();
  const [cameraDetails, setCameraDetails] = useState<Babylon.Camera>();

  const showSceneNone = () => {
    console.log("B1");
    setCurrentScene(APP_SCENE.NONE);
    //currentScene.current = APP_SCENE.NONE;
    logSceneInfo();
  };

  const showSceneMap = () => {
    console.log("B2");
    setCurrentScene(APP_SCENE.MAP);
    //currentScene.current = APP_SCENE.MAP;
    logSceneInfo();
  };

  const showSceneDetails = () => {
    console.log("B3");
    setCurrentScene(APP_SCENE.DETAILS);
    //currentScene.current = APP_SCENE.DETAILS;
    logSceneInfo();
  };

  const clearSceneDetails = () => {
    // iterate trough all elements in the details scene
    // dispose resources
  };

  const getCurrentScene = () => {
    return currentScene;
  }

  const logSceneInfo = () => {
    console.log("INFO: Current scene", currentScene);
    console.log("Current camera", sceneMap?.activeCamera?.name);
    console.log("Meshes", sceneMap?.meshes.length);

    let line = "";
    sceneMap?.meshes.forEach((mesh) => {
      line += mesh.name + " " + mesh.visibility + " | ";
    });
    console.log(line);
  }

  useEffect(() => {
    if (!engine) return;

    console.log("CREATING SCENES");

    // create scenes

    // cameras

    //const cameraDetails = new Babylon.ArcRotateCamera("CameraDetails", 0, 0.8, 100, Babylon.Vector3.Zero(), sceneDetails);
    //setCameraDetails(cameraDetails);

    //const sceneDetails = sceneMap;
    const sceneDetails = new Babylon.Scene(engine);
    const sceneMap = new Babylon.Scene(engine);
    //const cameraMap = new Babylon.ArcRotateCamera("CameraMap", 0, 0.8, 100, Babylon.Vector3.Zero(), sceneMap);
    //setCameraMap(cameraMap);

    const cameraMap = new Babylon.FreeCamera("camera1", new Babylon.Vector3(0, 20, -30), sceneMap);
    setCameraMap(cameraMap);
    const cameraDetails = new Babylon.FreeCamera("camera2", new Babylon.Vector3(0, 20, -30), sceneDetails);
    setCameraDetails(cameraDetails);

    //sceneMap.createDefaultCamera(true, true, true);
    //if (sceneMap.activeCamera)
      //setCameraMap(sceneMap.activeCamera);

    //sceneDetails.createDefaultCamera(true, true, true);
    //if (sceneDetails.activeCamera)
      //setCameraDetails(sceneDetails.activeCamera);

    // demo objects

    //Box
    //const box1 = Babylon.Mesh.CreateBox("Box1", 10.0, sceneMap);
    const box1 = Babylon.Mesh.CreateSphere("Sphere", 32, 10, sceneMap);
    box1.position.x = -10;
    const materialBox = new Babylon.StandardMaterial("texture1", sceneMap);
    materialBox.diffuseColor = new Babylon.Color3(1, 0, 0);//Red
    //Applying materials
    box1.material = materialBox;

    const box2 = Babylon.Mesh.CreateBox("Box2", 15.0, sceneDetails);
    box2.position.x = -10;
    const materialBox2 = new Babylon.StandardMaterial("texture2", sceneDetails);
    materialBox2.diffuseColor = new Babylon.Color3(0, 1, 0);//Green
    //Applying materials
    box2.material = materialBox2;
    const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), sceneDetails);



    // metadata

    sceneMap.metadata = {name: "SceneMap"};
    sceneDetails.metadata = {name: "SceneDetails"};

    setSceneDetails(sceneDetails);
    setSceneMap(sceneMap);

    engine.scenes.forEach((scene) => {
      console.log(scene.metadata);
    });

    engine.scenes = engine.scenes.reverse();

    engine.scenes.forEach((scene) => {
      console.log(scene.metadata);
    });

    console.log("last created scneen:");
    console.log(Babylon.Engine.LastCreatedScene?.metadata);




    return () => {
      // dispose engine
    };
  }, [engine]);

  // hook for updating the engine render loop

  useEngineRenderLoop(engine, () => {
    //if (sceneMap) sceneMap.render();
    console.log(currentScene);
    switch (currentScene) {
      case APP_SCENE.MAP:
        if (sceneMap) sceneMap.render();
        console.log("APP_SCENE.MAP");
        break;
      case APP_SCENE.DETAILS:
        //if (sceneMap) sceneMap.render();
        console.log("APP_SCENE.DETAILS");
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
