import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

interface IProps {
  hp: number;
  defense: number;
  attack: number;
}

export const LoomieStatsTable = ({ hp, defense, attack }: IProps) => {
  const statsData = [
    {
      title: 'Stats',
      data: [
        { title: 'HP', value: hp },
        { title: 'Attack', value: attack },
        { title: 'Defense', value: defense }
      ]
    }
  ];

  return (
    <View style={Styles.container}>
      <SectionList
        sections={statsData}
        renderItem={({ item }) => {
          return (
            <View style={Styles.statsRow}>
              <Text style={{ color: '#7c7c7c' }}>{item.title}</Text>
              <Text style={{ color: '#7c7c7c' }}>{item.value}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    marginVertical: 8
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede'
  }
});
