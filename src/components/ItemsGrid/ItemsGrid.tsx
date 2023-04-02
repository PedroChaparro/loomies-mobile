import { TInventoryItem } from '@src/types/types';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ItemCard } from './ItemCard';

interface IProps {
  items: Array<TInventoryItem>;
}

export const ItemGrid = ({ items }: IProps) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <ItemCard item={item} />}
      numColumns={2}
    />
  );
};
