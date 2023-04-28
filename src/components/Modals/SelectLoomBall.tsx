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
  const [loomBall, setLoomBall] = useState<TLoomball[]>([]);
  const [selectLoomball, setSelectLoomball] = useState<TLoomball>();

  //Get loomBall from user
  const getUserLoomBalls = async () => {
    const response = await getItemsService();
    if (!response) return;

    const responseLoomballs: TLoomball[] = response.loomballs;
    updateSelectedLoomball(responseLoomballs, selectLoomball?._id);
  };

  const updateSelectedLoomball = (loomballs: TLoomball[], id?: string) => {
    //Assign property is_selected
    const loomballsWithSelectProperty = loomballs.map((loomball) => {
      const isSelectedLoomie = id === loomball._id ? true : false;
      return {
        ...loomball,
        is_selected: isSelectedLoomie
      };
    });

    setLoomBall(loomballsWithSelectProperty);
  };

  useEffect(() => {
    getUserLoomBalls();
  }, []);

  // Update the selected loomball when the state changes
  useEffect(() => {
    updateSelectedLoomball(loomBall, selectLoomball?._id);
  }, [selectLoomball]);

  //update SelectLommBall
  const handleItemPress = (SelectLommBall: TLoomball) => {
    setSelectLoomball(SelectLommBall);
  };

  //Change the loomball and close the modal
  const changeLoomBall = () => {
    if (selectLoomball !== null && selectLoomball !== undefined) {
      submitCallback(selectLoomball);
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
        loomBall={loomBall}
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
