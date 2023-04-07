import * as Babylon from '@babylonjs/core';
import { EngineView } from '@babylonjs/react-native';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { instantiatedEntriesTranslate } from '../Map3D/utilsVertex';

import { CONFIG } from '@src/services/config.services';
const { MAP_DEBUG } = CONFIG;

interface iCaptureLoomie3D {
  serial: number;
}

export const CaptureLoomie3D = ({ serial }: iCaptureLoomie3D) => {
  const { sceneCapture, cameraCapture, getCurrentScene } =
    useContext(BabylonContext);
  const { instantiateModel, getModelHeight } = useContext(ModelContext);
  const { showScene } = useContext(BabylonContext);

  const [model, setModel] = useState<Babylon.InstantiatedEntries | null>(null);

  useEffect(() => {
    if (!sceneCapture) return;
    if (!cameraCapture) return;

    // config camera
    const camera = cameraCapture as Babylon.ArcRotateCamera;

    // not panning
    camera.panningSensibility = 0;

    // limit camera zoom
    camera.lowerRadiusLimit = 7;
    camera.upperRadiusLimit = camera.lowerRadiusLimit;

    // limit camera angle
    camera.lowerBetaLimit = Math.PI * (0.5 - 0.15);
    camera.upperBetaLimit = Math.PI * (0.5 - 0.1);

    camera.lowerAlphaLimit = Math.PI * (0.5 - 0.05);
    camera.upperAlphaLimit = Math.PI * (0.5 + 0.05);

    camera.angularSensibilityX = 20000;
    camera.angularSensibilityY = camera.angularSensibilityX;

    // instantiate model

    (async () => {
      try {
        console.log("instantiate a thing or two");
        // loomie model
        const modelLoomie = await instantiateModel(serial.toString(), sceneCapture);
        const modelEnv = await instantiateModel("ENV_GRASS", sceneCapture);

        // environment model
        if (!modelLoomie) throw "Error: Couldn't instantiate Loomie model";
        if (!modelEnv) throw "Error: Couldn't instantiate env model";

        setModel(modelLoomie);

        // position model
        const height = await getModelHeight(serial.toString(), sceneCapture);
        instantiatedEntriesTranslate(
          modelLoomie,
          new Babylon.Vector3(0, 0, 0)
        );

        camera.setTarget(new Babylon.Vector3(0, height/2, 0));

      } catch (error) {
        console.error(error);
      }
    })();

    // dispose model
    return () => {
      if (!model) return;
      model.dispose();
    };
  }, [sceneCapture]);

  useEffect(() => {
    showScene( APP_SCENE.CAPTURE );
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {getCurrentScene() == APP_SCENE.CAPTURE && (
          <EngineView camera={cameraCapture} displayFrameRate={MAP_DEBUG} />
        )}
      </View>
    </SafeAreaView>
  );
};
