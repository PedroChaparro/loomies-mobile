import React, { createRef, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  GestureResponderEvent
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { styles } from './combatStyles';
import { Gap } from '../Gap';
import { iLoomie } from '@src/types/combatInterfaces';
import { TGymInfo } from '@src/types/types';
import { CombatLoomieInfo } from './CombatLoomieInfo';
import { iGridPosition } from '@src/context/MapProvider';
import { iDisplayMessage } from '@src/pages/CombatView';
import {
  CombatFloatingMessage,
  iRefCombatFloatingMessage
} from './CombatFloatingMessage';

interface iPropsCombatUI {
  gym: TGymInfo;
  loomiePlayer: iLoomie;
  loomieGym: iLoomie;
  inputAttack: () => void;
  inputDodge: (_direction: boolean) => void;

  queueUpdated: number;
  getMessageQueue: () => iDisplayMessage[];
  removeMessageFromQueue: (_ids: number[]) => void;
}

const GIZMO_SIZE = 30;
const MAX_DISPLAY_MESSAGES = [0, 1, 2, 3];

export const CombatUI = ({
  gym,
  loomiePlayer,
  loomieGym,
  inputAttack,
  inputDodge,

  queueUpdated,
  getMessageQueue,
  removeMessageFromQueue
}: iPropsCombatUI) => {
  // gizmo
  const [gizmoOrigin, setGizmoOrigin] = useState<iGridPosition>({ x: 0, y: 0 });
  const [gizmoIcon, setGizmoIcon] = useState<string>('sword-cross');
  const gizmoOpacity = useRef(new Animated.Value(0));

  // display messages
  const dispMsgs = useRef<(iRefCombatFloatingMessage | null)[]>([]);
  const distMsgIndex = useRef<number>(0);

  const showGizmo = (origin: iGridPosition, icon: string) => {
    // reset

    gizmoOpacity.current.setValue(1);

    setGizmoOrigin({
      x: origin.x - GIZMO_SIZE / 2,
      y: origin.y - GIZMO_SIZE
    });
    setGizmoIcon(icon);

    // start animation

    Animated.parallel([
      Animated.timing(gizmoOpacity.current, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  };

  const touchAttack = (event: GestureResponderEvent) => {
    showGizmo(
      { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY },
      'sword-cross'
    );
    inputAttack();
  };

  const touchDodge = (event: GestureResponderEvent, direction: boolean) => {
    showGizmo(
      { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY },
      'shield-half-full'
    );
    inputDodge(direction);
  };

  // display message

  useEffect(() => {
    // consume all messages

    const consumedIds: number[] = [];
    const msgs = getMessageQueue();

    msgs.forEach((msg) => {
      // display message

      const el =
        dispMsgs.current[distMsgIndex.current % MAX_DISPLAY_MESSAGES.length];
      if (el) el.updateMessage(msg.message);
      distMsgIndex.current += 1;

      // gather ids

      consumedIds.push(msg.id);
    });

    // delete message
    if (consumedIds.length) removeMessageFromQueue(consumedIds);
  }, [queueUpdated]);

  return (
    <View style={styles.container}>
      {/* header */}

      <View style={styles.circle}></View>
      <Text style={styles.title}>{gym.name}</Text>
      <Text style={styles.subtitle}>{gym.owner ? gym.owner : 'Unclaimed'}</Text>

      {/* inputs */}

      <View style={styles.middle}>
        <Pressable
          style={{ ...styles.inputDodge, height: '100%' }}
          onPress={(evt) => touchDodge(evt, false)}
        ></Pressable>
        <Pressable
          style={{ flexGrow: 1, backgroundColor: 'red' }}
          onPress={touchAttack}
        ></Pressable>
        <Pressable
          style={{ ...styles.inputDodge, height: '100%' }}
          onPress={(evt) => touchDodge(evt, true)}
        ></Pressable>
      </View>

      {/* input gizmo */}

      <View
        style={{
          position: 'absolute',
          left: gizmoOrigin.x,
          top: gizmoOrigin.y
        }}
      >
        <Animated.View
          style={{ opacity: gizmoOpacity.current }}
          pointerEvents='none'
        >
          <MaterialCommunityIcons
            size={GIZMO_SIZE}
            name={gizmoIcon}
            color={'white'}
          />
        </Animated.View>
      </View>

      <View style={styles.top}>
        {/* enemy loomie info */}

        <View style={{ ...styles.stack, height: 72 }}>
          <View style={{ ...styles.alignLeft, width: '70%' }}>
            {loomieGym && <CombatLoomieInfo loomie={loomieGym} />}
          </View>
        </View>

        {/* Enemy Loomies left */}

        <View style={styles.enemyLoomiesContainer}>
          <View style={styles.enemyLoomiesContainer2}>
            <View
              style={{ ...styles.loomieON, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'} />
            <View
              style={{ ...styles.loomieON, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'} />
            <View
              style={{ ...styles.loomieON, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'} />
            <View
              style={{ ...styles.loomieActive, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'} />
            <View
              style={{ ...styles.loomieOFF, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'} />
            <View
              style={{ ...styles.loomieOFF, ...styles.loomieDiamond }}
            ></View>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        {/* game messages */}

        <View style={styles.gameMessagesContainer}>
          {MAX_DISPLAY_MESSAGES.map((i) => (
            <CombatFloatingMessage
              message='soso'
              key={i}
              ref={(ref) => {
                dispMsgs.current.push(ref);
              }}
            />
          ))}
        </View>

        {/* user loomie info */}

        <View style={{ ...styles.stack, height: 72 }}>
          <View style={{ ...styles.alignRight, width: '70%' }}>
            {loomiePlayer && <CombatLoomieInfo loomie={loomiePlayer} />}
          </View>
        </View>

        <View style={{ ...styles.stack, height: 90 }}>
          {/* scape bubble */}

          <View style={{ ...styles.centerVertically, width: 70 }}>
            <Pressable
              style={styles.bubbleEscape}
              onPress={() => {
                console.log('ESCAPE');
              }}
            >
              <MaterialCommunityIcons
                size={30}
                name={'run'}
                color={'white'}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </Pressable>
          </View>

          <View style={styles.alignRight}>
            {/* team bubble */}

            <View style={{ width: 80 }}>
              <View style={{ ...styles.centerVertically }}>
                <Pressable
                  style={{ ...styles.bubbleBig }}
                  onPress={() => {
                    console.log('Pressed loomball bubble');
                  }}
                >
                  <FeatherIcon size={30} name={'github'} color={'white'} />
                  <View style={{ height: 4 }}></View>
                  <Text style={styles.bubbleText}>Team</Text>
                </Pressable>
              </View>
            </View>

            {/* item bubble */}

            <View style={{ width: 80 }}>
              <View style={{ ...styles.centerVertically }}>
                <Pressable
                  style={{ ...styles.bubbleBig }}
                  onPress={() => {
                    console.log('Pressed loomball bubble');
                  }}
                >
                  <FeatherIcon size={30} name={'box'} color={'white'} />
                  <View style={{ height: 4 }}></View>
                  <Text style={styles.bubbleText}>Items</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
