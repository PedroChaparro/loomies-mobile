/*
 * animations:
 *
 * Every animation is one object, each object can implement certain events
 * which will be triggered by the Babylon engine.
 */

import * as Babylon from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core';
import { instantiatedEntriesScale } from '../Map3D/utilsVertex';
import { LOOMBALL_STATE } from './CaptureLoomie3D';
import {
  aniThrowCalculatePosition,
  throwCalculateSpeeds,
  collidedWithObject,
  fallCalculateSpeeds,
  fallCalculatePosition,
  attemptToCatch,
  returningCalculatePosition
} from './utilsAnimations';
import { iAniState } from './CaptureSM';

export interface iStateController {
  setup?: (_state: iAniState) => void;
  onPointerDown?: (
    _state: iAniState,
    _pointerInfo: Babylon.PointerInfo
  ) => void;
  onPointerUp?: (_state: iAniState, _pointerInfo: Babylon.PointerInfo) => void;
  onPointerMove?: (
    _state: iAniState,
    _pointerInfo: Babylon.PointerInfo
  ) => void;
  frame?: (_state: iAniState) => void;
}

// control constants

const LOOMBALL_CAMERA_DISTANCE = 2;
const LOOMBALL_RADIUS = 0.2;

export const LOOMBALL_SPAWN_POS = new Vector3(0, -2, LOOMBALL_CAMERA_DISTANCE);
export const LOOMBALL_INITIAL_STATE = LOOMBALL_STATE.ANI_RETURNING;

// animation constants

export const ANI_RETURNING_DURATION = 500; // milliseconds

export const ANI_THROW_DURATION = 500; // milliseconds
export const ANI_THROW_GRAVITY = -17;

export const ANI_FALL_DURATION = 1000; // milliseconds
export const ANI_FALL_DURATION_EXTENDED = 2000; // milliseconds
export const ANI_FALL_GRAVITY = -17;

const LOOMBALL_MINIMUN_THROW_FORCE = 0.04;

// state NONE | =====================================================

export const controllerNone: iStateController = {};

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

    stt.setBallState(LOOMBALL_STATE.ANI_GRABBED);
    stt.ballTarget = stt.ballModel.getAbsolutePosition();
    stt.cameraCapture.detachControl();
  }
};

// state ANI_GRABBED | =====================================================

export const controllerGrabbed: iStateController = {
  onPointerUp: (stt, _pi) => {
    if (stt.state != LOOMBALL_STATE.ANI_GRABBED) return;
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;
    if (!stt.ballDummy) return;
    if (!stt.cameraDummy) return;

    // return to state returning

    controllerReturning.setup && controllerReturning.setup(stt);
    stt.setBallState(LOOMBALL_STATE.ANI_RETURNING);
    stt.ballTarget = stt.ballInitialOrigin.getAbsolutePosition();
    stt.cameraCapture?.attachControl();

    // throw loomball

    if (stt.ballDir.y > LOOMBALL_MINIMUN_THROW_FORCE) {
      stt.setBallState(LOOMBALL_STATE.ANI_THROW);

      // config animation
      // use dummy camera

      const camera = stt.cameraCapture as Babylon.ArcRotateCamera;
      stt.cameraDummy.setAbsolutePosition(camera.globalPosition);
      stt.cameraDummy.lookAt(Vector3.Zero());

      // use dummy ball position

      const ballAbsPos = stt.ballDummy.getAbsolutePosition();
      stt.ballModel.parent = stt.cameraDummy;

      stt.ballPosCurrLocal = stt.ballDummy.position;
      stt.ballPosCurr = ballAbsPos;

      // setup animation initial parameters

      stt.ballPosInitialLocal = stt.ballPosCurrLocal;
      stt.ballPosInitial = stt.ballPosCurr;
      stt.aniStartTime = new Date().getTime();
      stt.aniEndTime = stt.aniStartTime + ANI_THROW_DURATION;

      // normalized vector

      const norma = Babylon.Vector2.Normalize(
        new Babylon.Vector2(stt.ballDir.x, stt.ballDir.y)
      );
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
      if (controllerGrabbed.onPointerUp)
        controllerGrabbed?.onPointerUp(stt, _pi);
      return;
    }
    if (!pickinfo.pickedPoint) return;

    // set target
    stt.ballTarget = pickinfo.pickedPoint;
  },

  frame: (stt) => {
    if (!stt.ballModel) return;
    if (!stt.ballDummy) return;
    if (!stt.cameraDummy) return;

    const absolutePos = stt.ballModel.getAbsolutePosition();

    // set global positions
    stt.ballPosPrev = stt.ballPosCurr;
    stt.ballPosCurr = Vector3.Lerp(absolutePos, stt.ballTarget, 0.6);

    // get local position
    stt.ballModel.setAbsolutePosition(stt.ballPosCurr);
    stt.ballPosCurrLocal = stt.ballModel.position;

    // calculate direction based on local positions
    stt.ballDir = stt.ballPosCurrLocal.subtract(stt.ballPosPrevLocal);
    stt.ballPosPrevLocal = stt.ballPosCurrLocal.clone();

    // update dummy objects
    stt.cameraDummy.setAbsolutePosition(
      (stt.cameraCapture as Babylon.ArcRotateCamera).globalPosition
    );
    stt.cameraDummy.lookAt(Vector3.Zero());
    stt.ballDummy.setAbsolutePosition(stt.ballPosCurr);
  }
};

// state ANI_RETURNING | =====================================================

export const controllerReturning: iStateController = {
  setup: (stt) => {
    if (!stt.ballModel) return;

    stt.aniStartTime = new Date().getTime();
    stt.aniEndTime = stt.aniStartTime + ANI_RETURNING_DURATION;
    stt.ballPosInitialLocal = stt.ballModel.position;
  },
  frame: (stt) => {
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;

    stt.ballTarget = stt.ballInitialOrigin.position;

    // merge if too close

    if (new Date().getTime() > stt.aniEndTime) {
      stt.setBallState(LOOMBALL_STATE.GRABBABLE);
      stt.ballModel.position = new Vector3().copyFrom(stt.ballTarget);

      return;
    }

    stt.ballModel.position = returningCalculatePosition(stt);
  }
};

// state ANI_THROW | =====================================================

export const controllerThrow: iStateController = {
  frame: (stt) => {
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;
    if (!stt.loomieModel) return;

    // did it ended already?

    if (new Date().getTime() > stt.aniEndTime) {
      // DEBUG: set state to returning
      //controllerReturning.setup && controllerReturning.setup(stt);
      //stt.state = LOOMBALL_STATE.ANI_RETURNING;
      //stt.ballTarget = stt.ballInitialOrigin.getAbsolutePosition();

      // set state to fall
      stt.setBallState(LOOMBALL_STATE.ANI_FALL);

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
};

// state ANI_FALL | =====================================================

export const controllerFall: iStateController = {
  frame: (stt) => {
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;

    // did it ended already?

    if (new Date().getTime() > stt.aniEndTime) {
      // try to capture

      stt.setBallState(LOOMBALL_STATE.NONE);
      attemptToCatch(stt);
    }

    const posCal = fallCalculatePosition(stt);

    // keep it above the floor
    posCal.y = Math.max(LOOMBALL_RADIUS, posCal.y);

    // absolute y position
    stt.ballModel.setAbsolutePosition(posCal);

    stt.ballPosCurr = stt.ballModel.getAbsolutePosition();
    stt.ballPosCurrLocal = stt.ballModel.position;
  }
};

// state ANI_ESCAPED | =====================================================

export const controllerEscaped: iStateController = {
  frame: (stt) => {
    if (!stt.ballModel) return;
    if (!stt.loomieModel) return;

    // reset loomball hierarchy and move to spawn point
    // TODO: Use new Loomball model

    stt.ballModel.parent = stt.cameraCapture;
    stt.ballModel.position = new Babylon.Vector3().copyFrom(LOOMBALL_SPAWN_POS);
    controllerReturning.setup && controllerReturning.setup(stt);
    stt.setBallState(LOOMBALL_STATE.ANI_RETURNING);

    // restore Loomie visibility

    instantiatedEntriesScale(stt.loomieModel, Vector3.One());
  }
};
