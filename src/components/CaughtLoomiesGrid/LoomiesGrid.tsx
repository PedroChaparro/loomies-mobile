import { TCaughtLoomiesWithTeam } from '@src/types/types';
import React from 'react';
import { FlatList, View } from 'react-native';
import { LoomieCard } from './CaughtLoomieCard';

interface IProps {
  loomies: Array<TCaughtLoomiesWithTeam>;
  markBusyLoomies: boolean;
  markTeamLoomies: boolean;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  elementsCallback: (a?: any) => void;
  listHeaderComponent?: React.ReactElement;
}

export const LoomiesGrid = ({
  loomies,
  markBusyLoomies,
  markTeamLoomies,
  elementsCallback,
  listHeaderComponent
}: IProps) => {
  // Sort the busy loomies to the end
  loomies.sort((a, b) => Number(a.is_busy) - Number(b.is_busy));

  return (
    <FlatList
      ListHeaderComponent={listHeaderComponent || <View />}
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
            markIfInTeam={markTeamLoomies}
            cardCallback={elementsCallback}
          />
        );
      }}
    />
  );
};
