import { TCaughtLoomies } from '@src/types/types';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { LoomieCard } from './CaughtLoomieCard';

interface IProps {
  loomies: Array<TCaughtLoomies>;
}

export const LoomiesGrid = ({ loomies }: IProps) => {
  return (
    <FlatList
      style={Styles.container}
      data={loomies}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => <LoomieCard loomie={item} />}
    />
  );
};

const Styles = StyleSheet.create({
  container: {
    // Bottom margin to avoid overlapping with the bottom tab bar
    marginBottom: 44
  }
});
