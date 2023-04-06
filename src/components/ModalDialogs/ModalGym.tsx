import { images } from '@src/utils/utils';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { CustomButton } from '../CustomButton';
import { ModalRewards } from './ModalRewards';
import { GymsModalContext } from '@src/context/GymsModalContext';
import { requestGymInfoById } from '@src/services/map.services';
import { TGymInfo, TGymLoomieProtector, TReward } from '../../types/types';
import { getPosition } from '@src/services/geolocation.services';
import { requestRewards } from '@src/services/map.services';

export const ModalGym = () => {
  const { isGymModalOpen, currentModalGymId, toggleGymModalVisibility } =
    useContext(GymsModalContext);

  const [gymInfo, setGymInfo] = useState<TGymInfo | null>();
  const [reward, setReward] = useState(Array<TReward>);

  // Request the gym infromation to show the first modal
  const fetchGymInfo = async () => {
    const [response, err] = await requestGymInfoById(currentModalGymId);
    if (!err) {
      const gymInfo = response;
      setGymInfo(gymInfo || null);
      if (!gymInfo) return;
    }
  };

  // Try to claim the gym rewards to show the second modal
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
    handleOpenRewardsModal();
  }, [reward]);

  useEffect(() => {
    if (currentModalGymId) {
      fetchGymInfo();
    }
  }, [currentModalGymId]);

  const [rewardsModalVisible, setRewardsModalVisible] = useState(false);

  const handleOpenRewardsModal = () => {
    setRewardsModalVisible(true);
  };

  // This function is only called from the second modal to avoid changing
  // the value of the was_reward_claimed variable.
  const handleCloseSecondModal = () => {
    setRewardsModalVisible(false);
    if (!gymInfo) return;
    gymInfo.was_reward_claimed = true;
  };

  const renderItem = ({ item }: { item: TGymLoomieProtector }) => (
    <View style={Styles.containerItem}>
      <Image
        source={images[`${item.serial}`.toString().padStart(3, '0')]}
        style={Styles.cardImage}
      />
      <Text style={Styles.nameText}>{item.name}</Text>
      <Text style={Styles.level}>Lvl {item.level}</Text>
    </View>
  );

  return (
    <Modal
      isVisible={isGymModalOpen}
      onBackdropPress={toggleGymModalVisibility}
    >
      <View style={Styles.container}>
        <View style={Styles.modal}>
          <Text style={Styles.modalTitle}>{gymInfo?.name}</Text>
          <Text style={Styles.modalSubtitle}>
            Owner: {gymInfo?.owner == null ? 'Unclaimed' : gymInfo?.owner}
          </Text>
          <View style={Styles.containerButton}>
            <Text style={Styles.level}>Protectors:</Text>
          </View>
          <FlatList
            style={Styles.flatList}
            data={gymInfo?.protectors}
            renderItem={renderItem}
            keyExtractor={(loomie) => loomie._id.toString()}
          />
          <View style={Styles.containerButton}>
            {!gymInfo?.was_reward_claimed && (
              <CustomButton
                title='Claim Rewards'
                type='primary'
                callback={fetchClaimRewards}
              />
            )}
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
        isVisible={rewardsModalVisible}
        reward={reward}
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
    maxHeight: 375,
    width: '96%',
    padding: 12
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
    padding: 4,
    width: '92%',
    justifyContent: 'space-between',
    height: 54,
    borderRadius: 4
  },
  flatList: {
    margin: 6
  },
  cardImage: {
    height: 48,
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
