import { images } from '@src/utils/utils';
import React, { useContext } from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, Image } from 'react-native';
import { CustomButton } from '@src/components/CustomButton';
import { MapModalsContext } from '@src/context/MapModalsProvider';
import { CustomTag } from '../../CustomTag';

export const ModalCongratsCapture = () => {
  const {
    isCongratsModalOpen,
    toggleCongratsModalVisibility,
    currentModalCapturedInfo
  } = useContext(MapModalsContext);

  const loomieCaptured = currentModalCapturedInfo;

  if (loomieCaptured)
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
              <Text style={[Styles.boldText, Styles.modalText]}>
                You have captured:
              </Text>
              <Text style={Styles.modalText}>{loomieCaptured.name}</Text>
              <Text style={Styles.modalText}>
                Level: {loomieCaptured.level}
              </Text>
              <CustomTag rarity={loomieCaptured.rarity} />
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
  return <></>;
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  cardImage: {
    height: 150,
    resizeMode: 'center',
    alignSelf: 'center',
    width: 150
  },
  modalText: {
    color: '#5C5C5C',
    alignItems: 'center',
    fontSize: 16,
    textAlign: 'center'
  },
  boldText: {
    fontWeight: 'bold',
    marginVertical: 4
  },
  containerButton: {
    alignSelf: 'center',
    width: '92%',
    marginTop: 8
  }
});
