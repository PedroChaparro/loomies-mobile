import { getItemsService } from '@src/services/items.services';
import { TItem } from '@src/types/types';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { SelectItemGrid } from '@src/components/ItemsGrid/SelectItemGrid';
import { CustomButton } from '@src/components/CustomButton';
import { EmptyMessage } from '@src/components/EmptyMessage';

export interface iPropsSelectItemModal {
  isVisible: boolean;
  toggleVisibilityCallback: () => void;
  submitCallback: (_itemId: string) => void;
}

export const SelectItemModal = (props: iPropsSelectItemModal) => {
  const [items, setItems] = useState<TItem[]>([]);

  // get items

  const fetchItems = async () => {
    const data = await getItemsService();
    if (!data) return;

    // only items usable in combat

    const items = data.items.filter((item) => item.is_combat_item);
    console.log(items.length);

    setItems(data.items);
  };

  // fetch on visible

  useEffect(() => {
    if (!props.isVisible) return;
    fetchItems();
  }, [props.isVisible]);

  const handleLoomiePress = useCallback((id: string) => {
    console.log('Info: Item pressed: ', id);

    props.submitCallback(id);
    props.toggleVisibilityCallback();
  }, []);

  return (
    <Modal
      isVisible={props.isVisible}
      onBackButtonPress={props.toggleVisibilityCallback}
      onBackdropPress={props.toggleVisibilityCallback}
      style={Styles.modal}
    >
      <Text style={Styles.modalTitle}>Items</Text>
      <View style={{ flex: 1, marginVertical: 8 }}>
        {items.length === 0 ? (
          <EmptyMessage text={"You don't have any items"} showButton={false} />
        ) : (
          <SelectItemGrid items={items} submitItem={handleLoomiePress} />
        )}
      </View>
      <View style={Styles.containerButton}>
        <CustomButton
          title='Cancel'
          type='primary'
          callback={props.toggleVisibilityCallback}
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
