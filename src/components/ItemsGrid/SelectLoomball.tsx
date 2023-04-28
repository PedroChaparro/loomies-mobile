import { TLoomball } from '@src/types/types';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { LoomBallCard } from './LoomBallCard';

interface iPropsSelectLoomball {
  loomBall: Array<TLoomball>;
  markIfSelected: boolean;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  elementsCallback: (a?: any) => void;
}

export const SelectLoomball = ({
  loomBall,
  markIfSelected,
  elementsCallback
}: iPropsSelectLoomball) => {
  return (
    <>
      <FlatList
        data={loomBall}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <LoomBallCard
            loomBall={item}
            markIfSelected={markIfSelected}
            cardCallback={elementsCallback}
          />
        )}
        numColumns={2}
      />
    </>
  );
};
