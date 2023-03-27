import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  name: string;
  value: number;
  color: string;
}

export const LoomieStat = ({ name, value, color }: IProps) => {
  // TODO: Refactor this to use the maxStat from the API
  const maxStat = 200;
  let percentage = (value * 100) / maxStat;
  percentage = Math.min(percentage, 100);

  return (
    <View style={Styles.stat}>
      <Text style={Styles.statText}>{name}</Text>
      <View style={Styles.barBackground}>
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color
          }}
        />
      </View>
      <Text style={Styles.statText}>{value}</Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12
  },
  statText: {
    color: '#5C5C5C',
    minWidth: 32,
    textAlign: 'center'
  },
  barBackground: {
    flex: 1,
    marginHorizontal: 16,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#F1F1F1',
    overflow: 'hidden'
  }
});
