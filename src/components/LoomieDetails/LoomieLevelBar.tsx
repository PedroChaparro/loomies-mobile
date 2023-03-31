import { getRequiredExperienceFromLevel } from '@src/utils/utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  experience: number;
  level: number;
  color: string;
}

export const LoomieLevelBar = ({ level, experience, color }: IProps) => {
  let currentLevelPercentage =
    (experience * 100) / getRequiredExperienceFromLevel(level + 1);

  currentLevelPercentage = Math.min(currentLevelPercentage, 100);

  return (
    <View style={Styles.levelContainer}>
      <Text style={Styles.levelLabel}>Lvl {level}</Text>
      <View style={Styles.levelBackground}>
        <View
          style={{
            width: `${currentLevelPercentage}%`,
            height: '100%',
            backgroundColor: color
          }}
        ></View>
      </View>
      <Text style={Styles.levelLabel}>Lvl {level + 1}</Text>
    </View>
  );
};

const Styles = StyleSheet.create({
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  levelLabel: {
    minWidth: 64,
    textAlign: 'center'
  },
  levelBackground: {
    flex: 1,
    marginHorizontal: 16,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#F1F1F1',
    overflow: 'hidden'
  }
});
