import { images } from '@src/utils/utils';
import React, { useContext } from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CustomButton } from '@src/components/CustomButton';
import { GymsModalContext } from '../../../context/GymsModalContext';

export const ModalCongratsCapture = () => {
  const {
    isCongratsModalOpen,
    toggleCongratsModalVisibility,
    currentModalCapturedInfo
  } = useContext(GymsModalContext);

  const loomieCaptured = currentModalCapturedInfo;

  return (
    <Modal
      isVisible={isCongratsModalOpen}
      onBackdropPress={toggleCongratsModalVisibility}
    >
      <View style={Styles.container}>
        <View style={Styles.modal}>
          <Text style={Styles.modalTitle}>CONGRATULATIONS!</Text>
          <Image
            source={
              images[`${loomieCaptured?.serial}`.toString().padStart(3, '0')]
            }
            style={Styles.cardImage}
          />
          <View style={Styles.modalText}>
            <Text style={Styles.boldText}>You have captured:</Text>
            <Text>{loomieCaptured?.name}</Text>
            <Text>Level: {loomieCaptured?.level}</Text>
          </View>
          <View style={Styles.containerButton}>
            <CustomButton
              title='Accept'
              type='primary'
              callback={toggleCongratsModalVisibility}
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
  cardImage: {
    height: 100,
    resizeMode: 'center',
    alignSelf: 'center',
    width: 100
  },
  modalText: {
    marginVertical: 10,
    alignItems: 'center',
    fontSize: 22,
    textAlign: 'center'
  },
  boldText: {
    fontWeight: 'bold'
  },
  containerButton: {
    alignSelf: 'center',
    width: '92%'
  }
});
