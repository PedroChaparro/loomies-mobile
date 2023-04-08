import * as Babylon from '@babylonjs/core';
import { EngineView } from '@babylonjs/react-native';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { instantiatedEntriesTranslate } from '../Map3D/utilsVertex';

import { CONFIG } from '@src/services/config.services';
import { TLoomball } from '@src/types/types';
import { PickingInfo, Vector3 } from '@babylonjs/core';
import { useScenePointerObservable } from '@src/hooks/useScenePointerObservable';
const { MAP_DEBUG } = CONFIG;

interface iCaptureLoomie3D {
  serialLoomie: number;
  loomball: TLoomball;
}

const LOOMBALL_CAMERA_DISTANCE = 2;
const LOOMBALL_SCALE = 0.6;
const LOOMBALL_INITIAL_POS = new Vector3(0, -0.5, LOOMBALL_CAMERA_DISTANCE);

export const CaptureLoomie3D = ({
  serialLoomie,
  loomball
}: iCaptureLoomie3D) => {
  const { sceneCapture, cameraCapture, getCurrentScene } =
    useContext(BabylonContext);
  const { cloneModel, instantiateModel, getModelHeight } =
    useContext(ModelContext);
  const { showScene } = useContext(BabylonContext);

  // meshes

  const [scratchPad, setScratchPad] = useState<Babylon.Mesh | null>(null);
  const [modelLoomie, setModelLoomie] =
    useState<Babylon.InstantiatedEntries | null>(null);
  const [modelBall, setModelBall] = useState<Babylon.Mesh | null>(null);
  const [modelHitbox, setModelHitbox] = useState<Babylon.Mesh | null>(null);
  const [initialOriginBall, setInitialOriginBall] = useState<Babylon.Mesh | null>(null);

  // loomball variables

  const ballGrabbed = useRef<boolean>(false);
  const ballReturning = useRef<boolean>(true);

  //const ballTarget = useRef<Babylon.Vector3>(Vector3.Zero());
  const ballPrevPos = useRef<Babylon.Vector3>(Vector3.Zero());
  const [ballTarget, setBallTarget] = useState<Babylon.Vector3>(Vector3.Zero());


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

    // setup scene

    (async () => {
      try {
        console.log('instantiate a thing or two');

        // models
        const modelLoomie = await instantiateModel(
          serialLoomie.toString(),
          sceneCapture
        );
        const modelEnv = await instantiateModel('ENV_GRASS', sceneCapture);
        const modelBall = await cloneModel(
          `loomball-${loomball.serial.toString().padStart(3, '0')}`,
          sceneCapture
        );
        const modelBall2 = await cloneModel(
          `loomball-${loomball.serial.toString().padStart(3, '0')}`,
          sceneCapture
        );
        if (modelBall2) {
          modelBall2.position.y = 2.5;
          modelBall2.scaling = Vector3.One().scale(LOOMBALL_SCALE);
        }

        // check

        if (!modelLoomie)
          throw "Error: Couldn't instantiate Loomie modelLoomie";
        if (!modelEnv) throw "Error: Couldn't instantiate env modelEnv";
        if (!modelBall) throw "Error: Couldn't instantiate env modelBall";

        // position model loomie

        const height = await getModelHeight(
          serialLoomie.toString(),
          sceneCapture
        );
        instantiatedEntriesTranslate(modelLoomie, new Babylon.Vector3(0, 0, 0));

        // make camera target the Loomie at the middle

        camera.setTarget(new Babylon.Vector3(0, height / 2, 0));

        // position ball relative to the camera

        modelBall.scaling = Vector3.One().scale(LOOMBALL_SCALE);
        modelBall.position = new Vector3().copyFrom(LOOMBALL_INITIAL_POS);
        modelBall.parent = cameraCapture;

        // loomball initial position

        //const initialOriginBall = new Babylon.Mesh("initialOriginBall", sceneCapture);
        const initialOriginBall = Babylon.MeshBuilder.CreateBox("initialOriginBall", {size: 0.2}, sceneCapture);
        initialOriginBall.position = new Vector3().copyFrom(LOOMBALL_INITIAL_POS);
        initialOriginBall.parent = cameraCapture;

        // loomball hitbox

        const hitbox = Babylon.MeshBuilder.CreateSphere(
          'loomball_hitbox',
          { diameter: 1.1, segments: 6, sideOrientation: 2 },
          sceneCapture
        );
        hitbox.scaling = Vector3.One().scale(LOOMBALL_SCALE);
        hitbox.parent = modelBall;
        hitbox.isPickable = true;

        // scratch pad

        const scratchPad = Babylon.CreateDisc(
          'scratchPad',
          { radius: 0.5, tessellation: 12, sideOrientation: 2 },
          sceneCapture
        );
        scratchPad.position.y = -0.5;
        scratchPad.position.z = LOOMBALL_CAMERA_DISTANCE;
        scratchPad.parent = cameraCapture;
        scratchPad.isPickable = true;

        // set state

        setModelLoomie(modelLoomie);
        setModelBall(modelBall);
        setModelHitbox(hitbox);
        setScratchPad(scratchPad);
        setInitialOriginBall(initialOriginBall);
      } catch (error) {
        console.error(error);
      }
    })();

    // hitbox

    // dispose
    //return () => {
    //if (!modelLoomie) return;
    //modelLoomie.dispose();
    //modelBall.dispose();
    //};
  }, [sceneCapture]);

  // toggle scene

  useEffect(() => {
    showScene(APP_SCENE.CAPTURE);
  }, []);

  // pointer events

  const onPointerDown = () => {
    if (!modelBall) return;

    console.log('grabbed on');
    ballPrevPos.current = modelBall.getAbsolutePosition();
    ballGrabbed.current = true;
    setBallTarget(modelBall.getAbsolutePosition());

    cameraCapture?.detachControl();
  };

  const onPointerUp = () => {
    if (!ballGrabbed.current) return;
    if (!initialOriginBall) return;

    console.log('grabbed off');
    ballGrabbed.current = false;
    ballReturning.current = true;
    setBallTarget(initialOriginBall.getAbsolutePosition());

    cameraCapture?.attachControl();

  };

  const onPointerMove = () => {
    if (!sceneCapture) return;
    if (!modelBall) return;
    if (!ballGrabbed.current) return;

    // get pointer position in plane

    const pickinfo = sceneCapture.pick(
      sceneCapture.pointerX,
      sceneCapture.pointerY,
      (mesh) => {
        return mesh == scratchPad;
      }
    );

    // pointer outside plane

    if (!pickinfo.hit) {
      onPointerUp();
      return;
    }
    if (!pickinfo.pickedPoint) return;

    // set target

    setBallTarget(pickinfo.pickedPoint);
  };

  if (sceneCapture)
    useScenePointerObservable(
      sceneCapture,
      (pointerInfo: Babylon.PointerInfo) => {
        if (!modelBall) return;

        switch (pointerInfo.type) {
          // pointer down

          case Babylon.PointerEventTypes.POINTERDOWN:
            if (!pointerInfo.pickInfo) return;
            if (
              pointerInfo.pickInfo.hit &&
              pointerInfo.pickInfo.pickedMesh == modelHitbox
            ) {
              console.log(
                'Info: Pressed',
                pointerInfo.pickInfo.pickedMesh?.name
              );
              onPointerDown();
            }
            break;

          // pointer up

          case Babylon.PointerEventTypes.POINTERUP:
            onPointerUp();
            break;

          // pointer move

          case Babylon.PointerEventTypes.POINTERMOVE: {
            onPointerMove();
            break;
          }
        }
      }
    );

  // register frame event

  useEffect(() => {
    if (!sceneCapture) return;

    const handler = () => {
      frameUpdate();
    };
    sceneCapture.registerBeforeRender(handler);

    return () => {
      sceneCapture.unregisterBeforeRender(handler);
    };
  }, [modelBall, ballTarget, sceneCapture]);

  //playerNode.current.position = Vector3.Lerp(
  //currPos,
  //targPos,
  //ANI_LERP_SPEED
  //);

  // frame update

  const frameUpdate = () => {
    //console.log(ballTarget);
    if (!modelBall) return;
    if (Vector3.Distance(ballTarget, Vector3.Zero()) === 0) return;
    if (!(ballReturning.current || ballGrabbed.current)) return;

    let target = ballTarget;

    // returning to default position

    if ((ballReturning.current) && (initialOriginBall)){
      target = initialOriginBall.getAbsolutePosition();

      // too close 

      if (Vector3.Distance(target, modelBall.getAbsolutePosition()) < 0.01){
        ballReturning.current = false;
        modelBall.setAbsolutePosition(target);
      }
    }

    console.log(target);

    modelBall.setAbsolutePosition(
      Vector3.Lerp(modelBall.getAbsolutePosition(), target, 0.5)
    );

  };

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
