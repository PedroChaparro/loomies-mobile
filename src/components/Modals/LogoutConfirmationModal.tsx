import React from 'react';
import Modal from 'react-native-modal';
import { CustomButton } from '../CustomButton';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  isVisible: boolean;
  toggleVisibilityCallback(): void;
  acceptCallback(): void;
}

export const LogoutConfirmationModal = ({
  isVisible,
  toggleVisibilityCallback,
  acceptCallback
}: IProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      onBackdropPress={toggleVisibilityCallback}
    >
      <View style={Styles.container}>
        <Text style={Styles.modalText}>Are you sure you want to log out?</Text>
        <CustomButton
          title='Cancel'
          type='bordered'
          callback={toggleVisibilityCallback}
        />
        <CustomButton title='Yes' type='primary' callback={acceptCallback} />
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16
  },
  modalText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#5C5C5C',
    marginBottom: 8
  }
});
