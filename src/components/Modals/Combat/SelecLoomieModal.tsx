import { CustomButton } from '@src/components/CustomButton';
import { iLoomie } from '@src/types/combatInterfaces';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { LoomiesCombatGrid } from './LoomiesCombatGrid';

interface IProps {
  loomiesTeam: iLoomie[];
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
}

export const SelecLoomieModal = ({
  loomiesTeam,
  isVisible,
  toggleVisibilityCallback
}: IProps) => {
  const [selectedLoomie, setSelectedLoomie] = useState<string>();

  const test = () => {
    console.log(loomiesTeam);
  };

  const updateSelectedLoomie = () => {
    const loomiesWithTeamProperty = loomiesTeam?.map((loomie) => {
      const isSelectedLoomie = selectedLoomie === loomie._id ? true : false;
      return {
        ...loomie,
        is_selected: isSelectedLoomie
      };
    });

    console.log(loomiesWithTeamProperty);
  };

  useEffect(() => {
    updateSelectedLoomie();
  }, [selectedLoomie]);

  const handleLoomiePress = useCallback((loomieId: string) => {
    // If the loomie is busy, ignore the action
    const loomie = loomiesTeam?.find((loomie) => loomie._id === loomieId);
    if (loomie?.is_busy) return;

    setSelectedLoomie(loomieId);
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      onBackdropPress={toggleVisibilityCallback}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Loomies Team</Text>
      <View style={{ flex: 1, marginVertical: 8 }}>
        <LoomiesCombatGrid
          loomies={loomiesTeam}
          markIsWeakenedLoomies={true}
          markSelectedLoomies={true}
          elementsCallback={handleLoomiePress}
        />
      </View>
      <View style={Styles.containerButton}>
        <CustomButton title='Accept' type='primary' callback={test} />
      </View>
      <View style={Styles.containerButton}>
        <CustomButton
          title='Cancel'
          type='primary'
          callback={toggleVisibilityCallback}
        />
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 12
  },
  modalTitle: {
    color: '#ED4A5F',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  containerButton: {
    alignSelf: 'center',
    width: '90%'
  }
});
