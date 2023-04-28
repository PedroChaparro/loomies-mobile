import { getItemsService } from '@src/services/items.services';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { CustomButton } from '@src/components/CustomButton';
import { TLoomball } from '@src/types/types';
import { SelectLoomball } from '../ItemsGrid/SelectLoomball';

export interface iPropsSelectLoomBallModal {
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
}

export const SelectLoomBallModal = ({
  isVisible,
  toggleVisibilityCallback
}: iPropsSelectLoomBallModal) => {
  const [loomBall, setLoomBall] = useState<TLoomball[]>([]);
  const [selectLoomball, setSelectLoomball] = useState<string>();

  const getUserLoomBalls = async () => {
    const response = await getItemsService();
    if (!response) return;

    const responseLoomballs: TLoomball[] = response.loomballs;

    const loomballsWithSelectProperty = responseLoomballs.map((loomballs) => {
      const isSelectedLoomie = selectLoomball === loomballs._id ? true : false;

      return {
        ...loomballs,
        is_selected: isSelectedLoomie
      };
    });

    setLoomBall(loomballsWithSelectProperty);
  };

  const handleItemPress = (SelectLommBall: TLoomball) => {
    console.log(SelectLommBall._id);
    setSelectLoomball(SelectLommBall._id);
  };

  useEffect(() => {
    getUserLoomBalls();
  }, [selectLoomball]);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleVisibilityCallback}
      onBackdropPress={toggleVisibilityCallback}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Loomballs</Text>

      <SelectLoomball
        loomBall={loomBall}
        markIfSelected={true}
        elementsCallback={handleItemPress}
      />

      <View style={Styles.containerButton}>
        <CustomButton
          title='Select'
          type='primary'
          callback={toggleVisibilityCallback}
        />
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
