import { NavigationProp } from '@react-navigation/native';
import { TCaughtLoomies } from '@src/types/types';
import React from 'react';
import { FlatList } from 'react-native';
import { LoomieCard } from './CaughtLoomieCard';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
  loomies: Array<TCaughtLoomies>;
}

export const LoomiesGrid = ({ navigation, loomies }: IProps) => {
  return (
    <FlatList
      data={loomies}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => (
        <LoomieCard loomie={item} navigation={navigation} />
      )}
    />
  );
};
