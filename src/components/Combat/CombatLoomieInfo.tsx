import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './combatStyles';
import { iLoomie } from '@src/types/combatInterfaces';

interface iPropsCombatLoomieInfo {
  loomie: iLoomie;
}

export const CombatLoomieInfo = ({ loomie }: iPropsCombatLoomieInfo) => {
  const healthPercentage = loomie
    ? `${Math.min(100, Math.max(0, (loomie.hp / loomie.boosted_hp) * 100))}%`
    : '100%';
  console.log(healthPercentage);

  return (
    <View style={styles.loomieInfoContainer}>
      <View style={{ width: '100%', marginBottom: 3 }}>
        <Text style={styles.infoText}>{loomie.name}</Text>
        <Text style={{ ...styles.infoText, position: 'absolute', right: 0 }}>
          Lvl {loomie.level}
        </Text>
      </View>
      <View style={styles.healthBackground}>
        <View style={{ ...styles.health, width: healthPercentage }}></View>
      </View>
      <View style={{ width: '100%', marginBottom: 5 }}>
        <Text style={styles.healthText}>
          {loomie.hp} / {loomie.boosted_hp}
        </Text>
      </View>
    </View>
  );
};
