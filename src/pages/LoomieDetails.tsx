import { RouteProp } from '@react-navigation/core';
import { TCaughtLoomies } from '@src/types/types';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { colors } from '@src/utils/utils';
import { LoomieLevelBar } from '@src/components/LoomieDetails/LoomieLevelBar';
import { LoomieStatsTable } from '@src/components/LoomieDetails/LoomieStatsTable';
import { LoomieTypes } from '@src/components/LoomieDetails/LoomieTypes';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { EngineView } from '@babylonjs/react-native';

interface IProps {
  route?: RouteProp<{ params: { loomie: TCaughtLoomies } }, 'params'>;
}

export const LoomieDetails = ({ route }: IProps) => {

  const [loomie, setLoomie] = useState<TCaughtLoomies | null>(null);
  const { cameraDetails, cameraMap, showSceneDetails, getCurrentScene } = useContext(BabylonContext);

  useEffect(() => {
    // Try to get the loomie from the route params
    const loomieFromRoute = route?.params?.loomie;
    if (loomieFromRoute) setLoomie(loomieFromRoute);

    // Toggle rendered scene in engine
    showSceneDetails();
  }, []);

  if (!loomie) return null;
  const mainColor = loomie.types[0].toUpperCase();
  const typeColor = colors[mainColor];

  return (
    <View style={{ ...Styles.background, backgroundColor: typeColor }}>
      <View style={Styles.scenario}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
          <View style={{ flex: 1 }}>
            {getCurrentScene() == APP_SCENE.DETAILS && <EngineView camera={cameraDetails} displayFrameRate={true} />}
          </View>
        </SafeAreaView>
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
