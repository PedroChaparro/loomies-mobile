import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { CustomButton } from '../CustomButton';
import { TCaughtLoomieToRender, TCaughtLoomies, TItem } from '@src/types/types';
import { EmptyMessage } from '../EmptyMessage';
import { LoomiesGrid } from '../CaughtLoomiesGrid/LoomiesGrid';
import { navigate } from '@src/navigation/RootNavigation';
import { useToastAlert } from '@src/hooks/useToastAlert';
import { useItemOutCombat } from '@src/services/items.services';
import { getLoomiesRequest } from '@src/services/loomies.services';

interface IProps {
  selectedItem: TItem;
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
  closeModalItem: () => void;
}

export const UseItemModal = ({
  selectedItem,
  isVisible,
  toggleVisibilityCallback,
  closeModalItem
}: IProps) => {
  const { showErrorToast, showSuccessToast } = useToastAlert();
  const [targetLoomie, setTargetLoomie] = useState<string>();
  const [loomies, setLoomies] = useState<TCaughtLoomieToRender[]>();

  //Get loomies for use the item
  const fetchLoomies = async () => {
    const [response, err] = await getLoomiesRequest();
    if (err) return;

    const loomies: TCaughtLoomies[] = response.loomies;

    const targetLoomieFilter = loomies.map((loomie) => {
      const isSelectedLoomie = targetLoomie === loomie._id ? true : false;

      return {
        ...loomie,
        is_selected: isSelectedLoomie
      };
    });

    // Filter the loomies to show only the ones that are not busy
    const notBusy = targetLoomieFilter.filter((loomie) => {
      return !loomie.is_busy;
    });

    setLoomies(notBusy);
  };

  useEffect(() => {
    fetchLoomies();
  }, []);

  const handleLoomiePress = useCallback((loomieId: string) => {
    // If the loomie is busy, ignore the action
    const loomie = loomies?.find((loomie) => loomie._id === loomieId);
    if (loomie?.is_busy) return;

    // Update the state of the target loomie
    setTargetLoomie(loomieId);
  }, []);

  useEffect(() => {
    // Update the state of the loomies to mark the selected one
    setLoomies(
      loomies?.map((loomie) => {
        return {
          ...loomie,
          is_selected: loomie._id === targetLoomie
        };
      })
    );
  }, [targetLoomie]);

  const goToMap = () => {
    toggleVisibilityCallback();
    navigate('Map', null);
  };

  //Call the funtion useItemOutCombat
  const callUseItem = async () => {
    if (targetLoomie !== '') {
      const [response, error] = await useItemOutCombat(
        selectedItem._id,
        targetLoomie as string
      );
      toggleVisibilityCallback;
      if (error) {
        showErrorToast(
          response['message'] ||
            'There was an error using the item, please try again later'
        );
      } else {
        showSuccessToast('Item applied successfully');
        toggleVisibilityCallback();
        closeModalItem();
      }
    }
  };

  if (!loomies) return null;

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      onBackdropPress={toggleVisibilityCallback}
      backdropOpacity={0.3}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Apply {selectedItem.name} to:</Text>
      <View style={{ flex: 1, marginVertical: 8 }}>
        {loomies.length === 0 ? (
          <EmptyMessage
            text={`You don't have any Loomies yet to use the item`}
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
      </View>
      {loomies.length === 0 ? null : (
        <View style={Styles.containerButton}>
          <CustomButton
            title='Use Item'
            type='primary'
            callback={callUseItem}
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
