import { getLoomiesRequest, fuseLoomies } from '@src/services/user.services';
import { TCaughtLoomieToRender, TCaughtLoomies } from '@src/types/types';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { LoomiesGrid } from '../CaughtLoomiesGrid/LoomiesGrid';
import { CustomButton } from '../CustomButton';
import { useToastAlert } from '@src/hooks/useToastAlert';
import { navigate } from '@src/navigation/RootNavigation';
import { EmptyMessage } from '../EmptyMessage';

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
  const [team, setTeam] = useState<string>();
  const [fuseLoomie, setFuseLoomie] = useState<string>();
  const [loomies, setLoomies] = useState<TCaughtLoomieToRender[]>();

  // Request to obtain the loomies
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();
    if (err) return;

    const loomies: TCaughtLoomies[] = response.loomies;

    const loomiesWithTeamProperty = loomies.map((loomie) => {
      const isSelectedLoomie = team === loomie._id ? true : false;

      return {
        ...loomie,
        is_selected: isSelectedLoomie
      };
    });

    // Filter loomies to show only the ones that can be fused
    const fuseCandidates = loomiesWithTeamProperty.filter((loomie) => {
      return (
        loomie._id !== selectedLoomie._id &&
        loomie.serial === selectedLoomie.serial &&
        !loomie.is_busy
      );
    });

    setLoomies(fuseCandidates);
  };

  useEffect(() => {
    fetchLoomies();
  }, [team]);

  const handleLoomiePress = useCallback((loomieId: string) => {
    // If the loomie is busy, ignore the action
    const loomie = loomies?.find((loomie) => loomie._id === loomieId);
    if (loomie?.is_busy) return;

    setFuseLoomie(loomieId);
    setTeam(loomieId);

    console.log('Loomie pressed: ', loomieId);
  }, []);

  const callfuseLoomies = async () => {
    const [response, error] = await fuseLoomies(
      selectedLoomie._id,
      fuseLoomie as string
    );
    toggleVisibilityCallback;
    if (error) {
      showErrorToast(
        response['message'] ||
          'There was an error fusing your loomies, please try again later'
      );
    } else {
      showSuccessToast(
        response['message'] || 'Your loomies was fusing successfully'
      );
      navigate('Application', { screen: 'LoomieTeamView' });
    }
  };

  if (!loomies) return <Text>Loading...</Text>;

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Fuse Loomies</Text>
      <View style={{ flex: 1 }}>
        {loomies.length === 0 ? (
          <EmptyMessage
            text="You don't have any Loomie to fuse yet..."
            showButton={false}
          />
        ) : (
          <LoomiesGrid
            loomies={loomies}
            markBusyLoomies={false}
            markSelectedLoomies={true}
            elementsCallback={handleLoomiePress}
          />
        )}
      </View>
      {loomies.length === 0 ? null : (
        <View style={Styles.containerButton}>
          <CustomButton
            title='Accept'
            type='primary'
            callback={callfuseLoomies}
          />
        </View>
      )}
      <View style={Styles.containerButton}>
        <CustomButton
          title='Cancel'
          type='primary'
          callback={toggleVisibilityCallback}
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
  },
  containerButton: {
    alignSelf: 'center',
    width: '90%'
  }
});
