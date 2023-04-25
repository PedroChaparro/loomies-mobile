import { images } from '@src/utils/utils';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { CustomButton } from '../../CustomButton';
import { ModalRewards } from './ModalRewards';
import { GymsModalContext } from '@src/context/GymsModalContext';
import { requestGymInfoById } from '@src/services/map.services';
import { TGymInfo, TGymLoomieProtector, TReward } from '../../../types/types';
import { getPosition } from '@src/services/geolocation.services';
import { requestRewards } from '@src/services/map.services';
import { useToastAlert } from '@src/hooks/useToastAlert';
import { navigate } from '@src/navigation/RootNavigation';
import { getCombatToken } from '@src/components/Combat/combatUtils';
import { UserPositionContext } from '@src/context/UserPositionProvider';
import { iCombatViewParams } from '@src/pages/CombatView';

export const ModalGym = () => {
  const { isGymModalOpen, currentModalGymId, toggleGymModalVisibility } =
    useContext(GymsModalContext);
  const { userPosition } = useContext(UserPositionContext);

  const { showErrorToast } = useToastAlert();
  const [rewardsModalVisible, setRewardsModalVisible] = useState(false);
  const [gymInfo, setGymInfo] = useState<TGymInfo>();
  const [reward, setReward] = useState<TReward[]>([]);

  // Request the gym information to show the first modal
  const fetchGymInfo = async () => {
    const [response, err] = await requestGymInfoById(currentModalGymId);
    const gymInfo = response;

    if (!err && gymInfo) {
      setGymInfo(gymInfo);
    } else {
      showErrorToast(
        'There was an error trying to get the gym information. Please try again later.'
      );

      toggleGymModalVisibility();
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
        setReward(reward || []);
      }
    }
  };

  // start combat
  const goToCombat = async () => {
    if (!gymInfo) return;
    if (!userPosition) return;

    // get token

    const combatToken = await getCombatToken(userPosition, gymInfo._id);
    if (!combatToken) return;

    const params: iCombatViewParams = {
      gym: gymInfo,
      combatToken: combatToken
    };

    // close modal before going to combat view

    toggleGymModalVisibility();
    navigate('Combat', params);
  };

  // Open the second modal if the user has claimed the rewards successfully
  useEffect(() => {
    if (reward && reward.length != 0) {
      handleOpenRewardsModal();
    }
  }, [reward]);

  // Request the gym information when the modal is opened
  useEffect(() => {
    if (currentModalGymId) {
      fetchGymInfo();
    }
  }, [currentModalGymId]);

  const handleOpenRewardsModal = () => {
    setRewardsModalVisible(true);
  };

  const handleCloseSecondModal = () => {
    setRewardsModalVisible(false);
    if (!gymInfo) return;
    // Set the gym as claimed to avoid showing the modal again.
    // When the user clicks on the gym again, this information
    // will be obtained from the backend
    gymInfo.was_reward_claimed = true;
  };

  const renderLoomieCard = ({ item }: { item: TGymLoomieProtector }) => (
    <View style={Styles.containerItem}>
      <Image
        source={images[`${item.serial}`.toString().padStart(3, '0')]}
        style={Styles.cardImage}
      />
      <Text style={Styles.nameText}>{item.name}</Text>
      <Text style={Styles.level}>Lvl {item.level}</Text>
    </View>
  );

  // If the gym information is not available, don't render the modal
  if (!gymInfo) return <></>;

  return (
    <>
      {/* First modal (Gym information) */}
      <Modal
        isVisible={isGymModalOpen}
        onBackdropPress={toggleGymModalVisibility}
      >
        <View style={Styles.container}>
          <View style={Styles.modal}>
            <Text style={Styles.modalTitle}>{gymInfo.name}</Text>
            <Text style={Styles.modalSubtitle}>
              Owner: {gymInfo.owner == null ? 'Unclaimed' : gymInfo.owner}
            </Text>
            {gymInfo.user_owns_it && (
              <Text style={Styles.modalSubtitle}>(You own this gym)</Text>
            )}
            <View style={Styles.protectorsContainer}>
              <View style={Styles.containerButton}>
                <Text style={Styles.flastListTitle}>Protectors:</Text>
              </View>
              <FlatList
                style={Styles.flatList}
                data={gymInfo.protectors}
                renderItem={renderLoomieCard}
                keyExtractor={(loomie) => loomie._id.toString()}
              />
            </View>
            <View style={Styles.containerButton}>
              {!gymInfo.was_reward_claimed && (
                <CustomButton
                  title='Claim Rewards'
                  type='primary'
                  callback={fetchClaimRewards}
                />
              )}
              {!gymInfo.user_owns_it && (
                <CustomButton
                  title='Challenge'
                  type='primary'
                  callback={() => {
                    console.log('Challenge');
                    goToCombat();
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
      {/* Second modal (Rewards) */}
      <ModalRewards
        reward={reward}
        isVisible={rewardsModalVisible}
        callBack={handleCloseSecondModal}
      />
    </>
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
    padding: 12
  },
  modalTitle: {
    color: '#ED4A5F',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  modalSubtitle: {
    color: '#5c5c5c',
    fontSize: 20,
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
  protectorsContainer: {
    marginVertical: 12,
    maxHeight: 230
  },
  flastListTitle: {
    fontSize: 16,
    marginBottom: 4
  },
  flatList: {
    marginVertical: 6
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
