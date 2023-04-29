//import { images } from '@src/utils/utils';
import React, { useContext } from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from '@src/components/CustomButton';
import { GymsModalContext } from '../../../context/GymsModalContext';
//import { TWildLoomies } from '@src/types/types';

export const ModalCongratsCapture = () => {
  const { isCongratsModalOpen } = useContext(GymsModalContext);
  console.log(isCongratsModalOpen, 'in modals');

  return (
    <Modal
      isVisible={isCongratsModalOpen}
      /* onBackdropPress={toggleCongratModalVisibility} */
    >
      <View style={Styles.container}>
        <View style={Styles.modal}>
          <Text style={Styles.modalTitle}>CONGRATULATIONS!</Text>
          <Text>You have captured:</Text>
          <Text></Text>
          <Text></Text>
          <View style={Styles.containerButton}>
            <CustomButton
              title='Accept'
              type='primary'
              callback={() => {
                console.log('object');
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    width: '96%',
    padding: 16
  },
  modalTitle: {
    color: '#ED4A5F',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  containerButton: {
    alignSelf: 'center',
    width: '92%'
  }
});
