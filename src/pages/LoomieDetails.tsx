import { RouteProp, useFocusEffect } from '@react-navigation/core';
import { TCaughtLoomiesWithTeam } from '@src/types/types';
import { StyleSheet, Text, View,Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { colors } from '@src/utils/utils';
import { LoomieLevelBar } from '@src/components/LoomieDetails/LoomieLevelBar';
import { LoomieStatsTable } from '@src/components/LoomieDetails/LoomieStatsTable';
import { LoomieTypes } from '@src/components/LoomieDetails/LoomieTypes';
import { BabylonContext } from '@src/context/BabylonProvider';
import { Loomie3DModelPreview } from '@src/components/LoomieDetails/Loomie3DModelPreview';
import FeatherIcon from 'react-native-vector-icons/Entypo';
import { FuseLoomiesModal } from '@src/components/Modals/FuseLoomiesModal';

interface IProps {
  route?: RouteProp<{ params: { loomie: TCaughtLoomiesWithTeam } }, 'params'>;
}

export const LoomieDetails = ({ route }: IProps) => {
  const [loomie, setLoomie] = useState<TCaughtLoomiesWithTeam | null>(null);
  const { showSceneDetails, showSceneNone } = useContext(BabylonContext);
  const [fuseLoomieModalVisible, setFuseLoomieModalVisible] = useState(false);

  useEffect(() => {
    // Try to get the loomie from the route params
    const loomieFromRoute = route?.params?.loomie;
    if (loomieFromRoute) setLoomie(loomieFromRoute);
  }, []);

  // toggle render loop on focus events
  useFocusEffect(
    React.useCallback(() => {
      showSceneDetails();
      return () => showSceneNone();
    }, [])
  );

  if (!loomie) return null;
  const mainColor = loomie.types[0].toUpperCase();
  const typeColor = colors[mainColor];

  const handleCloseModal = () => {
    setFuseLoomieModalVisible(false);
  };

  return (
    <View style={{ ...Styles.background, backgroundColor: typeColor }}>
      <View style={Styles.scenario}>
        <Loomie3DModelPreview serial={loomie.serial} color={typeColor} />
        {loomie.is_busy == false && (
            <Pressable
                      style={{
                        borderWidth: 1,
                        borderColor: 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        position: 'absolute',
                        top: 10,
                        right: 20,
                        height: 70,
                        backgroundColor: '#ED4A5F',
                        borderRadius: 200,
                        zIndex: 1
                      }}
                      onPress={() => {
                        setFuseLoomieModalVisible(true)
                      }}
                    >
                      <FeatherIcon name={'merge'} size={17} color={'white'} />
                <Text style={{color: '#FFF'}} >Fuse</Text>
            </Pressable>
        )}
        <FuseLoomiesModal 
          isVisible={fuseLoomieModalVisible}
          callBack={handleCloseModal}
          close={handleCloseModal}
          serial={loomie.serial}
          id={loomie._id}
        />
      </View>
      <View style={Styles.information}>
        <View style={Styles.row}>
          <Text style={Styles.loomieName}>{loomie.name}</Text>
        </View>
        <View style={Styles.row}>
          <LoomieTypes types={loomie.types} />
        </View>
        <LoomieLevelBar
          level={loomie.level}
          experience={loomie.experience}
          color={typeColor}
        />
        <LoomieStatsTable
          level={loomie.level}
          hp={loomie.hp}
          defense={loomie.defense}
          attack={loomie.attack}
        />
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  background: {
    flex: 1
  },
  scenario: {
    height: '40%',
    zIndex: 1
  },
  information: {
    flex: 1,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    backgroundColor: 'white',
    padding: 32
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  loomieName: {
    color: '#5C5C5C',
    fontWeight: 'bold',
    fontSize: 24
  }
});
