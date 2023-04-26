import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { CustomButton } from '@src/components/CustomButton';

interface IProps {
  isVisible: boolean;
  toggleVisibility: () => void;
  escapeCombat: () => void;
}

export const CombatEscapeModal = ({
  isVisible,
  toggleVisibility,
  escapeCombat
}: IProps) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={toggleVisibility}>
      <View style={Styles.container}>
        <View style={Styles.background}>
          <Text style={{ ...Styles.modalText, ...Styles.textTitle }}>
            Exit combat
          </Text>
          <Text style={{ ...Styles.modalText, ...Styles.textDescription }}>
            Are you sure you want lo leave?
          </Text>
          <CustomButton title='Yes' type='primary' callback={escapeCombat} />
          <CustomButton
            title='Cancel'
            type='bordered'
            callback={toggleVisibility}
          />
        </View>
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: {
    width: '80%',
    padding: 16,
    backgroundColor: 'white'
  },
  modalText: {
    color: '#5C5C5C'
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8
  },
  textDescription: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 8
  }
});
