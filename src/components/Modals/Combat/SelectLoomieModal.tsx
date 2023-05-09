import { iLoomie } from '@src/types/combatInterfaces';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { LoomiesCombatGrid } from './LoomiesCombatGrid';
import { FloatingRedIcon } from '@src/components/FloatingRedIcon';

interface IProps {
  loomiesTeam: iLoomie[];
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeLoomie(_a: any): void;
}

export const SelectLoomieModal = ({
  loomiesTeam,
  isVisible,
  toggleVisibilityCallback,
  changeLoomie
}: IProps) => {
  const [loomiesInternal, setLoomiesInternal] = useState<iLoomie[]>();
  const [selectedLoomie, setSelectedLoomie] = useState<iLoomie>();

  const changePlayerLoomie = () => {
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
      <Text style={Styles.modalTitle}>Loomie Team</Text>
      <View style={{ flex: 1, marginVertical: 8 }}>
        <LoomiesCombatGrid
          loomies={loomiesInternal || []}
          markIsWeakenedLoomies={true}
          markSelectedLoomies={true}
          elementsCallback={handleLoomiePress}
        />
      </View>
      <FloatingRedIcon
        onPress={changePlayerLoomie}
        collection='MaterialCommunityIcons'
        name='checkbox-marked-circle-outline'
        bottom={80}
        right={16}
      />
      <FloatingRedIcon
        onPress={toggleVisibilityCallback}
        collection='MaterialIcons'
        name='cancel'
        bottom={16}
        right={16}
      />
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
  }
});
