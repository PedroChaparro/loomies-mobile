import React, { useEffect, useRef, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/core';
import { View, SafeAreaView } from 'react-native';
import useWebSocket, { ReadyState } from 'react-use-websocket';

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
  iPayload_UPDATE_PLAYER_LOOMIE,
  iPayload_GYM_LOOMIE_WEAKENED,
  iPayload_USER_LOOMIE_WEAKENED,
  iPayload_USER_ITEM_USED,
  iPayload_ERROR_USING_ITEM,
  iPayload_LOOMIES_TEAM
} from '@src/types/combatInterfaces';
import { useToastAlert } from '@src/hooks/useToastAlert';
import { delay } from '@src/utils/delay';
import { Combat3D } from '@src/components/Combat/Combat3D/Combat3D';
const { WS_URL } = CONFIG;

export interface iDisplayMessage {
  id: number;
  message: string;
  direction: boolean;
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

export const CombatView = ({ route }: iCombatViewProps) => {
  // util

  const { showInfoToast, showErrorToast } = useToastAlert();

  // web socket

  const url = `${WS_URL}/combat?token=${route.params.combatToken}`;
  const { sendMessage, lastMessage, readyState } = useWebSocket(url);

  // state

  const [loomiePlayer, setLoomiePlayer] = useState<iLoomie>();
  const [loomieTeamPlayer, setLoomieTeamPlayer] = useState<iLoomie[]>();
  const [loomieGym, setLoomieGym] = useState<iLoomie>();
  const [gymLoomiesLeft, setGymLoomiesLeft] = useState<number>(0);
  const [userLoomiesLeft, setUserLoomiesLeft] = useState<number>(0);

  // display message queue

  const displayMessageQueue = useRef<iDisplayMessage[]>([]);
  const [queueUpdated, setQueueUpdated] = useState<number>(0);

  // modals

  const [modalLooseVisible, setModalLooseVisible] = useState<boolean>(false);
  const [modalWinVisible, setModalWinVisible] = useState<boolean>(false);
  const [modalItemVisible, setModalItemVisible] = useState<boolean>(false);
  const [modalLoomiesTeamVisible, setModalLoomiesTeamVisible] =
    useState<boolean>(false);
  const modalLooseToggle = (open?: boolean) => {
    if (open != undefined) setModalLooseVisible(open);
    else setModalLooseVisible((value) => !value);
  };
  const modalWinToggle = (open?: boolean) => {
    if (open != undefined) setModalWinVisible(open);
    else setModalWinVisible((value) => !value);
  };
  const modalItemToggle = (open?: boolean) => {
    if (open != undefined) {
      setModalItemVisible(open);
    } else setModalItemVisible((value) => !value);
  };
  const modalLoomiesTeamToggle = (open?: boolean) => {
    if (open != undefined) {
      setModalLoomiesTeamVisible(open);
    } else setModalLoomiesTeamVisible((value) => !value);
  };

  const modalCloseAll = () => {
    modalLooseToggle(false);
    modalWinToggle(false);
    modalItemToggle(false);
  };

  // make sure we have workable parameters

  useEffect(() => {
    if (!route.params.gym || !route.params.combatToken) navigate('Map', null);
  }, []);

  // connection closed

  useEffect(() => {
    if (readyState == ReadyState.CLOSED) {
      // it's a disconnection and not a normal ending

      if (!(modalLooseVisible || modalWinVisible)) {
        showErrorToast('Connection lost');
        exitCombat();
      }
    }
  }, [readyState]);

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

    const messageType = data.type as keyof typeof TYPE;
    switch (TYPE[messageType]) {
      // initial state

      case TYPE.start:
        {
          if ((data.payload as iPayload_START) === undefined) return;
          const payload = data.payload as iPayload_START;

          // update loomies

          setLoomieGym(payload.gym_loomie);
          setLoomiePlayer(payload.player_loomie);

          // update loomies left

          setGymLoomiesLeft(payload.alive_gym_loomies);
          setUserLoomiesLeft(payload.alive_user_loomies);
        }
        break;

      // update user hp

      case TYPE.UPDATE_USER_LOOMIE_HP:
        {
          if ((data.payload as iPayload_UPDATE_USER_LOOMIE_HP) === undefined)
            return;
          const payload = data.payload as iPayload_UPDATE_USER_LOOMIE_HP;

          setLoomiePlayer((loomie) => {
            if (loomie) {
              // queue display message

              if (payload.damage > 0)
                queueMessage(
                  payload.was_critical
                    ? `-${payload.damage} Effective attack!`
                    : `-${payload.damage}`,
                  false
                );

              // update hp

              loomie.hp = payload.hp;
              return { ...loomie, boosted_hp: payload.hp };
            }
          });
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
              // queue display message

              if (payload.damage > 0)
                queueMessage(
                  payload.was_critical
                    ? `-${payload.damage} Effective attack!`
                    : `-${payload.damage}`,
                  true
                );

              // update hp

              loomie.hp = payload.hp;
              return { ...loomie, boosted_hp: payload.hp };
            }
          });
        }
        break;

      // update user/gym loomies

      case TYPE.UPDATE_USER_LOOMIE:
        {
          if ((data.payload as iPayload_UPDATE_PLAYER_LOOMIE) === undefined)
            return;
          const payload = data.payload as iPayload_UPDATE_PLAYER_LOOMIE;

          setLoomiePlayer(payload.loomie);
        }
        break;

      // update gym loomie

      case TYPE.UPDATE_GYM_LOOMIE:
        {
          if ((data.payload as iPayload_UPDATE_PLAYER_LOOMIE) === undefined)
            return;
          const payload = data.payload as iPayload_UPDATE_PLAYER_LOOMIE;

          setLoomieGym(payload.loomie);
        }
        break;

      // loomie weakened

      case TYPE.GYM_LOOMIE_WEAKENED:
        {
          if ((data.payload as iPayload_GYM_LOOMIE_WEAKENED) === undefined)
            return;
          const payload = data.payload as iPayload_GYM_LOOMIE_WEAKENED;

          setGymLoomiesLeft(payload.alive_gym_loomies);
          queueMessage(`-${payload.damage} Enemy fainted!`, true);

          // set hp to zero and hide model

          setLoomieGym((loomie) => {
            if (loomie) {
              // update hp
              loomie.boosted_hp = 0;

              // make serial invalid to hide model
              loomie.serial = -1;

              return loomie;
            }
          });
        }
        break;

      case TYPE.USER_LOOMIE_WEAKENED:
        {
          if ((data.payload as iPayload_USER_LOOMIE_WEAKENED) === undefined)
            return;
          const payload = data.payload as iPayload_USER_LOOMIE_WEAKENED;

          setUserLoomiesLeft(payload.alive_user_loomies);
          queueMessage(`-${payload.damage} Loomie fainted!`, false);

          // set hp to zero and hide model

          setLoomiePlayer((loomie) => {
            if (loomie) {
              // update hp
              loomie.boosted_hp = 0;

              // make serial invalid to hide model
              loomie.serial = -1;

              return loomie;
            }
          });
        }
        break;

      // attack dodged

      case TYPE.GYM_ATTACK_CANDIDATE:
        {
          queueMessage('Attack incoming', true);
        }
        break;

      case TYPE.GYM_ATTACK_DODGED:
        {
          queueMessage('Dodged', false);
        }
        break;

      case TYPE.USER_ATTACK_DODGED:
        {
          queueMessage('Dodged', true);
        }
        break;

      // win / loose

      case TYPE.USER_HAS_WON:
        {
          setGymLoomiesLeft(0);
          setLoomieGym((loomie) => {
            if (loomie) return { ...loomie, boosted_hp: 0 };
          });

          modalCloseAll();
          modalWinToggle(true);
          queueMessage('You win', false);
        }
        break;

      case TYPE.USER_HAS_LOST:
        {
          setUserLoomiesLeft(0);
          setLoomiePlayer((loomie) => {
            if (loomie) return { ...loomie, boosted_hp: 0 };
          });

          modalCloseAll();
          modalLooseToggle(true);
          queueMessage('You have lost', false);
        }
        break;

      // items

      case TYPE.USER_ITEM_USED:
        {
          if ((data.payload as iPayload_USER_ITEM_USED) === undefined) return;
          const payload = data.payload as iPayload_USER_ITEM_USED;
          let message = '';

          switch (payload.item_serial) {
            case 1:
            case 2:
            case 3: // health items
              message = `Loomie healed`;
              break;
            case 4: // defibrillator
              message = 'Loomie revived!';
              break;
            case 5: // steroids
              message = `Attack boosted`;
              break;
            case 6: // vitamins
              message = `Max health boosted`;
              break;
            case 7: // uknown beverage
              message = `Level up`;
              break;
          }

          queueMessage(message, false);
        }
        break;

      case TYPE.ERROR_USING_ITEM:
        {
          if ((data.payload as iPayload_ERROR_USING_ITEM) === undefined) return;
          const payload = data.payload as iPayload_ERROR_USING_ITEM;

          switch (payload.error_reason) {
            case 'USER_ALREADY_HEALED':
              queueMessage('Loomie already healed', false);
              break;
            case 'USER_NOT_WEAKENED':
              queueMessage('Selected Loomie is not weakened', false);
              break;
          }
        }
        break;

      // update gym loomie

      case TYPE.USER_LOOMIE_TEAM:
        {
          if ((data.payload as iPayload_LOOMIES_TEAM) === undefined) return;
          const payload = data.payload as iPayload_LOOMIES_TEAM;
          setLoomieTeamPlayer(payload.loomies);
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
    sendMessage(message, false);
  };

  const userDodge = (_direction: boolean) => {
    const message = JSON.stringify({
      type: TYPE[TYPE.USER_DODGE] as string
    });
    sendMessage(message, false);
  };

  const userEscape = () => {
    const message = JSON.stringify({
      type: TYPE[TYPE.USER_ESCAPE_COMBAT] as string
    });

    // send multiple

    sendMessage(message, true);
    sendMessage(message, true);
    sendMessage(message, true);

    // await before exiting

    (async () => {
      await delay(1000);
      showInfoToast('Combat has ended');
      exitCombat();
    })();
  };

  const userLoomiesTeam = () => {
    const message = JSON.stringify({
      type: TYPE[TYPE.USER_GET_LOOMIE_TEAM] as string
    });
    sendMessage(message, false);
  };

  const changeLoomie = (newLoomie: iLoomie) => {
    if (newLoomie && newLoomie.boosted_hp > 0) {
      const message = JSON.stringify({
        type: TYPE[TYPE.USER_CHANGE_LOOMIE] as string,
        payload: {
          loomie_id: newLoomie._id
        }
      });

      sendMessage(message, true);
    } else {
      queueMessage('Loomie is Weakened', false);
    }
  };

  const exitCombat = () => {
    navigate('Map', null);
  };

  // display message queue

  const queueMessage = (message: string, direction: boolean) => {
    let currentId = 0;

    // increase ids
    setQueueUpdated((count) => {
      currentId = count + 1;
      return currentId;
    });

    // push
    displayMessageQueue.current.push({
      id: currentId,
      message: message,
      direction: direction
    });
  };

  const getMessageQueue = (): iDisplayMessage[] => displayMessageQueue.current;
  const removeMessageFromQueue = (deletedIds: number[]) => {
    // filter deleted ids

    displayMessageQueue.current = displayMessageQueue.current.filter((msg) => {
      return (
        undefined ==
        deletedIds.find((id) => {
          return id == msg.id;
        })
      );
    });
  };

  // use item

  const applyItem = (itemid: string) => {
    const message = JSON.stringify({
      type: TYPE[TYPE.USER_USE_ITEM] as string,
      payload: {
        item_id: itemid
      }
    });

    sendMessage(message, true);
  };

  return (
    <>
      {/* 3D scene */}

      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={{ flex: 1 }}>
          {loomiePlayer && loomieGym && (
            <Combat3D loomieUser={loomiePlayer} loomieGym={loomieGym} />
          )}
        </View>
      </SafeAreaView>

      {/* UI */}

      {loomiePlayer && loomieGym && (
        <CombatUI
          // state
          gym={route.params.gym}
          loomiePlayer={loomiePlayer}
          loomieGym={loomieGym}
          gymLoomiesLeft={gymLoomiesLeft}
          userLoomiesLeft={userLoomiesLeft}
          // signals
          inputAttack={userAttack}
          inputDodge={userDodge}
          inputEscape={userEscape}
          // loose modal
          modalLooseVisible={modalLooseVisible}
          modalLooseCallback={() => {
            showInfoToast('Combat has ended');
            exitCombat();
          }}
          // win modal
          modalWinVisible={modalWinVisible}
          modalWinCallback={() => {
            showInfoToast('Combat has ended');
            exitCombat();
          }}
          // use item modal
          modalItemVisible={modalItemVisible}
          modalItemToggle={() => modalItemToggle()}
          modalItemCallback={applyItem}
          // display message
          queueMessage={queueMessage}
          queueUpdated={queueUpdated}
          getMessageQueue={getMessageQueue}
          removeMessageFromQueue={removeMessageFromQueue}
          //Modal loomie team
          modalLoomiesTeamVisible={modalLoomiesTeamVisible}
          modalLoomiesTeamToggle={() => modalLoomiesTeamToggle()}
          getUserLoomiesTeam={userLoomiesTeam}
          changeLoomie={changeLoomie}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          loomieTeamPlayer={loomieTeamPlayer!}
        />
      )}
    </>
  );
};
