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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeLoomie(_a: any): void;
}

export const SelecLoomieModal = ({
  loomiesTeam,
  isVisible,
  toggleVisibilityCallback,
  changeLoomie
}: IProps) => {
  const [loomiesInternal, setLoomiesInternal] = useState<iLoomie[]>();
  const [selectedLoomie, setSelectedLoomie] = useState<iLoomie>();

  const test = () => {
    changeLoomie(selectedLoomie);
    toggleVisibilityCallback();
  };

  const updateSelectedLoomie = () => {
    const loomiesWithTeamProperty = loomiesTeam?.map((loomie) => {
      const isSelectedLoomie =
        selectedLoomie?._id === loomie._id ? true : false;
      return {
        ...loomie,
        is_selected: isSelectedLoomie
      };
    });

    setLoomiesInternal(loomiesWithTeamProperty);
  };

  useEffect(() => {
    updateSelectedLoomie();
  }, [selectedLoomie]);

  useEffect(() => {
    setLoomiesInternal(loomiesTeam);
  }, [loomiesTeam]);

  const handleLoomiePress = useCallback((selectedLoomie: iLoomie) => {
    // If the loomie is weakened, ignore the action
    if (selectedLoomie.boosted_hp < 0) return;
    setSelectedLoomie(selectedLoomie);
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          loomies={loomiesInternal!}
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
