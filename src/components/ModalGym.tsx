import { images } from '@src/utils/utils';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { CustomButton } from './CustomButton';
import { ModalRewards } from './ModalRewards';
import { GymsModalContext } from '@src/context/GymsModalContext';

interface Item {
  id: string;
  name: string;
  quantity: number;
}

const data: Item[] = [
  {
    id: '1',
    name: 'Defibrillator',
    quantity: 1
  },
  {
    id: '2',
    name: 'Steroids Injection',
    quantity: 2
  },
  {
    id: '3',
    name: 'Steroids Injection',
    quantity: 2
  },
  {
    id: '4',
    name: 'Steroids Injection',
    quantity: 2
  },
  {
    id: '5',
    name: 'Steroids Injection',
    quantity: 2
  }
];

// todo cambiar nombres
export const ModalGym = () => {
  const { isGymModalOpen, currentGymId, toggleGymModalVisibility } =
    useContext(GymsModalContext);

  useEffect(() => {
    // Here, if the current gym id changes, and is not empty, you can
    // fetch the gym data
    if (currentGymId) {
      console.log({ currentGymId });
    }
  }, [currentGymId]);

  /* const [modalData, setModalData] = useState<Item[]>([]);

  const showModal = (location: { id: string }) => {
    setModalData(data.filter((item) => item.id === location.id));
  }; */
  // todo
  //const itemSerial = item.serial.toString().padStart(3, '0');

  const [secondModalVisible, setSecondModalVisible] = useState(false);

  const handleOpenSecondModal = () => {
    setSecondModalVisible(true);
  };

  const handleCloseSecondModal = () => {
    setSecondModalVisible(false);
  };

  if (data.length === 0) return <Text>Nothing to show</Text>;

  const renderItem = ({ item }: { item: Item }) => (
    <View style={Styles.containerItem}>
      <Image source={images[`O-00${item.id}`]} style={Styles.cardImage} />
      <Text style={Styles.nameText}>{item.name}</Text>
      <Text style={Styles.level}>Lvl {item.quantity}</Text>
    </View>
  );

  return (
    <Modal
      isVisible={isGymModalOpen}
      onBackdropPress={toggleGymModalVisibility}
    >
      <View style={Styles.container}>
        <View style={Styles.modal}>
          <Text style={Styles.modalTitle}>Osinski Estate</Text>
          <Text style={Styles.modalSubtitle}>Owner: Unclaimed</Text>
          <View style={Styles.containerButton}>
            <Text /* style={Styles.modalTitle} */>Protectors:</Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <View style={Styles.containerButton}>
            <CustomButton
              title='Claim Rewards'
              type='primary'
              callback={handleOpenSecondModal}
            />
            <CustomButton
              title='Challenge'
              type='primary'
              callback={() => {
                console.log('Challenge');
              }}
            />
          </View>
        </View>
      </View>
      <ModalRewards
        isVisible={secondModalVisible}
        callBack={handleCloseSecondModal}
      />
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
  modalSubtitle: {
    color: '#5c5c5c',
    fontSize: 22,
    textAlign: 'center'
  },
  containerItem: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'black',
    marginTop: 7,
    marginBottom: 7,
    padding: 4,
    width: '92%',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: 4
  },
  cardImage: {
    height: 40,
    resizeMode: 'center',
    width: 50
  },
  level: {
    color: '#5c5c5c',
    paddingRight: 12
  },
  containerButton: {
    alignSelf: 'center',
    width: '92%'
  },
  nameText: {
    color: '#5c5c5c',
    fontWeight: 'bold'
  }
});
