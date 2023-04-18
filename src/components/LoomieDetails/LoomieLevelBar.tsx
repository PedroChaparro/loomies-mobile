import { getRequiredExperienceFromLevel } from '@src/utils/utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  experience: number;
  level: number;
  color: string;
}

export const LoomieLevelBar = ({ level, experience, color }: IProps) => {
  const nextLevelRequiredExperience = getRequiredExperienceFromLevel(level + 1);

  let currentLevelPercentage =
    (experience * 100) / getRequiredExperienceFromLevel(level + 1);

  currentLevelPercentage = Math.min(currentLevelPercentage, 100);
  return (
    <View style={Styles.levelContainer}>
      <View style={Styles.levelTextsContainer}>
        <Text style={Styles.levelLabel}>Lvl {level}</Text>
        <Text numberOfLines={1} style={Styles.levelLabel}>
          Exp {Math.floor(experience)}
        </Text>
      </View>
      <View style={Styles.levelBackground}>
        <View
          style={{
            width: `${currentLevelPercentage}%`,
            height: '100%',
            backgroundColor: color
          }}
        ></View>
      </View>
      <View style={Styles.levelTextsContainer}>
        <Text style={Styles.levelLabel}>Lvl {level + 1}</Text>
        <Text numberOfLines={1} style={Styles.levelLabel}>
          Exp {Math.ceil(nextLevelRequiredExperience)}
        </Text>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12
  },
  levelTextsContainer: {
    maxWidth: 84
  },
  levelLabel: {
    minWidth: 68,
    maxWidth: 84,
    textAlign: 'center',
    color: '#7c7c7c'
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
