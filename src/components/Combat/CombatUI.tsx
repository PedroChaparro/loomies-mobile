import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { styles } from './combatStyles';
import { Gap } from '../Gap';
import { iLoomie } from '@src/types/combatInterfaces';
import { TGymInfo } from '@src/types/types';
import { CombatLoomieInfo } from './CombatLoomieInfo';

interface iPropsCombatUI {
  gym: TGymInfo;
  loomiePlayer: iLoomie;
  loomieGym: iLoomie;
  inputAttack: () => void;
  inputDodge: (_direction: boolean) => void;
}

export const CombatUI = ({gym, loomiePlayer, loomieGym, inputAttack, inputDodge}: iPropsCombatUI) => {
  return (
    <View style={styles.container}>

      {/* header */}

      <View style={styles.circle}></View>
      <Text style={styles.title}>{gym.name}</Text>
      <Text style={styles.subtitle}>{gym.owner ? gym.owner : 'Unclaimed'}</Text>

      { /* inputs */ }

      <View style={styles.middle}>
        <Pressable style={{...styles.inputDodge, height: '100%'}} onPress={() => inputDodge(false)}>
        </Pressable>
        <Pressable style={{flexGrow: 1, backgroundColor: 'red'}} onPress={inputAttack}>
        </Pressable>
        <Pressable style={{...styles.inputDodge, height: '100%'}} onPress={() => inputDodge(true)}>
        </Pressable>
      </View>

      <View
        style={styles.top}
      >
        {/* enemy loomie info */}

        <View style={{ ...styles.stack, height: 72 }}>
          <View style={{ ...styles.alignLeft, width: '70%' }}>
            { loomieGym && <CombatLoomieInfo loomie={loomieGym}/> }
          </View>
        </View>

        {/* Enemy Loomies left */}

        <View style={styles.enemyLoomiesContainer}>
          <View style={styles.enemyLoomiesContainer2}>
            <View
              style={{ ...styles.loomieON, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'}/>
            <View
              style={{ ...styles.loomieON, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'}/>
            <View
              style={{ ...styles.loomieON, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'}/>
            <View
              style={{ ...styles.loomieActive, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'}/>
            <View
              style={{ ...styles.loomieOFF, ...styles.loomieDiamond }}
            ></View>
            <Gap size={10} direction={'horizontal'}/>
            <View
              style={{ ...styles.loomieOFF, ...styles.loomieDiamond }}
            ></View>
          </View>
        </View>
      </View>


      <View style={styles.bottom}>

        {/* user loomie info */}

        <View style={{ ...styles.stack, height: 72 }}>
          <View style={{ ...styles.alignRight, width: '70%' }}>
            { loomiePlayer && <CombatLoomieInfo loomie={loomiePlayer}/> }
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
