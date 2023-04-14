import * as Babylon from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core';
import { instantiatedEntriesScale } from '../Map3D/utilsVertex';
import { LOOMBALL_STATE } from "./CaptureLoomie3D";
import { aniThrowCalculatePosition, throwCalculateSpeeds, collidedWithObject, fallCalculateSpeeds, fallCalculatePosition } from './utilsAnimation';
import { iAniState } from "./utilsCapture";

export interface iStateController {
  onPointerDown?: (_state: iAniState, _pointerInfo: Babylon.PointerInfo) => void;
  onPointerUp?: (_state: iAniState, _pointerInfo: Babylon.PointerInfo) => void;
  onPointerMove?: (_state: iAniState, _pointerInfo: Babylon.PointerInfo) => void;
  frame?: (_state: iAniState) => void;
}

// control constants

const LOOMBALL_CAMERA_DISTANCE = 2;
const LOOMBALL_SCALE = 0.4;
const LOOMBALL_RADIUS = 0.2;

const LOOMBALL_INITIAL_POS = new Vector3(0, -0.5, LOOMBALL_CAMERA_DISTANCE);
const LOOMBALL_INITIAL_STATE = LOOMBALL_STATE.GRABBABLE;

// animation constants

export const ANI_THROW_DURATION = 500; // milliseconds
export const ANI_THROW_GRAVITY = -17;

export const ANI_FALL_DURATION = 1000; // milliseconds
export const ANI_FALL_DURATION_EXTENDED = 2000; // milliseconds
export const ANI_FALL_GRAVITY = -17;

const ANI_FPS = 30;
const LOOMBALL_MINIMUN_THROW_FORCE = 0.04;

// state NONE | =====================================================

export const controllerNone: iStateController = { }

// state GRABBABLE | =====================================================

export const controllerGrabbable: iStateController = {
  onPointerDown: (stt, pi) => {
    if (!stt.ballModel) return;
    if (!stt.hitbox) return;

    // check user touched the ball's hitbox

    if (!collidedWithObject(pi, stt.hitbox.name)) return;

    stt.ballPosPrev = stt.ballModel.getAbsolutePosition();
    stt.ballPosPrevLocal = stt.ballModel.position;

    // change state to grabbed

    stt.state = LOOMBALL_STATE.ANI_GRABBED;
    stt.ballTarget = stt.ballModel.getAbsolutePosition();
    stt.cameraCapture.detachControl();
    console.log('grabbed on');
  }
}

// state ANI_GRABBED | =====================================================

export const controllerGrabbed: iStateController = {
  onPointerUp: (stt, _pi) => {
    if (stt.state != LOOMBALL_STATE.ANI_GRABBED) return;
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;

    // return to state returning

    stt.state = LOOMBALL_STATE.ANI_RETURNING;
    stt.ballTarget = stt.ballInitialOrigin.getAbsolutePosition();
    stt.cameraCapture?.attachControl();
    console.log('grabbed off');

    // throw loomball

    console.log("ballDir", stt.ballDir);

    if (stt.ballDir.y > LOOMBALL_MINIMUN_THROW_FORCE){

      console.log("THROW ===========================");
      stt.state = LOOMBALL_STATE.ANI_THROW;

      // config animation

      stt.ballPosInitialLocal = stt.ballPosCurrLocal;
      stt.ballPosInitial = stt.ballPosCurr;
      stt.aniStartTime = new Date().getTime();
      stt.aniEndTime = stt.aniStartTime + ANI_THROW_DURATION;

      // normalized vector

      const norma = Babylon.Vector2.Normalize(new Babylon.Vector2(stt.ballDir.x, stt.ballDir.y));
      throwCalculateSpeeds(stt, Math.atan2(norma.y, norma.x));

      return;
    }
  },

  onPointerMove: (stt, _pi) => {
    if (!stt.sceneCapture) return;
    if (!stt.ballModel) return;

    // get pointer position in plane

    const pickinfo = stt.sceneCapture.pick(
      stt.sceneCapture.pointerX,
      stt.sceneCapture.pointerY,
      (mesh) => {
        return mesh == stt.scratchPad;
      }
    );

    // pointer outside plane

    if (!pickinfo.hit) {
      if (controllerGrabbed.onPointerUp) controllerGrabbed?.onPointerUp(stt, _pi);
      return;
    }
    if (!pickinfo.pickedPoint) return;

    // set target
    //console.log("direction", stt.ballDir);
    //console.log("Here we are again");
    stt.ballTarget = pickinfo.pickedPoint;
  },

  frame: (stt) => {
    if (!stt.ballModel) return;
    const absolutePos = stt.ballModel.getAbsolutePosition();

    // set global positions
    stt.ballPosPrev = stt.ballPosCurr;
    stt.ballPosCurr = Vector3.Lerp(absolutePos, stt.ballTarget, 0.6);

    // get local position
    stt.ballModel.setAbsolutePosition(stt.ballPosCurr)
    stt.ballPosCurrLocal = stt.ballModel.position;

    // calculate direction based on local positions
    stt.ballDir = stt.ballPosCurrLocal.subtract(stt.ballPosPrevLocal);
    stt.ballPosPrevLocal = stt.ballPosCurrLocal.clone();
  }
}

// state ANI_RETURNING | =====================================================

export const controllerReturning: iStateController = {
  frame: (stt) => {
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;

    const absolutePos = stt.ballModel.getAbsolutePosition();
    stt.ballTarget = stt.ballInitialOrigin.getAbsolutePosition();

    // merge if too close

    if (Vector3.Distance(stt.ballTarget, absolutePos) < 0.01){
      stt.state = LOOMBALL_STATE.GRABBABLE;
      stt.ballModel.setAbsolutePosition(stt.ballTarget);
      console.log("Arrived");
    }

    controllerGrabbed.frame && controllerGrabbed.frame(stt);
  }
}

// state ANI_THROW | =====================================================

export const controllerThrow: iStateController = {
  frame: (stt) => {
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;
    if (!stt.loomieModel) return;
    
    // did it ended already?

    if ((new Date()).getTime() > stt.aniEndTime){
      // DEBUG: set state to returning
      //stt.state = LOOMBALL_STATE.ANI_RETURNING;
      //stt.ballTarget = stt.ballInitialOrigin.getAbsolutePosition();

      // set state to fall
      stt.state = LOOMBALL_STATE.ANI_FALL;

      // config animation

      //stt.ballPosInitialLocal = stt.ballPosCurrLocal;
      stt.ballPosCurr = stt.ballModel.getAbsolutePosition();
      stt.ballPosInitial = new Vector3(0, stt.ballPosCurr.y, 0);
      stt.aniStartTime = new Date().getTime();
      stt.aniEndTime = stt.aniStartTime + ANI_FALL_DURATION_EXTENDED;

      fallCalculateSpeeds(stt);

      // expode Loomie

      instantiatedEntriesScale(stt.loomieModel, Vector3.Zero());

      return;
    }

    // local x, z position
    const posCal = aniThrowCalculatePosition(stt);
    stt.ballModel.position = new Vector3(posCal.x, 0, posCal.z);

    // absolute y position
    const posAbs = stt.ballModel.getAbsolutePosition();
    posAbs.y = posCal.y;
    stt.ballModel.setAbsolutePosition(posAbs);

    stt.ballPosCurr = stt.ballModel.getAbsolutePosition();
    stt.ballPosCurrLocal = stt.ballModel.position;
  }
}

// state ANI_FALL | =====================================================

export const controllerFall: iStateController = {
  frame: (stt) => {
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;
    
    // did it ended already?

    if ((new Date()).getTime() > stt.aniEndTime){
      stt.state = LOOMBALL_STATE.ANI_RETURNING;
      stt.ballTarget = stt.ballInitialOrigin.getAbsolutePosition();
    }

    const posCal = fallCalculatePosition(stt);

    // keep it above the floor
    posCal.y = Math.max(LOOMBALL_RADIUS, posCal.y);

    // absolute y position
    stt.ballModel.setAbsolutePosition(posCal);

    stt.ballPosCurr = stt.ballModel.getAbsolutePosition();
    stt.ballPosCurrLocal = stt.ballModel.position;
  }
}
