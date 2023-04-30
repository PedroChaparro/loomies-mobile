/*
 * CaptureSM:
 *
 * It setups the initial conditions for the scene
 * It's manages all the animations
 * It's executes the events for the current animation
 */

import * as Babylon from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core';
import { iBabylonProvider } from '@src/context/BabylonProvider';
import { iMapProvider } from '@src/context/MapProvider';
import { iModelProvider } from '@src/context/ModelProvider';
import { iUserPositionContext } from '@src/context/UserPositionProvider';
import { CAPTURE_RESULT } from '@src/services/capture.services';
import { TLoomball, TWildLoomies } from '@src/types/types';
import {
  instantiatedEntriesScale,
  instantiatedEntriesTranslate,
  instantiatedEntriesRotate
} from '../Map3D/utilsVertex';

import {
  controllerEscaped,
  controllerFall,
  controllerGrabbable,
  controllerGrabbed,
  controllerNone,
  controllerReturning,
  controllerThrow,
  iStateController,
  LOOMBALL_INITIAL_STATE,
  LOOMBALL_SPAWN_POS
} from './animations';

import { LOOMBALL_STATE } from './CaptureLoomie3D';

// control constants

const LOOMBALL_CAMERA_DISTANCE = 2.1;
const LOOMBALL_SCALE = 0.4;
const LOOMBALL_INITIAL_POS = new Vector3(0, -0.5, LOOMBALL_CAMERA_DISTANCE);

export interface iAniState {
  // babylon related
  sceneCapture: Babylon.Scene;
  cameraCapture: Babylon.Camera;
  babylonContext: iBabylonProvider;
  modelContext: iModelProvider;
  userPositionContext: iUserPositionContext;
  mapContext: iMapProvider;

  // callbacks
  attemptToCatch: () => Promise<[CAPTURE_RESULT, TWildLoomies | null]>;
  setBallState: (_state: LOOMBALL_STATE) => void;

  // loomie
  loomieHeight: number;

  // objects
  loomieModel?: Babylon.InstantiatedEntries;
  ballModel?: Babylon.Mesh;
  ballVisualNode?: Babylon.Mesh;

  hitbox?: Babylon.Mesh;
  scratchPad?: Babylon.Mesh;

  cameraDummy?: Babylon.Mesh;
  ballDummy?: Babylon.Mesh;

  ballInitialOrigin?: Babylon.Mesh;

  // loomball vars

  state: LOOMBALL_STATE;
  ballSerial: number;

  ballPosCurrLocal: Babylon.Vector3;
  ballPosCurr: Babylon.Vector3;
  ballPosPrevLocal: Babylon.Vector3;
  ballPosPrev: Babylon.Vector3;
  ballDir: Babylon.Vector3;

  // animation variables

  ballTarget: Babylon.Vector3;
  ballPosInitial: Babylon.Vector3;
  ballPosInitialLocal: Babylon.Vector3;
  ballSpeed: Babylon.Vector3;
  ballAcc: Babylon.Vector3;
  aniStartTime: number;
  aniEndTime: number;
}

export class CaptureSM {
  //setState:

  stt: iAniState;
  controllers: Map<LOOMBALL_STATE, iStateController>;

  constructor(
    sceneCapture: Babylon.Scene,
    cameraCapture: Babylon.Camera,
    babylonContext: iBabylonProvider,
    modelContext: iModelProvider,
    userPositionContext: iUserPositionContext,
    mapContext: iMapProvider,

    attemptToCatch: () => Promise<[CAPTURE_RESULT, TWildLoomies | null]>,
    setBallState: (_state: LOOMBALL_STATE) => void
  ) {
    this.stt = {
      sceneCapture,
      cameraCapture,
      babylonContext,
      modelContext,
      userPositionContext,
      mapContext,

      // callbacks

      attemptToCatch,
      setBallState: (state: LOOMBALL_STATE) => {
        this.stt.state = state;
        setBallState(state);
      },

      // loomie

      loomieHeight: 1,

      // loombal vars

      state: LOOMBALL_INITIAL_STATE,
      ballSerial: -1,

      ballPosCurrLocal: Vector3.Zero(),
      ballPosCurr: Vector3.Zero(),
      ballPosPrevLocal: Vector3.Zero(),
      ballPosPrev: Vector3.Zero(),
      ballDir: Vector3.Zero(),

      // animation variables

      ballTarget: Vector3.Zero(),
      ballPosInitial: Vector3.Zero(),
      ballPosInitialLocal: Vector3.Zero(),
      ballSpeed: Vector3.Zero(),
      ballAcc: Vector3.Zero(),
      aniStartTime: 0,
      aniEndTime: 0
    };

    // setup state controllers

    this.controllers = new Map<LOOMBALL_STATE, iStateController>();
    this.controllers.set(LOOMBALL_STATE.NONE, controllerNone);
    this.controllers.set(LOOMBALL_STATE.GRABBABLE, controllerGrabbable);
    this.controllers.set(LOOMBALL_STATE.ANI_GRABBED, controllerGrabbed);
    this.controllers.set(LOOMBALL_STATE.ANI_RETURNING, controllerReturning);
    this.controllers.set(LOOMBALL_STATE.ANI_THROW, controllerThrow);
    this.controllers.set(LOOMBALL_STATE.ANI_FALL, controllerFall);
    this.controllers.set(LOOMBALL_STATE.ANI_ESCAPED, controllerEscaped);

    // initialize state

    this.stt.setBallState(this.stt.state);
    const setup = this.controllers.get(this.stt.state)?.setup;
    if (setup) setup(this.stt);
  }

  updateProps(
    sceneCapture: Babylon.Scene,
    cameraCapture: Babylon.Camera,
    babylonContext: iBabylonProvider,
    modelContext: iModelProvider,
    userPositionContext: iUserPositionContext,
    mapContext: iMapProvider,
    loomball: TLoomball,

    attemptToCatch: () => Promise<[CAPTURE_RESULT, TWildLoomies | null]>,
    setBallState: (_state: LOOMBALL_STATE) => void
  ) {
    this.stt.sceneCapture = sceneCapture;
    this.stt.cameraCapture = cameraCapture;
    this.stt.babylonContext = babylonContext;
    this.stt.modelContext = modelContext;
    this.stt.userPositionContext = userPositionContext;
    this.stt.mapContext = mapContext;

    this.stt.attemptToCatch = attemptToCatch;
    this.stt.setBallState = (state: LOOMBALL_STATE) => {
      this.stt.state = state;
      setBallState(state);
    };

    this.updateLoomballModel(loomball);
  }

  setup(loomieSerial: number, loomball: TLoomball) {
    if (!this.stt.sceneCapture) return;

    this.setupScene(loomieSerial);
    this.updateLoomballModel(loomball);
  }

  async updateLoomballModel(loomball: TLoomball) {
    if (!this.stt.ballModel) return;
    if (!this.stt.ballVisualNode) return;
    if (loomball.serial == this.stt.ballSerial) return;
    this.stt.ballSerial = loomball.serial;

    try {
      // dispose previous model

      for (let i = 0; i < 10; i++) {
        this.stt.ballVisualNode.getChildren().forEach((mesh) => {
          console.log(`Info: Disposing (try ${i}) "${mesh.name}"`);
          mesh.dispose();
        });
        if (!this.stt.ballVisualNode.getChildren().length) break;
      }

      // load current model

      const model = await this.stt.modelContext.cloneModel(
        `loomball-${loomball.serial.toString().padStart(3, '0')}`,
        this.stt.sceneCapture
      );

      if (!model)
        throw "Error: updateLoomballModel: Couldn't instantiate loomball model";

      // hook it

      model.isPickable = false;
      model.parent = this.stt.ballModel;
      model.position = Vector3.Zero();
      model.parent = this.stt.ballVisualNode;
      model.rotation.y = Math.PI;
    } catch (e) {
      console.log(e);
    }
  }

  setupScene(loomieSerial: number) {
    const sceneCapture = this.stt.sceneCapture;
    const cameraCapture = this.stt.cameraCapture;

    // config camera
    const camera = cameraCapture as Babylon.ArcRotateCamera;

    // no panning
    camera.panningSensibility = 0;

    // limit camera zoom
    camera.lowerRadiusLimit = 7;
    camera.upperRadiusLimit = camera.lowerRadiusLimit;

    // limit camera angle
    camera.lowerBetaLimit = Math.PI * (0.5 - 0.3);
    camera.upperBetaLimit = Math.PI * (0.5 - 0.1);

    camera.lowerAlphaLimit = Math.PI * (0.5 - 0.2);
    camera.upperAlphaLimit = Math.PI * (0.5 + 0.2);

    camera.angularSensibilityX = 12000;
    camera.angularSensibilityY = camera.angularSensibilityX;

    // setup scene

    (async () => {
      try {
        // models

        const modelLoomie = await this.stt.modelContext.instantiateModel(
          loomieSerial.toString(),
          sceneCapture
        );

        const modelEnv = await this.stt.modelContext.instantiateModel(
          'ENV_GRASS',
          sceneCapture
        );

        // check

        if (!modelLoomie)
          throw "Error: Couldn't instantiate Loomie modelLoomie";
        if (!modelEnv) throw "Error: Couldn't instantiate env modelEnv";

        // helper nodes

        const modelBall = Babylon.MeshBuilder.CreateBox(
          `loomball`,
          { size: 0.2 },
          sceneCapture
        );

        const ballVisual = Babylon.MeshBuilder.CreateBox(
          `loomballVisual`,
          { size: 0.1 },
          sceneCapture
        );
        ballVisual.isPickable = false;
        ballVisual.parent = modelBall;

        // position model loomie

        const height = await this.stt.modelContext.getModelHeight(
          loomieSerial.toString(),
          sceneCapture
        );
        this.stt.loomieHeight = height;
        instantiatedEntriesTranslate(modelLoomie, Vector3.Zero());
        instantiatedEntriesScale(modelLoomie, Vector3.One());
        instantiatedEntriesRotate(modelLoomie, Math.PI);

        // make camera target the Loomie at the middle

        camera.setTarget(new Vector3(0, height / 2, 0));

        // DEBUG: Target loomball
        //const modelBall2 = await this.stt.modelContext.cloneModel(
        //`loomball-${loomball.serial.toString().padStart(3, '0')}`,
        //sceneCapture
        //);
        //if (modelBall2) {
        //modelBall2.position.y = height;
        //modelBall2.scaling = Vector3.One().scale(LOOMBALL_SCALE);
        //}

        // position ball relative to the camera

        modelBall.scaling = Vector3.One().scale(LOOMBALL_SCALE);
        modelBall.position = new Vector3().copyFrom(LOOMBALL_SPAWN_POS);
        modelBall.parent = cameraCapture;

        // loomball initial position

        const initialOriginBall = Babylon.MeshBuilder.CreateBox(
          'initialOriginBall',
          { size: 0.2 },
          sceneCapture
        );
        initialOriginBall.position = new Vector3().copyFrom(
          LOOMBALL_INITIAL_POS
        );
        initialOriginBall.parent = cameraCapture;
        initialOriginBall.isPickable = false;
        initialOriginBall.visibility = 0;

        //// loomball hitbox

        const hitbox = Babylon.MeshBuilder.CreateSphere(
          'loomball_hitbox',
          { diameter: 1.1, segments: 6, sideOrientation: 2 },
          sceneCapture
        );
        hitbox.scaling = Vector3.One().scale(LOOMBALL_SCALE);
        hitbox.parent = modelBall;
        hitbox.isPickable = true;
        hitbox.visibility = 0;

        //// scratch pad

        const scratchPad = Babylon.CreateDisc(
          'scratchPad',
          { radius: 0.5, tessellation: 12, sideOrientation: 2 },
          sceneCapture
        );
        scratchPad.position.y = -0.5;
        scratchPad.position.z = LOOMBALL_CAMERA_DISTANCE;
        scratchPad.parent = cameraCapture;
        scratchPad.isPickable = true;
        scratchPad.visibility = 0;

        // origin from which throw the loomball

        const throwOrigin = Babylon.MeshBuilder.CreateSphere(
          'loomball_hitbox',
          { diameter: 0.4, segments: 6, sideOrientation: 2 },
          sceneCapture
        );
        throwOrigin.isPickable = false;
        throwOrigin.visibility = 0;

        // camera dummy

        const cameraDummy = Babylon.MeshBuilder.CreateBox(
          'cameraDummy',
          { size: 0.2 },
          sceneCapture
        );
        cameraDummy.isPickable = false;
        cameraDummy.visibility = 0;

        const ballDummy = Babylon.MeshBuilder.CreateDisc(
          'ballDummy',
          { radius: 0.16, sideOrientation: 2 },
          sceneCapture
        );
        ballDummy.isPickable = false;
        ballDummy.parent = cameraDummy;
        ballDummy.visibility = 0;

        // set state

        this.stt.loomieModel = modelLoomie;
        this.stt.ballModel = modelBall;
        this.stt.hitbox = hitbox;
        this.stt.scratchPad = scratchPad;
        this.stt.ballInitialOrigin = initialOriginBall;
        this.stt.cameraDummy = cameraDummy;
        this.stt.ballDummy = ballDummy;
        this.stt.ballVisualNode = ballVisual;
      } catch (error) {
        console.error(error);
      }
    })();
  }

  // events

  onPointerDown(pointerInfo: Babylon.PointerInfo) {
    const controller = this.controllers.get(this.stt.state);
    if (!controller?.onPointerDown) return;
    controller.onPointerDown(this.stt, pointerInfo);
  }

  onPointerUp(pointerInfo: Babylon.PointerInfo) {
    const controller = this.controllers.get(this.stt.state);
    if (!controller?.onPointerUp) return;
    controller.onPointerUp(this.stt, pointerInfo);
  }

  onPointerMove(pointerInfo: Babylon.PointerInfo) {
    const controller = this.controllers.get(this.stt.state);
    if (!controller?.onPointerMove) return;
    controller.onPointerMove(this.stt, pointerInfo);
  }

  getFrameUpdateCallback(): () => void {
    const controller = this.controllers.get(this.stt.state);
    console.log(`Info: Controller frame ${controller?.frame}`);
    if (controller?.frame) {
      const callback = controller.frame;

      return () => {
        callback(this.stt);
      };
    }

    return () => {
      return;
    };
  }
}
