import * as Babylon from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core';
import { LOOMBALL_STATE } from "./CaptureLoomie3D";
import { iAniState } from "./utilsCapture";

export interface iStateController {
  onPointerDown?: (_state: iAniState, _pointerInfo: Babylon.PointerInfo) => void;
  onPointerUp?: (_state: iAniState, _pointerInfo: Babylon.PointerInfo) => void;
  onPointerMove?: (_state: iAniState, _pointerInfo: Babylon.PointerInfo) => void;
  frame?: (_state: iAniState) => void;
}

// state none

export const controllerNone: iStateController = { }

export const controllerGrabbable: iStateController = {
  onPointerDown: (stt, pi) => {
    if (!stt.ballModel) return;
    if (!stt.hitbox) return;
    console.log("Flag 1");

    // check it collided with something

    if (!collidedWithObject(pi, stt.hitbox.name)) return;
    console.log("DOWN DOWN DOWN DOWN DOWN DOWN");
    console.log("Flag 2");


    if (stt.state != LOOMBALL_STATE.GRABBABLE) return;

    console.log('grabbed on');
    stt.ballPosPrev = stt.ballModel.getAbsolutePosition();
    stt.ballPosPrevLocal = stt.ballModel.position;
    console.log("Flag 3");

    // change state to grabbed

    stt.state = LOOMBALL_STATE.ANI_GRABBED;
    stt.ballTarget = stt.ballModel.getAbsolutePosition();

    stt.cameraCapture.detachControl();
  }
}

export const controllerGrabbed: iStateController = {
  onPointerDown: (_stt, _pi) => {
    return;
  },

  onPointerUp: (stt, _pi) => {
    if (stt.state != LOOMBALL_STATE.ANI_GRABBED) return;
    if (!stt.ballInitialOrigin) return;
    if (!stt.ballModel) return;

    console.log('grabbed off');
    stt.state = LOOMBALL_STATE.ANI_RETURNING;
    stt.ballTarget = stt.ballInitialOrigin.getAbsolutePosition();

    stt.cameraCapture?.attachControl();

    // throw loomball

    //console.log("ballDir", ballDir.current);

    //if (ballDir.current.y > LOOMBALL_MINIMUN_THROW_FORCE){

      //console.log("THROW ===========================");
      //setBallState(LOOMBALL_STATE.ANI_THROW);

      //// set animation

      //ballPosInitialLocal.current = ballPosCurrLocal.current;
      //ballPosInitial.current = ballPosCurr.current;
      //aniStartTime.current = new Date().getTime();
      //aniEndTime.current = aniStartTime.current + ANI_THROW_DURATION;

      //// normalized vector

      //const norma = Babylon.Vector2.Normalize(new Babylon.Vector2(ballDir.current.x, ballDir.current.y));
      ////const norma = Babylon.Vector2.Normalize(new Babylon.Vector2(modelBall.position.x, -modelBall.position.y));

      ////console.log(new Babylon.Vector2(modelBall.position.y, modelBall.position.x));

      //calculateSpeeds(Math.atan2(norma.y, norma.x));
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
    //console.log("direction", ballDir.current);
    console.log("Here we are again");
    stt.ballTarget = pickinfo.pickedPoint;
  },

  frame: (stt) => {
    console.log("Log me in");
    if (!stt.ballModel) return;
    const absolutePos = stt.ballModel.getAbsolutePosition();

    stt.ballPosPrev = absolutePos;
    stt.ballPosPrevLocal = stt.ballModel.position;

    stt.ballPosCurr = Vector3.Lerp(absolutePos, stt.ballTarget, 0.6);
    stt.ballModel.setAbsolutePosition(stt.ballPosCurr)

    stt.ballPosCurrLocal = stt.ballModel.position;

    console.log(stt.ballPosCurrLocal);
    console.log(stt.ballPosPrevLocal);
    stt.ballDir = stt.ballPosCurrLocal.subtract(stt.ballPosPrevLocal);
  }
}

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

export const collidedWithObject = (pointerInfo: Babylon.PointerInfo, objName: string): boolean => {
  if (
    pointerInfo.pickInfo &&
    pointerInfo.pickInfo.hit &&
    pointerInfo.pickInfo.pickedMesh?.name == objName
  ) {
    console.log(
      'Info: Pressed',
      pointerInfo.pickInfo.pickedMesh?.name
    );

    return true;
  }

  return false;
}
