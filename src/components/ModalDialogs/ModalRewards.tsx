import { images } from '@src/utils/utils';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { CustomButton } from '../CustomButton';
import { GymsModalContext } from '@src/context/GymsModalContext';
import { getPosition } from '@src/services/geolocation.services';
import { TReward } from '@src/types/types';
import { requestRewards } from '@src/services/map.services';

interface IProps {
  isVisible: boolean;
  isClaimed: boolean;
  callBack(): void;
}

// todo cambiar nombres
export const ModalRewards = ({ isVisible, isClaimed, callBack }: IProps) => {
  const { currentModalGymId } = useContext(GymsModalContext);

  const [reward, setReward] = useState(Array<TReward>);

  const fetchClaimRewards = async () => {
    const position = await getPosition();

    if (position) {
      const [response, err] = await requestRewards(
        currentModalGymId,
        position.lat,
        position.lon
      );
      if (!err && response != null) {
        const { reward } = response;
        setReward(reward || null);
      }
    }
  };

  useEffect(() => {
    if (isVisible && !isClaimed && currentModalGymId) {
      fetchClaimRewards();
    }
  }, [isVisible, isClaimed, currentModalGymId]);

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
  if (isClaimed)
    return (
      <Modal isVisible={isVisible} onBackdropPress={callBack}>
        <View style={Styles.container}>
          <View style={Styles.modal}>
            <Text style={Styles.modalTitle}>Rewards Already Claimed!</Text>
            <View style={Styles.containerButton}>
              <CustomButton
                title='Aceptar'
                type='primary'
                callback={callBack}
              />
            </View>
          </View>
        </View>
      </Modal>
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
