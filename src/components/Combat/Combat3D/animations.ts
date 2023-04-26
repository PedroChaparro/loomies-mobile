/*
 * animations:
 *
 * Every animation is one object, each object can implement certain events
 * which will be triggered by the Babylon engine.
 */

import * as Babylon from '@babylonjs/core';
import { iAniState } from './CombatSM';

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

// state NONE | =====================================================

export const controllerNone: iStateController = {};
