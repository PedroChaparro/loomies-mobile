import * as Babylon from '@babylonjs/core';
import { EngineView } from '@babylonjs/react-native';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { SafeAreaView, View } from 'react-native';

import { CONFIG } from '@src/services/config.services';
import { TLoomball, TWildLoomies } from '@src/types/types';
import { useScenePointerObservable } from '@src/hooks/useScenePointerObservable';
import { CaptureSM } from './utilsCapture';
import { useRegisterBeforeRender } from '@src/hooks/useRegisterBeforeRender';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import {
  CAPTURE_RESULT,
  requestCaptureLoomieAttempt
} from '@src/services/capture.services';
const { MAP_DEBUG } = CONFIG;

interface iCaptureLoomie3D {
  loomie: TWildLoomies;
  loomball: TLoomball;
  setBallState: (_state: LOOMBALL_STATE) => void;
}

export const enum LOOMBALL_STATE {
  NONE,
  GRABBABLE,
  ANI_GRABBED,
  ANI_RETURNING,
  ANI_THROW,
  ANI_FALL,
  ANI_STRUGGLE,
  ANI_CAPTURED,
  ANI_ESCAPED
}

export const CaptureLoomie3D = ({
  loomie,
  loomball,
  setBallState
}: iCaptureLoomie3D) => {
  const { sceneCapture, cameraCapture, getCurrentScene } =
    useContext(BabylonContext);
  const { showScene } = useContext(BabylonContext);
  const { userPosition } = useContext(UserPositionContext);

  const babylonContext = useContext(BabylonContext);
  const modelContext = useContext(ModelContext);
  const userPositionContext = useContext(UserPositionContext);

  // stores the ballState
  const stateMachine = useRef<CaptureSM | null>(null);

  // frame

  useRegisterBeforeRender(
    sceneCapture,
    () => {
      if (!stateMachine.current) return;

      const state = stateMachine.current.stt.state;
      const controller = stateMachine.current.controllers.get(state);
      //console.log(`State State ${state}`);

      if (controller?.frame) {
        const callback = controller.frame;

        callback(stateMachine.current.stt);
      }
    },
    stateMachine.current?.stt.state
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
            console.log('Look at me');
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

  const attemptToCatch = async (): Promise<
    [CAPTURE_RESULT, TWildLoomies | null]
  > => {
    if (userPosition) {
      const captured = await requestCaptureLoomieAttempt(
        userPosition,
        loomie._id,
        loomball._id
      );
      return [captured, loomie];
    }
    return [CAPTURE_RESULT.NOTFOUND, null];
  };

  // create / update state machine

  useEffect(() => {
    if (!sceneCapture) return;
    if (!cameraCapture) return;

    console.log('position', userPosition);

    // create scene
    if (!stateMachine.current) {
      stateMachine.current = new CaptureSM(
        sceneCapture,
        cameraCapture,
        babylonContext,
        modelContext,
        userPositionContext,

        attemptToCatch,
        setBallState
      );

      stateMachine.current.setup(loomie.serial, loomball);
    }

    // update
    else {
      console.log('UPDATING MACHINE PROPS');
      stateMachine.current.updateProps(
        sceneCapture,
        cameraCapture,
        babylonContext,
        modelContext,
        userPositionContext
      );
    }

    return () => {
      // destroy everything
    };
  }, [sceneCapture, cameraCapture, babylonContext, modelContext, userPosition]);

  // none state create scene
  useEffect(() => {
    // create scene

    return () => {
      // destroy everything
    };
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
