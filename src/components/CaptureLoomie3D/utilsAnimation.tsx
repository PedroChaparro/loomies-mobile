import * as Babylon from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core';
import { ANI_FALL_DURATION, ANI_THROW_DURATION, ANI_THROW_GRAVITY } from './animations';
import { iAniState } from './utilsCapture';

export const collidedWithObject = (
  pointerInfo: Babylon.PointerInfo,
  objName: string
): boolean => {
  if (
    pointerInfo.pickInfo &&
    pointerInfo.pickInfo.hit &&
    pointerInfo.pickInfo.pickedMesh?.name == objName
  ) {
    console.log('Info: Pressed', pointerInfo.pickInfo.pickedMesh?.name);

    return true;
  }

  return false;
};

// throw animation

export const throwCalculateSpeeds = (stt: iAniState, angle: number) => {
  if (!stt.ballModel) return;
  if (!stt.loomieModel) return;

  // parabolic movement in y

  const t = ANI_THROW_DURATION / 1000;
  const h1 = stt.ballPosInitial.y;
  const h2 = stt.loomieHeight - 0.1;
  const g = ANI_THROW_GRAVITY;

  const vy = (h2 - h1 - (g / 2) * (t * t)) / t;

  // linear movement in z

  const d = Vector3.Distance(stt.ballPosInitial, Vector3.Zero());
  const vz = d / t;

  // parabolic movement in x

  const vx = Math.cos(angle) * 3;
  const a = (2 * (0 - stt.ballPosInitialLocal.x - vx * t)) / (t * t);

  // initial speeds

  stt.ballSpeed = new Vector3(vx, vy, vz);
  stt.ballAcc = new Vector3(a, g, 0);
  console.log('ANGLE', Babylon.Tools.ToDegrees(angle));
};

export const aniThrowCalculatePosition = (stt: iAniState): Babylon.Vector3 => {
  const now = new Date().getTime();
  const delta = (now - stt.aniStartTime) / 1000;

  const x =
    stt.ballPosInitialLocal.x +
    stt.ballSpeed.x * delta +
    (stt.ballAcc.x / 2) * Math.pow(delta, 2);

  const y =
    stt.ballPosInitial.y +
    stt.ballSpeed.y * delta +
    (stt.ballAcc.y / 2) * Math.pow(delta, 2);

  const z = stt.ballPosInitialLocal.z + stt.ballSpeed.z * delta;

  return new Babylon.Vector3(x, y, z);
};

// animation fall

export const fallCalculateSpeeds = (stt: iAniState) => {
  if (!stt.ballModel) return;
  if (!stt.loomieModel) return;

  // parabolic movement in y

  const t = ANI_FALL_DURATION / 1000;
  const h = stt.ballPosInitial.y;
  const vy = 5;

  const g = (2 * (0 - h - vy * t)) / (t * t);

  // initial speeds

  stt.ballSpeed = new Vector3(0, vy, 0);
  stt.ballAcc = new Vector3(0, g, 0);
};

export const fallCalculatePosition = (stt: iAniState): Babylon.Vector3 => {
  const now = new Date().getTime();
  const delta = (now - stt.aniStartTime) / 1000;

  const x =
    stt.ballPosInitial.x +
    stt.ballSpeed.x * delta +
    (stt.ballAcc.x / 2) * Math.pow(delta, 2);

  const y =
    stt.ballPosInitial.y +
    stt.ballSpeed.y * delta +
    (stt.ballAcc.y / 2) * Math.pow(delta, 2);

  const z =
    stt.ballPosInitial.z +
    stt.ballSpeed.z * delta +
    (stt.ballAcc.z / 2) * Math.pow(delta, 2);

  return new Babylon.Vector3(x, y, z);
};
