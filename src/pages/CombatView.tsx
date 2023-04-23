import React, { useEffect, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/core';
import { View, Text, SafeAreaView } from 'react-native';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { CombatUI } from '@src/components/Combat/CombatUI';
import { navigate } from '@src/navigation/RootNavigation';
import { TGymInfo } from '@src/types/types';
import { CONFIG } from '@src/services/config.services';
import { iCombatMessage, iPayload_START, iPayload_UPDATE_USER_LOOMIE_HP, iLoomie, TYPE } from '@src/types/combatInterfaces';
const { WS_URL } = CONFIG;

interface iPayload {
  type: string;
  message: string;
  payload: any;
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

  useEffect(() => {
    // make sure we have workable parameters
    if (!route.params.gym || !route.params.combatToken) navigate('Map');
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

    const messageType = data.type as keyof typeof TYPE;
    switch (TYPE[messageType]) {

      case TYPE.start:{

        if ((data.payload as iPayload_START) === undefined) return;
        const payload = data.payload as iPayload_START;

        console.log("start start start");
        console.log(payload.gym);

        setLoomieGym(payload.gym);
        setLoomiePlayer(payload.player);
      }
      break;

      case TYPE.UPDATE_USER_LOOMIE_HP:{
        if ((data.payload as iPayload_UPDATE_USER_LOOMIE_HP) === undefined) return;
        const payload = data.payload as iPayload_UPDATE_USER_LOOMIE_HP;

        console.log(payload.hp);

        setLoomiePlayer((loomie) => {
          if (loomie) loomie.hp = payload.hp;
          return loomie;
        });
      }
      break;

      default:
        console.log(`Warn: Message not recognized ${data.type}`);
        break;
    }

  }, [lastMessage]);

  const attack = () => {
  }



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

      <CombatUI gym={route.params.gym} loomiePlayer={loomiePlayer} loomieGym={loomieGym}/>

      <Text>{route.params.gym.name}</Text>
    </>
  );
  //return <Text >Hel</Text>;
};
