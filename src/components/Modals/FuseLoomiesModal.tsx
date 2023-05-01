import { fuseLoomies, getLoomiesRequest } from '@src/services/loomies.services';
import { TCaughtLoomieToRender, TCaughtLoomies } from '@src/types/types';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { LoomiesGrid } from '../CaughtLoomiesGrid/LoomiesGrid';
import { useToastAlert } from '@src/hooks/useToastAlert';
import { navigate } from '@src/navigation/RootNavigation';
import { EmptyMessage } from '../EmptyMessage';
import { FloatingRedIcon } from '../FloatingRedIcon';

interface IProps {
  selectedLoomie: TCaughtLoomieToRender;
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
}

export const FuseLoomiesModal = ({
  selectedLoomie,
  isVisible,
  toggleVisibilityCallback
}: IProps) => {
  const { showErrorToast, showSuccessToast } = useToastAlert();
  const [fuseLoomie, setFuseLoomie] = useState<string>('');
  const [loomies, setLoomies] = useState<TCaughtLoomieToRender[]>();

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();
    if (err) return;
    const loomies: TCaughtLoomies[] = response.loomies;

    // Filter loomies to show only the ones that can be merged
    const fuseCandidates = loomies.filter((loomie) => {
      return (
        loomie._id !== selectedLoomie._id &&
        loomie.serial === selectedLoomie.serial &&
        !loomie.is_busy
      );
    });

    setLoomies(fuseCandidates);
  };

  // Update the selected loomie when the user clicks a card
  const updateSelectedLoomie = () => {
    const loomiesWithTeamProperty = loomies?.map((loomie) => {
      const isSelectedLoomie = fuseLoomie === loomie._id ? true : false;
      return {
        ...loomie,
        is_selected: isSelectedLoomie
      };
    });

    setLoomies(loomiesWithTeamProperty);
  };

  useEffect(() => {
    fetchLoomies();
  }, []);

  useEffect(() => {
    updateSelectedLoomie();
  }, [fuseLoomie]);

  const handleLoomiePress = useCallback((loomieId: string) => {
    // If the loomie is busy, ignore the action
    const loomie = loomies?.find((loomie) => loomie._id === loomieId);
    if (loomie?.is_busy) return;

    setFuseLoomie(loomieId);
  }, []);

  const callfuseLoomies = async () => {
    if (fuseLoomie !== '') {
      const [response, error] = await fuseLoomies(
        selectedLoomie._id,
        fuseLoomie as string
      );
      toggleVisibilityCallback;
      if (error) {
        showErrorToast(
          response['message'] ||
            'There was an error merging your Loomies, please try again later'
        );
      } else {
        showSuccessToast('Your Loomies were merged successfully');
        navigate('Application', { screen: 'LoomieTeamView' });
      }
    }
  };

  const goToMap = () => {
    toggleVisibilityCallback();
    navigate('Map', null);
  };

  if (!loomies) return null;

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      onBackdropPress={toggleVisibilityCallback}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Merge Loomies</Text>
      <View style={{ flex: 1, position: 'relative', marginVertical: 8 }}>
        {loomies.length === 0 ? (
          <EmptyMessage
            text={`You have to catch another "${selectedLoomie.name}" to merge it`}
            showButton={true}
            buttonText='Catch Loomies'
            buttonCallback={goToMap}
          />
        ) : (
          <LoomiesGrid
            loomies={loomies}
            markBusyLoomies={false}
            markSelectedLoomies={true}
            elementsCallback={handleLoomiePress}
          />
        )}

        {loomies.length > 0 && (
          <FloatingRedIcon
            onPress={callfuseLoomies}
            collection='MaterialCommunityIcons'
            name='checkbox-marked-circle-outline'
            bottom={80}
            right={16}
          />
        )}
        <FloatingRedIcon
          onPress={callfuseLoomies}
          collection='MaterialIcons'
          name='cancel'
          bottom={16}
          right={16}
        />
      </View>
    </Modal>
  );
};

const Styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 12
  },
  modalTitle: {
    color: '#ED4A5F',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});
