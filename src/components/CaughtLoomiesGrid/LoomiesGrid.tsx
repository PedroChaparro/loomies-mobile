import { TCaughtLoomies } from '@src/types/types';
import React from 'react';
import { FlatList } from 'react-native';
import { LoomieCard } from './CaughtLoomieCard';

interface IProps {
  loomies: Array<TCaughtLoomies>;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  elementsCallback: (a?: any) => void;
  avoidNavigation?: boolean;
}

export const LoomiesGrid = ({
  loomies,
  avoidNavigation,
  elementsCallback
}: IProps) => {
  return (
    <FlatList
      style={{ marginBottom: avoidNavigation ? 44 : 0 }}
      data={loomies}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => {
        // Sort the types lexicographically to avoid the bg suddenly changing
        item.types = item.types.sort();
        return <LoomieCard loomie={item} cardCallback={elementsCallback} />;
      }}
    />
  );
};
