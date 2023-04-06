import { TItem } from '@src/types/types';
import { images } from '@src/utils/utils';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { CustomButton } from '../CustomButton';

interface IProps {
  isVisible: boolean;
  toggleVisibility: () => void;
  item: TItem;
}

export const ItemDetailsModal = ({
  isVisible,
  toggleVisibility,
  item
}: IProps) => {
  const itemSerial = item.serial.toString().padStart(3, '0');

  const handleUseNow = () => {
    console.log('TODO: Use the item...');
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={toggleVisibility}>
      <View style={Styles.container}>
        <View style={Styles.background}>
          <View style={Styles.cardImageBg} />
          <Image source={images[`O-${itemSerial}`]} style={Styles.itemImage} />
          <Text style={{ ...Styles.modalText, ...Styles.itemQuantity }}>
            x{item.quantity}
          </Text>
          <Text style={{ ...Styles.modalText, ...Styles.itemName }}>
            {item.name}
          </Text>
          <Text style={{ ...Styles.modalText, ...Styles.itemDescription }}>
            {item.description}
          </Text>
          <CustomButton
            title='Close'
            type='bordered'
            callback={toggleVisibility}
          />
          <CustomButton
            title='Use now'
            type='primary'
            callback={handleUseNow}
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
  cardImageBg: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.065)',
    borderRadius: 24,
    height: 110,
    position: 'absolute',
    top: 36,
    transform: [{ rotate: '35deg' }],
    width: 110
  },
  itemImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  itemQuantity: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontSize: 18
  },
  itemName: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8
  },
  itemDescription: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 8
  }
});
