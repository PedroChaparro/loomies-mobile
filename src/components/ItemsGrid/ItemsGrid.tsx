import { TInventoryItem, TItem } from '@src/types/types';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ItemCard } from './ItemCard';

interface IProps {
  items: Array<TItem>;
  inventory: Array<TInventoryItem>;
}

export const ItemGrid = ({ inventory, items }: IProps) => {
  const handleItemPress = (item: TInventoryItem) => {
    // Find the item by the id and show the information
    const clickedItem = items.find((i) => i._id === item._id);
    // The information contains all the required fields to show the modal
    console.log(clickedItem);
  };

  return (
    <FlatList
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
  );
};
