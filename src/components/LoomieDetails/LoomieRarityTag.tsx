import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  rarity: string;
}

const backgroundMap: Record<string, string> = {
  Rare: '#e8ddee',
  Common: '#dceedd',
  Normal: '#fcecc7'
};

export const LoomieRarityTag = ({ rarity }: IProps) => {
  const backgroundColor = backgroundMap[rarity];
  return (
    <View style={[Styles.tagBackground, { backgroundColor }]}>
      <Text style={Styles.linkText}>{rarity}</Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  linkText: {
    color: '#5c5c5c'
  },
  tagBackground: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderRadius: 30,
    paddingVertical: 4,
    paddingHorizontal: 16
  }
});
