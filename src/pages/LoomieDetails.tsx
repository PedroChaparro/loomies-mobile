import { RouteProp, useFocusEffect } from '@react-navigation/core';
import { TCaughtLoomieToRender } from '@src/types/types';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { colors } from '@src/utils/utils';
import { LoomieLevelBar } from '@src/components/LoomieDetails/LoomieLevelBar';
import { LoomieStatsTable } from '@src/components/LoomieDetails/LoomieStatsTable';
import { LoomieTypes } from '@src/components/LoomieDetails/LoomieTypes';
import { BabylonContext } from '@src/context/BabylonProvider';
import { Loomie3DModelPreview } from '@src/components/LoomieDetails/Loomie3DModelPreview';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FuseLoomiesModal } from '@src/components/Modals/FuseLoomiesModal';

interface IProps {
  route?: RouteProp<{ params: { loomie: TCaughtLoomieToRender } }, 'params'>;
}

export const LoomieDetails = ({ route }: IProps) => {
  const [showFuseModal, setShowFuseModal] = useState(false);
  const [loomie, setLoomie] = useState<TCaughtLoomieToRender | null>(null);
  const { showSceneDetails, showSceneNone } = useContext(BabylonContext);

  const toggleFuseModalVisibility = () => {
    setShowFuseModal(!showFuseModal);
  };

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

  return (
    <>
      {showFuseModal && (
        <FuseLoomiesModal
          isVisible={showFuseModal}
          selectedLoomie={loomie}
          toggleVisibilityCallback={toggleFuseModalVisibility}
        />
      )}
      <View style={{ ...Styles.background, backgroundColor: typeColor }}>
        {loomie.is_busy == false && (
          <Pressable
            style={Styles.fuseFloatingButton}
            onPress={toggleFuseModalVisibility}
          >
            <MaterialCommunityIcon name='merge' color={'white'} size={32} />
          </Pressable>
        )}
        <View style={Styles.scenario}>
          <Loomie3DModelPreview serial={loomie.serial} color={typeColor} />
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
    </>
  );
};

const Styles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'relative'
  },
  fuseFloatingButton: {
    position: 'absolute',
    zIndex: 2,
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ED4A5F'
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
