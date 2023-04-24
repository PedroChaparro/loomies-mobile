import React, { useEffect, useRef, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/core';
import { View, Text, SafeAreaView } from 'react-native';
import useWebSocket from 'react-use-websocket';

import { CombatUI } from '@src/components/Combat/CombatUI';
import { navigate } from '@src/navigation/RootNavigation';
import { TGymInfo } from '@src/types/types';
import { CONFIG } from '@src/services/config.services';
import {
  iCombatMessage,
  iPayload_START,
  iPayload_UPDATE_USER_LOOMIE_HP,
  iLoomie,
  TYPE,
  iPayload_UPDATE_PLAYER_LOOMIE
} from '@src/types/combatInterfaces';
const { WS_URL } = CONFIG;

interface iPayload {
  type: string;
  message: string;
  payload: any;
}

export interface iDisplayMessage {
  id: number;
  message: string;
}

export interface iCombatViewParams {
  gym: TGymInfo;
  combatToken: string;
}

interface iCombatViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _navigation?: NavigationProp<any, any>;
  route: RouteProp<{ params: iCombatViewParams }, 'params'>;
}

export const CombatView = ({ _navigation, route }: iCombatViewProps) => {
  // web socket
  const url = `${WS_URL}/combat?token=${route.params.combatToken}`;
  const { sendMessage, lastMessage, readyState } = useWebSocket(url);

  // state
  const [loomiePlayer, setLoomiePlayer] = useState<iLoomie>();
  const [loomieGym, setLoomieGym] = useState<iLoomie>();

  // display message queue
  const displayMessageQueue = useRef<iDisplayMessage[]>([]);
  const [queueUpdated, setQueueUpdated] = useState<number>(0);

  useEffect(() => {
    // make sure we have workable parameters
    if (!route.params.gym || !route.params.combatToken) navigate('Map', null);
    console.log(url);
  }, []);

  // receive message

  useEffect(() => {
    if (!lastMessage?.data) return;

    // cast check

    let rawData: object = {};

    try {
      rawData = JSON.parse(lastMessage?.data);
    } catch (error) {
      console.log(error);
      return;
    }

    // get object

    if ((rawData as iCombatMessage) === undefined) return;
    const data = rawData as iCombatMessage;
    console.log(data.type);
    console.log(data.payload);

    queueMessage(data.type);

    const messageType = data.type as keyof typeof TYPE;
    switch (TYPE[messageType]) {
      // initial state

      case TYPE.start:
        {
          if ((data.payload as iPayload_START) === undefined) return;
          const payload = data.payload as iPayload_START;

          console.log('start start start');
          console.log(payload.gym);

          setLoomieGym({ ...payload.gym, hp: payload.gym.boosted_hp });
          setLoomiePlayer({ ...payload.player, hp: payload.player.boosted_hp });
        }
        break;

      // update user hp

      case TYPE.UPDATE_USER_LOOMIE_HP:
        {
          if ((data.payload as iPayload_UPDATE_USER_LOOMIE_HP) === undefined)
            return;
          const payload = data.payload as iPayload_UPDATE_USER_LOOMIE_HP;

          console.log(payload.hp);

          setLoomiePlayer((loomie) => {
            if (loomie) {
              loomie.hp = payload.hp;
              return { ...loomie, hp: payload.hp };
            }
          });
        }
        break;

      // update user loomie

      case TYPE.UPDATE_PLAYER_LOOMIE:
        {
          if ((data.payload as iPayload_UPDATE_PLAYER_LOOMIE) === undefined)
            return;
          const payload = data.payload as iPayload_UPDATE_PLAYER_LOOMIE;

          setLoomiePlayer({ ...payload.loomie, hp: payload.loomie.boosted_hp });
        }
        break;

      // update gym hp

      case TYPE.UPDATE_GYM_LOOMIE_HP:
        {
          if ((data.payload as iPayload_UPDATE_USER_LOOMIE_HP) === undefined)
            return;
          const payload = data.payload as iPayload_UPDATE_USER_LOOMIE_HP;

          setLoomieGym((loomie) => {
            if (loomie) {
              loomie.hp = payload.hp;
              return { ...loomie, hp: payload.hp };
            }
          });
        }
        break;

      // update gym loomie

      case TYPE.UPDATE_GYM_LOOMIE:
        {
          if ((data.payload as iPayload_UPDATE_PLAYER_LOOMIE) === undefined)
            return;
          const payload = data.payload as iPayload_UPDATE_PLAYER_LOOMIE;

          setLoomieGym({ ...payload.loomie, hp: payload.loomie.boosted_hp });
        }
        break;

      default:
        console.log(`Warn: Message not recognized ${data.type}`);
        break;
    }
  }, [lastMessage]);

  // user events

  const userAttack = () => {
    const message = JSON.stringify({
      type: TYPE[TYPE.USER_ATTACK] as string
    });

    console.log(message);

    sendMessage(message, false);
  };

  const userDodge = (direction: boolean) => {
    const message = JSON.stringify({
      type: TYPE[TYPE.USER_DODGE] as string
    });

    console.log(message, direction);

    sendMessage(message, false);
  };

  // display message queue

  const queueMessage = (message: string) => {
    let currentId = 0;

    // increase ids
    setQueueUpdated((count) => {
      currentId = count + 1;
      return currentId;
    });

    // push
    displayMessageQueue.current.push({ id: currentId, message: message });
  };

  const getMessageQueue = (): iDisplayMessage[] => displayMessageQueue.current;
  const removeMessageFromQueue = (deletedIds: number[]) => {
    // filter deleted ids

    console.log(deletedIds);

    displayMessageQueue.current = displayMessageQueue.current.filter((msg) => {
      return (
        undefined ==
        deletedIds.find((id) => {
          return id == msg.id;
        })
      );
    });

    // trigger update

    //setQueueUpdated((count) => {
    //return count + 1;
    //});
  };

  return (
    <>
      {/* 3D scene */}

      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={{ flex: 1 }}>
          <Text>3D SCENE HERE</Text>
          {/*getCurrentScene() == APP_SCENE.CAPTURE && (
            <EngineView camera={cameraCapture} displayFrameRate={MAP_DEBUG} />
          )*/}
        </View>
      </SafeAreaView>

      {/* UI */}

      {loomiePlayer && loomieGym && (
        <CombatUI
          gym={route.params.gym}
          loomiePlayer={loomiePlayer}
          loomieGym={loomieGym}
          inputAttack={userAttack}
          inputDodge={userDodge}
          queueUpdated={queueUpdated}
          getMessageQueue={getMessageQueue}
          removeMessageFromQueue={removeMessageFromQueue}
        />
      )}

      <Text>{route.params.gym.name}</Text>
    </>
  );
  //return <Text >Hel</Text>;
};
