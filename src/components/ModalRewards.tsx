import { images } from '@src/utils/utils';
import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { CustomButton } from './CustomButton';

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

interface IProps {
  isVisible: boolean;
  callBack(): void;
}

// todo cambiar nombres
export const ModalRewards = ({ isVisible, callBack }: IProps) => {
  /* const [modalData, setModalData] = useState<Item[]>([]);

  const showModal = (location: { id: string }) => {
    setModalData(data.filter((item) => item.id === location.id));
  }; */
  // todo
  //const itemSerial = item.serial.toString().padStart(3, '0');

  if (data.length === 0) return <Text>Nothing to show</Text>;

  const renderItem = ({ item }: { item: Item }) => (
    <View style={Styles.containerItem}>
      <Text style={Styles.nameText}>{item.name}</Text>
      <View style={Styles.groupImageText}>
        <Image source={images[`O-00${item.id}`]} style={Styles.cardImage} />
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
            data={data}
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