import React from 'react';
import { FlatList } from 'react-native';
import { iLoomie } from '@src/types/combatInterfaces';
import { LoomieCombatCard } from './LoomieCombatCard';

interface IProps {
  loomies: Array<iLoomie>;
  markIsWeakenedLoomies: boolean;
  markSelectedLoomies: boolean;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  elementsCallback: (a?: any) => void;
}

export const LoomiesCombatGrid = ({
  loomies,
  markIsWeakenedLoomies,
  markSelectedLoomies,
  elementsCallback
}: IProps) => {
  return (
    <FlatList
      data={loomies}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={({ item }) => {
        // Sort the types lexicographically to avoid the bg suddenly changing
        item.types = item.types.sort();
        return (
          <LoomieCombatCard
            loomie={item}
            markIsWeakenedLoomies={markIsWeakenedLoomies}
            markIfSelected={markSelectedLoomies}
            cardCallback={elementsCallback}
          />
        );
      }}
    />
  );
};
