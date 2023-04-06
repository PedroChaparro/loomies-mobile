import { images } from '@src/utils/utils';
import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { CustomButton } from '../CustomButton';
//import { GymsModalContext } from '@src/context/GymsModalContext';
import { TReward } from '@src/types/types';

interface IProps {
  isVisible: boolean;
  reward: TReward[];
  callBack(): void;
}

export const ModalRewards = ({ isVisible, reward, callBack }: IProps) => {
  const renderItem = ({ item }: { item: TReward }) => (
    <View style={Styles.containerItem}>
      <Text style={Styles.nameText}>{item.name}</Text>
      <View style={Styles.groupImageText}>
        <Image
          source={
            images[`${'O-'}` + `${item.serial}`.toString().padStart(3, '0')]
          }
          style={Styles.cardImage}
        />
        <Text>x{item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={callBack}>
      <View style={Styles.container}>
        <View style={Styles.modal}>
          <Text style={Styles.modalTitle}>Rewards Claimed 🏆</Text>
          <FlatList
            data={reward}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <View style={Styles.containerButton}>
            <CustomButton title='Aceptar' type='primary' callback={callBack} />
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
    height: 40,
    resizeMode: 'center',
    width: 50
  },
  groupImageText: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 14,
    color: '#5C5C5C'
  },
  containerButton: {
    alignSelf: 'center',
    width: '92%'
  },
  nameText: {
    color: '#5c5c5c',
    marginLeft: 12,
    fontWeight: 'bold'
  },
  containerItem: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    marginBottom: 7,
    padding: 4,
    width: '92%',
    backgroundColor: '#f2f1ed',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: 4
  }
});
