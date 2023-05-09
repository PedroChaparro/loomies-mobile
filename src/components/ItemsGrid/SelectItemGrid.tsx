import { TInventoryItem, TItem } from '@src/types/types';
import React, { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ItemCard } from './ItemCard';
import { SelectItemDetailsModal } from '../Modals/Combat/SelectItemDetailsModal';

interface iPropsSelectItemGrid {
  items: Array<TItem>;
  submitItem: (_itemId: string) => void;
}

export const SelectItemGrid = (props: iPropsSelectItemGrid) => {
  const [itemModalVisible, setItemModalVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);

  const toggleItemModalVisibility = (visible?: boolean) => {
    if (visible != undefined) setItemModalVisible(visible);
    else setItemModalVisible(!itemModalVisible);
  };

  const handleItemPress = (item: TInventoryItem) => {
    // Find the item by the id and show the information
    const clickedItem = props.items.find((i) => i._id === item._id);

    if (clickedItem) {
      setSelectedItem(clickedItem);
      toggleItemModalVisibility(true);
    }
  };

  return (
    <>
      {selectedItem && (
        <SelectItemDetailsModal
          isVisible={itemModalVisible}
          toggleVisibility={() => toggleItemModalVisibility()}
          submitItem={props.submitItem}
          item={selectedItem}
        />
      )}
      <FlatList
        data={props.items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemCard
            item={{ ...item, type: 'item' } as TInventoryItem}
            handleClickCallback={handleItemPress}
          />
        )}
        numColumns={2}
      />
    </>
  );
};
