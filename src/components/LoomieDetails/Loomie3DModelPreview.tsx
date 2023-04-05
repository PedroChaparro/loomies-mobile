import * as Babylon from '@babylonjs/core';
import { EngineView } from '@babylonjs/react-native';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { instantiatedEntriesTranslate } from '../Map3D/utilsVertex';

interface iLoomie3DModelPreview {
  serial: number;
  color: string;
}

export const Loomie3DModelPreview = ({
  serial,
  color
}: iLoomie3DModelPreview) => {
  const { sceneDetails, cameraDetails, getCurrentScene } =
    useContext(BabylonContext);
  const { instantiateModel, getModelHeight } = useContext(ModelContext);

  const [model, setModel] = useState<Babylon.InstantiatedEntries | null>(null);

  useEffect(() => {
    if (!sceneDetails) return;

    // config camera

    if (cameraDetails) {
      const camera = cameraDetails as Babylon.ArcRotateCamera;

      // not panning
      camera.panningSensibility = 0;

      // limit camera zoom
      camera.lowerRadiusLimit = 4.5;
      camera.upperRadiusLimit = 4.5;

      // limit camera angle
      camera.lowerBetaLimit = Math.PI * (0.5 - 0.1);
      camera.upperBetaLimit = Math.PI * (0.5 + 0.1);
    }

    // transparent background

    sceneDetails.clearColor = new Babylon.Color4(0, 0, 0, 0);

    // instantiate model

    (async () => {
      try {
        const model = await instantiateModel(serial.toString(), sceneDetails);
        if (!model) throw "Error: Couldn't instantiate model";
        setModel(model);

        // position model
        const height = await getModelHeight(serial.toString(), sceneDetails);
        instantiatedEntriesTranslate(
          model,
          new Babylon.Vector3(0, -height / 2, 0)
        );
      } catch (error) {
        console.error(error);
      }
    })();

    // dispose model
    return () => {
      if (!model) return;
      model.dispose();
    };
  }, [sceneDetails]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <View style={{ flex: 1 }}>
        {getCurrentScene() == APP_SCENE.DETAILS && (
          <EngineView
            isTransparent={true}
            camera={cameraDetails}
            displayFrameRate={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
