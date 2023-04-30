/*
 * CaptureLoomie3D:
 *
 * It's a middle man between the Babylon engine and the State Machine
 * It syncs the events running in the Babylon engine with those of the SM
 */

import React, { useContext, useEffect, useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import * as Babylon from '@babylonjs/core';
import { EngineView } from '@babylonjs/react-native';

import {
  CAPTURE_RESULT,
  requestCaptureLoomieAttempt
} from '@src/services/capture.services';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { useRegisterBeforeRender } from '@src/hooks/useRegisterBeforeRender';
import { useScenePointerObservable } from '@src/hooks/useScenePointerObservable';

import { TLoomball, TWildLoomies } from '@src/types/types';
import { CaptureSM } from './CaptureSM';
import { CONFIG } from '@src/services/config.services';
import { MapContext } from '@src/context/MapProvider';
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
  const mapContext = useContext(MapContext);

  // stores the ballState
  const stateMachine = useRef<CaptureSM | null>(null);

  // frame

  useRegisterBeforeRender(
    sceneCapture,
    () => {
      if (!stateMachine.current) return;

      const state = stateMachine.current.stt.state;
      const controller = stateMachine.current.controllers.get(state);

      if (controller?.frame) {
        const callback = controller.frame;

        callback(stateMachine.current.stt);
      }
    },
    stateMachine.current?.stt.state
      ? stateMachine.current.stt.state.toString()
      : undefined
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

    // create scene
    if (!stateMachine.current) {
      stateMachine.current = new CaptureSM(
        sceneCapture,
        cameraCapture,
        babylonContext,
        modelContext,
        userPositionContext,
        mapContext,

        attemptToCatch,
        setBallState
      );

      stateMachine.current.setup(loomie.serial, loomball);
    }

    // update
    else {
      console.log('Info: Updating SM props');
      stateMachine.current.updateProps(
        sceneCapture,
        cameraCapture,
        babylonContext,
        modelContext,
        userPositionContext,
        mapContext,
        loomball,

        attemptToCatch,
        setBallState
      );
    }

    return () => {
      // destroy everything
    };
  }, [
    sceneCapture,
    cameraCapture,
    babylonContext,
    modelContext,
    userPosition,
    mapContext,
    loomball,

    attemptToCatch,
    setBallState
  ]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ flex: 1 }}>
        {getCurrentScene() == APP_SCENE.CAPTURE && (
          <EngineView camera={cameraCapture} displayFrameRate={MAP_DEBUG} />
        )}
      </View>
    </SafeAreaView>
  );
};
