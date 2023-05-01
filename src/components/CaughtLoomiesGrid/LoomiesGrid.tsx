import { TCaughtLoomieToRender } from '@src/types/types';
import React from 'react';
import { FlatList } from 'react-native';
import { LoomieCard } from './CaughtLoomieCard';

interface IProps {
  loomies: Array<TCaughtLoomieToRender>;
  markBusyLoomies: boolean;
  markSelectedLoomies: boolean;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  elementsCallback: (a?: any) => void;
}

export const LoomiesGrid = ({
  loomies,
  markBusyLoomies,
  markSelectedLoomies,
  elementsCallback
}: IProps) => {
  // Sort the busy loomies to the end
  loomies.sort((a, b) => Number(a.is_busy) - Number(b.is_busy));

  return (
    <FlatList
      data={loomies}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => {
        // Sort the types lexicographically to avoid the bg suddenly changing
        item.types = item.types.sort();
        return (
          <LoomieCard
            loomie={item}
            markIfBusy={markBusyLoomies}
            markIfSelected={markSelectedLoomies}
            cardCallback={elementsCallback}
          />
        );
      }}
    />
  );
};
