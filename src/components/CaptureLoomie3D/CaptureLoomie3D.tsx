import * as Babylon from '@babylonjs/core';
import { EngineView } from '@babylonjs/react-native';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { instantiatedEntriesTranslate } from '../Map3D/utilsVertex';

import { CONFIG } from '@src/services/config.services';
import { TLoomball } from '@src/types/types';
const { MAP_DEBUG } = CONFIG;

interface iCaptureLoomie3D {
  serialLoomie: number;
  loomball: TLoomball;
}

export const CaptureLoomie3D = ({ serialLoomie, loomball }: iCaptureLoomie3D) => {
  const { sceneCapture, cameraCapture, getCurrentScene } =
    useContext(BabylonContext);
  const { cloneModel, instantiateModel, getModelHeight } = useContext(ModelContext);
  const { showScene } = useContext(BabylonContext);

  // models
  const [modelLoomie, setModelLoomie] = useState<Babylon.InstantiatedEntries | null>(null);
  const [modelBall, setModelBall] = useState<Babylon.Mesh | null>(null);

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

    // instantiate modelLoomie

    (async () => {
      try {
        console.log("instantiate a thing or two");

        // loomie modelLoomie
        const modelLoomie = await instantiateModel(serialLoomie.toString(), sceneCapture);
        const modelEnv = await instantiateModel("ENV_GRASS", sceneCapture);

        // environment modelLoomie
        if (!modelLoomie) throw "Error: Couldn't instantiate Loomie modelLoomie";
        if (!modelEnv) throw "Error: Couldn't instantiate env modelEnv";

        setModelLoomie(modelLoomie);

        // position modelLoomie
        const height = await getModelHeight(serialLoomie.toString(), sceneCapture);
        instantiatedEntriesTranslate(
          modelLoomie,
          new Babylon.Vector3(0, 0, 0)
        );

        // make camera target the Loomie at the middle
        camera.setTarget(new Babylon.Vector3(0, height/2, 0));

      } catch (error) {
        console.error(error);
      }

    })();

    // dispose modelLoomie
    return () => {
      if (!modelLoomie) return;
      modelLoomie.dispose();
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
