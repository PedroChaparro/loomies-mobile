import { colors } from '@src/utils/utils';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface IProps {
  types: Array<string>;
}

export const LoomieTypes = ({ types }: IProps) => {
  return (
    <>
      {types.map((type) => (
        <Text
          key={type}
          style={{
            ...Styles.loomieType,
            backgroundColor: colors[type.toUpperCase()]
          }}
        >
          {type}
        </Text>
      ))}
    </>
  );
};

const Styles = StyleSheet.create({
  loomieType: {
    color: '#5C5C5C',
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4
  }
});
