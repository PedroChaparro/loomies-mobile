import { TCaughtLoomies } from '@src/types/types';
import React from 'react';
import { FlatList } from 'react-native';
import { LoomieCard } from './CaughtLoomieCard';

interface IProps {
  loomies: Array<TCaughtLoomies>;
}

export const LoomiesGrid = ({ loomies }: IProps) => {
  return (
    <FlatList
      data={loomies}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => <LoomieCard loomie={item} />}
    />
  );
};
