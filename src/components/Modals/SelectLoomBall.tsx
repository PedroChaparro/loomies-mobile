import { getItemsService } from '@src/services/items.services';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { CustomButton } from '@src/components/CustomButton';
import { TLoomball } from '@src/types/types';
import { SelectLoomballGrid } from '../ItemsGrid/SelectLoomballGrid';

export interface iPropsSelectLoomBallModal {
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
  submitCallback: (loomBall: TLoomball) => void;
}

export const SelectLoomBallModal = ({
  isVisible,
  toggleVisibilityCallback,
  submitCallback
}: iPropsSelectLoomBallModal) => {
  const [loomballs, setLoomballs] = useState<TLoomball[]>([]);
  const [selectedLoomball, setSelectedLoomball] = useState<TLoomball>();

  //Get loomBall from user
  const getUserLoomBalls = async () => {
    const response = await getItemsService();
    if (!response) return;

    const responseLoomballs: TLoomball[] = response.loomballs;
    updateSelectedLoomball(responseLoomballs, selectedLoomball?._id);
  };

  const updateSelectedLoomball = (loomballs: TLoomball[], id?: string) => {
    //Assign property is_selected
    const loomballsWithSelectProperty = loomballs.map((loomball) => {
      const isSelected = id === loomball._id ? true : false;
      return {
        ...loomball,
        is_selected: isSelected
      };
    });

    setLoomballs(loomballsWithSelectProperty);
  };

  useEffect(() => {
    getUserLoomBalls();
  }, []);

  // Update the selected loomball when the state changes
  useEffect(() => {
    updateSelectedLoomball(loomballs, selectedLoomball?._id);
  }, [selectedLoomball]);

  //update SelectLommBall
  const handleItemPress = (SelectLommBall: TLoomball) => {
    setSelectedLoomball(SelectLommBall);
  };

  //Change the loomball and close the modal
  const changeLoomBall = () => {
    if (selectedLoomball !== null && selectedLoomball !== undefined) {
      submitCallback(selectedLoomball);
      toggleVisibilityCallback();
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      onBackdropPress={toggleVisibilityCallback}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Loomballs</Text>

      <SelectLoomballGrid
        loomBalls={loomballs}
        markIfSelected={true}
        elementsCallback={handleItemPress}
      />

      <View style={Styles.containerButton}>
        <CustomButton title='Select' type='primary' callback={changeLoomBall} />
      </View>
      <View style={Styles.containerButton}>
        <CustomButton
          title='Cancel'
          type='bordered'
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
