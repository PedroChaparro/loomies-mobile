/*
 * Combat3D:
 *
 * It's a middle man between the Babylon engine and the State Machine
 * It syncs the events running in the Babylon engine with those of the SM
 */

import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';
import { SafeAreaView, View } from 'react-native';
import { EngineView } from '@babylonjs/react-native';

import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModelContext } from '@src/context/ModelProvider';
import { useRegisterBeforeRender } from '@src/hooks/useRegisterBeforeRender';

import { CONFIG } from '@src/services/config.services';
import { MapContext } from '@src/context/MapProvider';
import { CombatSM } from './CombatSM';
import { iLoomie } from '@src/types/combatInterfaces';
const { MAP_DEBUG } = CONFIG;

interface iPropsCombat3D {
  loomieUser: iLoomie;
  loomieGym: iLoomie;
}

export interface iRefCombat3D {
  updateUserAnimation: (_ani: COMBAT_LOOMIE_STATE) => void;
  updateGymAnimation: (_ani: COMBAT_LOOMIE_STATE) => void;
}

export const enum COMBAT_LOOMIE_STATE {
  NONE,
  DEAD,
  ATTACK,
  DODGE
}

export const Combat3D = forwardRef<iRefCombat3D, iPropsCombat3D>(
  (props, ref) => {
    const { sceneCombat, cameraCombat, getCurrentScene, showScene } =
      useContext(BabylonContext);

    const babylonContext = useContext(BabylonContext);
    const modelContext = useContext(ModelContext);
    const mapContext = useContext(MapContext);

    // stores the animation state
    const stateMachine = useRef<CombatSM | null>(null);

    // exported methods
    useImperativeHandle(ref, () => ({
      updateUserAnimation: (ani: COMBAT_LOOMIE_STATE) => {
        console.log(ani);
      },
      updateGymAnimation: (ani: COMBAT_LOOMIE_STATE) => {
        console.log(ani);
      }
    }));

    // frame

    useRegisterBeforeRender(
      sceneCombat,
      () => {
        if (!stateMachine.current) return;
      },
      stateMachine.current?.stt.loomieUser.state &&
        stateMachine.current?.stt.loomieGym.state
        ? stateMachine.current.stt.loomieUser.state.toString() +
            stateMachine.current.stt.loomieUser.state.toString()
        : undefined
    );

    // create / update state machine

    useEffect(() => {
      if (!sceneCombat) return;
      if (!cameraCombat) return;
      if (getCurrentScene() !== APP_SCENE.COMBAT) return;

      // create scene
      if (!stateMachine.current) {
        stateMachine.current = new CombatSM(
          sceneCombat,
          cameraCombat,
          babylonContext,
          modelContext,
          mapContext,

          props.loomieUser,
          props.loomieGym
        );

        stateMachine.current.setup();
      }

      // update
      else {
        console.log('Info: Updating SM props');
        stateMachine.current.updateProps(
          sceneCombat,
          cameraCombat,
          babylonContext,
          modelContext,
          mapContext,

          props.loomieUser,
          props.loomieGym
        );
      }

      return () => {
        // destroy everything
      };
    }, [
      sceneCombat,
      cameraCombat,
      babylonContext,
      modelContext,
      mapContext,

      // state
      props.loomieUser.serial,
      props.loomieGym.serial
    ]);

    // toggle scene

    useEffect(() => {
      showScene(APP_SCENE.COMBAT);
    }, []);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={{ flex: 1 }}>
          {getCurrentScene() == APP_SCENE.COMBAT && (
            <>
              <EngineView camera={cameraCombat} displayFrameRate={MAP_DEBUG} />
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }
);
Combat3D.displayName = 'CombatFloatingMessage';
