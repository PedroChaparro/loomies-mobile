/*
 * CombatSM:
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
import {
  instantiatedEntriesScale,
  instantiatedEntriesTranslate,
  instantiatedEntriesRotate
} from '@src/components/Map3D/utilsVertex';

import {
  controllerNone,
  //controllerReturning,
  //controllerThrow,
  iStateController
} from './animations';

import { COMBAT_LOOMIE_STATE } from './Combat3D';
import { iLoomie } from '@src/types/combatInterfaces';

// constants

export const LOOMIE_INITIAL_STATE = COMBAT_LOOMIE_STATE.NONE;

// position constants

const CAMERA_TRANSFORM = new Vector3(2.1443, 0.9221, 10);
const USER_LOOMIE_INITIAL_POS = new Vector3(0, 0, -2);
const GYM_LOOMIE_INITIAL_POS = new Vector3(0, 0, 2);

export interface iCombatLoomieState {
  state: COMBAT_LOOMIE_STATE;
  loomie: iLoomie;

  posInitial: Vector3;
  posCurrent: Vector3;

  // TODO: Have a reference to the root node
  // object
  model?: Babylon.InstantiatedEntries;

  // animation variables
  speed: number;
  aniStartTime: number;
  aniEndTime: number;
}

export interface iAniState {
  // babylon related
  sceneCombat: Babylon.Scene;
  cameraCombat: Babylon.Camera;
  babylonContext: iBabylonProvider;
  modelContext: iModelProvider;
  mapContext: iMapProvider;

  // loomies
  loomieUser: iCombatLoomieState;
  loomieGym: iCombatLoomieState;
}

export class CombatSM {
  //setState:

  stt: iAniState;
  controllers: Map<COMBAT_LOOMIE_STATE, iStateController>;

  constructor(
    sceneCombat: Babylon.Scene,
    cameraCombat: Babylon.Camera,
    babylonContext: iBabylonProvider,
    modelContext: iModelProvider,
    mapContext: iMapProvider,

    loomieUser: iLoomie,
    loomieGym: iLoomie
  ) {
    // setup state

    const user: iCombatLoomieState = {
      state: LOOMIE_INITIAL_STATE,
      loomie: loomieUser,

      posInitial: Vector3.Zero(),
      posCurrent: Vector3.Zero(),

      // object
      model: undefined,

      // animation variables
      speed: 0,
      aniStartTime: 0,
      aniEndTime: 0
    };

    const gym: iCombatLoomieState = {
      state: LOOMIE_INITIAL_STATE,
      loomie: loomieGym,

      posInitial: Vector3.Zero(),
      posCurrent: Vector3.Zero(),

      // object
      model: undefined,

      // animation variables
      speed: 0,
      aniStartTime: 0,
      aniEndTime: 0
    };

    this.stt = {
      sceneCombat,
      cameraCombat,
      babylonContext,
      modelContext,
      mapContext,

      // loomies
      loomieUser: user,
      loomieGym: gym
    };

    // setup state controllers

    this.controllers = new Map<COMBAT_LOOMIE_STATE, iStateController>();
    this.controllers.set(COMBAT_LOOMIE_STATE.NONE, controllerNone);

    // initialize state

    //this.stt.setBallState(this.stt.state);
    //const setup = this.controllers.get(this.stt.state)?.setup;
    //if (setup) setup(this.stt);
  }

  updateProps(
    sceneCombat: Babylon.Scene,
    cameraCombat: Babylon.Camera,
    babylonContext: iBabylonProvider,
    modelContext: iModelProvider,
    mapContext: iMapProvider,

    loomieUser: iLoomie,
    loomieGym: iLoomie
  ) {
    this.stt.sceneCombat = sceneCombat;
    this.stt.cameraCombat = cameraCombat;
    this.stt.babylonContext = babylonContext;
    this.stt.modelContext = modelContext;
    this.stt.mapContext = mapContext;

    // update models
    if (this.stt.loomieUser.loomie.serial !== loomieUser.serial) {
      this.updateLoomieModel(this.stt.loomieUser, true);
    }

    if (this.stt.loomieGym.loomie.serial !== loomieGym.serial) {
      this.updateLoomieModel(this.stt.loomieGym, false);
    }

    // set
    this.stt.loomieUser.loomie = loomieUser;
    this.stt.loomieGym.loomie = loomieGym;
  }

  setup() {
    console.log('Setiing up scene A1 ===========================');
    this.setupScene();
  }

  setupScene() {
    const sceneCombat = this.stt.sceneCombat;
    const cameraCombat = this.stt.cameraCombat;

    // config camera
    const camera = cameraCombat as Babylon.ArcRotateCamera;

    // no panning
    //camera.panningSensibility = 0;

    // limit camera zoom
    //camera.lowerRadiusLimit = 70;
    //camera.upperRadiusLimit = camera.lowerRadiusLimit;

    //// limit camera angle
    //camera.lowerBetaLimit = Math.PI * (0.5 - 0.3);
    //camera.upperBetaLimit = Math.PI * (0.5 - 0.1);

    //camera.lowerAlphaLimit = Math.PI * (0.5 - 0.2);
    //camera.upperAlphaLimit = Math.PI * (0.5 + 0.2);

    //camera.angularSensibilityX = 12000;
    //camera.angularSensibilityY = camera.angularSensibilityX;

    // make camera target the middle
    //camera.setTarget(new Vector3(0, 0, 0));

    //camera.position = new Vector3(0, 10, 10);
    //camera.setPosition(new Vector3(0, 10, 10))
    camera.alpha = CAMERA_TRANSFORM.x;
    camera.beta = CAMERA_TRANSFORM.y;
    camera.radius = CAMERA_TRANSFORM.z;

    console.log(camera.alpha);
    console.log(camera.beta);
    console.log(camera.radius);

    //cameraCombat.position = new Vector3(0, 1, 1);
    //camera.setPosition( new Vector3(0, 1, 1));
    //console.log(cameraCombat.position);

    // setup scene

    console.log('Setiing up scene ===========================');

    (async () => {
      try {
        // models

        const modelEnv = await this.stt.modelContext.instantiateModel(
          'ENV_GRASS',
          sceneCombat
        );

        // check

        if (!modelEnv) throw "Error: Couldn't instantiate env modelEnv";

        instantiatedEntriesTranslate(modelEnv, Vector3.Zero());

        // loomie models

        await this.updateLoomieModel(this.stt.loomieUser, true);
        await this.updateLoomieModel(this.stt.loomieGym, false);

        console.log('Finished with scene');

        // set state

        //this.stt.loomieModel = modelLoomie;
        //this.stt.ballModel = modelBall;
        //this.stt.hitbox = hitbox;
        //this.stt.scratchPad = scratchPad;
        //this.stt.ballInitialOrigin = initialOriginBall;
        //this.stt.cameraDummy = cameraDummy;
        //this.stt.ballDummy = ballDummy;
      } catch (error) {
        console.error(error);
      }
    })();
  }

  // update loomie model

  async updateLoomieModel(loomieStt: iCombatLoomieState, user: boolean) {
    try {
      // free previous model

      loomieStt.model?.dispose();

      // load current model

      const model = await this.stt.modelContext.instantiateModel(
        loomieStt.loomie.serial.toString(),
        this.stt.sceneCombat
      );

      if (!model)
        throw "Error: updateLoomieModel: Couldn't instantiate loomie model";

      // transform

      if (user) {
        instantiatedEntriesTranslate(model, USER_LOOMIE_INITIAL_POS);
      } else {
        instantiatedEntriesTranslate(model, GYM_LOOMIE_INITIAL_POS);
        instantiatedEntriesRotate(model, Math.PI);
      }

      loomieStt.model = model;
    } catch (e) {
      console.log(e);
    }
  }

  // events

  getFrameUpdateCallback(): () => void {
    const controller = this.controllers.get(this.stt.loomieUser.state);
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
