import * as Babylon from '@babylonjs/core';
import { EngineView } from '@babylonjs/react-native';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { instantiatedEntriesTranslate } from '../Map3D/utilsVertex';

import { CONFIG } from '@src/services/config.services';
import { TLoomball } from '@src/types/types';
import { Vector3 } from '@babylonjs/core';
import { useScenePointerObservable } from '@src/hooks/useScenePointerObservable';
import { CaptureSM } from './utilsCapture';
import { useRegisterBeforeRender } from '@src/hooks/useRegisterBeforeRender';
const { MAP_DEBUG } = CONFIG;

interface iCaptureLoomie3D {
  serialLoomie: number;
  loomball: TLoomball;
}

export const enum LOOMBALL_STATE {
  // eslint-disable-next-line no-unused-vars
  NONE,
  // eslint-disable-next-line no-unused-vars
  GRABBABLE,
  // eslint-disable-next-line no-unused-vars
  ANI_GRABBED,
  // eslint-disable-next-line no-unused-vars
  ANI_RETURNING,
  // eslint-disable-next-line no-unused-vars
  ANI_THROW,
  // eslint-disable-next-line no-unused-vars
  ANI_FALL,
  // eslint-disable-next-line no-unused-vars
  ANI_STRUGGLE,
  // eslint-disable-next-line no-unused-vars
  ANI_CAPTURED,
  // eslint-disable-next-line no-unused-vars
  ANI_ESCAPED,
}

export const CaptureLoomie3D = ({
  serialLoomie,
  loomball
}: iCaptureLoomie3D) => {

  const { sceneCapture, cameraCapture, getCurrentScene } =
    useContext(BabylonContext);
  const { cloneModel, instantiateModel, getModelHeight } =
    useContext(ModelContext);
  const { showScene } = useContext(BabylonContext);


  const babylonContext = useContext(BabylonContext);
  const modelContext = useContext(ModelContext);


  // stores the ballState
  const stateMachine = useRef<CaptureSM | null>(null);

  // frame
  console.log("= == == = == = = == = Render this");

  // 

  useRegisterBeforeRender(
    sceneCapture,
    () => {
      if (!stateMachine.current) return;

      const state = stateMachine.current.stt.state;
      const controller = stateMachine.current.controllers.get(state);
      console.log(`State State ${state}`);

      if (controller?.frame){
        const callback = controller.frame;

        callback(stateMachine.current.stt);

      }

    },
    stateMachine.current?.stt.state,
  );

  // pointer events

  if (sceneCapture)
    useScenePointerObservable(
      sceneCapture,
      (pointerInfo: Babylon.PointerInfo) => {
        if (!stateMachine.current) return;

        switch (pointerInfo.type) {
          // pointer down

          case Babylon.PointerEventTypes.POINTERDOWN:
            console.log(stateMachine.current.stt.state);
            console.log("Look at me");
            stateMachine.current.onPointerDown(pointerInfo);
            break;

          // pointer up

          case Babylon.PointerEventTypes.POINTERUP:
            stateMachine.current.onPointerUp(pointerInfo);
            break;

          // pointer move

          case Babylon.PointerEventTypes.POINTERMOVE: {
            stateMachine.current.onPointerMove(pointerInfo);
            break;
          }
        }
      }
    );

  // create / update state machine

  useEffect(() => {
    if (!sceneCapture) return;
    if (!cameraCapture) return;

    // create scene
    if (!stateMachine.current){
      stateMachine.current = new CaptureSM(
        sceneCapture,
        cameraCapture,
        babylonContext,
        modelContext,
      );

      stateMachine.current.setup(serialLoomie, loomball);
    }

    // update
    else {
      stateMachine.current.updateProps(
        sceneCapture,
        cameraCapture,
        babylonContext,
        modelContext,
      );
    }

    return () => {
      // destroy everything
    }
  }, [sceneCapture, cameraCapture, babylonContext, modelContext]);

  // none state create scene
  useEffect(() => {
    // create scene

    return () => {
      // destroy everything
    }
  }, []);

  // toggle scene

  useEffect(() => {
    showScene(APP_SCENE.CAPTURE);
  }, []);

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

