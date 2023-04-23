import { TInventoryItem, TItem } from '@src/types/types';
import React, { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ItemCard } from './ItemCard';
import { ItemDetailsModal } from '../Modals/ItemDetailsModal';

interface IProps {
  items: Array<TItem>;
  inventory: Array<TInventoryItem>;
  refresh: () => void;
}

export const ItemGrid = ({ inventory, items, refresh }: IProps) => {
  const [itemModalVisible, setItemModalVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);

  const toggleItemModalVisibility = () => {
    setItemModalVisible(!itemModalVisible);
  };

  const handleItemPress = (item: TInventoryItem) => {
    // Find the item by the id and show the information
    const clickedItem = items.find((i) => i._id === item._id);

    if (clickedItem) {
      setSelectedItem(clickedItem);
      toggleItemModalVisibility();
    }
  };

  return (
    <>
      {selectedItem && (
        <ItemDetailsModal
          isVisible={itemModalVisible}
          toggleVisibility={toggleItemModalVisibility}
          item={selectedItem}
          refresh={refresh}
        />
      )}
      <FlatList
        extraData={inventory}
        data={inventory}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            // If the item is not a loomball, pass the callback to open the item modal
            handleClickCallback={
              item.type === 'item' ? handleItemPress : undefined
            }
          />
        )}
        numColumns={2}
      />
    </>
  );
};
