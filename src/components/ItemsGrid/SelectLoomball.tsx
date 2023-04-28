import { TInventoryItem, TLoomball } from '@src/types/types';
import React, { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { ItemCard } from './ItemCard';

interface iPropsSelectLoomball {
  loomBall: Array<TLoomball>;
  //submitItem: (_itemId: string) => void;
}

export const SelectLoomball = ({
  loomBall /*,submitItem*/
}: iPropsSelectLoomball) => {
  const [selectedItem, setSelectedItem] = useState<TLoomball | null>(null);

  const handleItemPress = (SelectLommBall: TLoomball) => {
    setSelectedItem(SelectLommBall);
    console.log(selectedItem);
  };

  return (
    <>
      <FlatList
        data={loomBall}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemCard
            item={{ ...item, type: 'loomball' } as TInventoryItem}
            handleClickCallback={handleItemPress}
          />
        )}
        numColumns={2}
      />
    </>
  );
};
