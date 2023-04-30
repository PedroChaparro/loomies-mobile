import { CustomButton } from '@src/components/CustomButton';
import { iLoomie } from '@src/types/combatInterfaces';
import { TCaughtLoomieToRender } from '@src/types/types';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

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

    const test = () => {
        console.log(loomiesTeam)
    };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      onBackdropPress={toggleVisibilityCallback}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Loomies Team</Text>
      <View style={{ flex: 1, marginVertical: 8 }}></View>
      <View style={Styles.containerButton}>
        <CustomButton
          title='Accept'
          type='primary'
          callback={test}
        />
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
