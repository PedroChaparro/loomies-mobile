import { RouteProp } from '@react-navigation/core';
import { TCaughtLoomies } from '@src/types/types';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@src/utils/utils';
import { LoomieStat } from '@src/components/LoomieDetails/LoomieStat';

interface IProps {
  route?: RouteProp<{ params: { loomie: TCaughtLoomies } }, 'params'>;
}

export const LoomieDetails = ({ route }: IProps) => {
  const [loomie, setLoomie] = useState<TCaughtLoomies | null>(null);

  useEffect(() => {
    // Try to get the loomie from the route params
    const loomieFromRoute = route?.params?.loomie;
    if (loomieFromRoute) setLoomie(loomieFromRoute);
  }, []);

  if (!loomie) return null;
  const mainColor = loomie.types[0].toUpperCase();
  const typeColor = colors[mainColor];

  return (
    <View style={{ ...Styles.background, backgroundColor: typeColor }}>
      <View style={Styles.scenario}></View>
      <View style={Styles.information}>
        <View style={Styles.row}>
          <Text style={Styles.loomieName}>{loomie.name}</Text>
          {loomie.types.map((type) => (
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
        </View>
        <View style={Styles.row}>
          <Text style={Styles.loomieLevel}>Lvl {loomie.level}</Text>
        </View>
        <View style={{ ...Styles.row, ...Styles.stats }}>
          <LoomieStat
            name='HP'
            value={loomie.hp}
            color={colors[loomie.types[0].toUpperCase()]}
          />
          <LoomieStat
            name='ATK'
            value={loomie.attack}
            color={colors[loomie.types[0].toUpperCase()]}
          />
          <LoomieStat
            name='DEF'
            value={loomie.defense}
            color={colors[loomie.types[0].toUpperCase()]}
          />
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  background: {
    flex: 1
  },
  scenario: {
    height: '40%',
    zIndex: 1
  },

  information: {
    flex: 1,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    backgroundColor: 'white',
    padding: 32
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  loomieName: {
    color: '#5C5C5C',
    fontWeight: 'bold',
    fontSize: 24,
    marginRight: 8
  },
  loomieType: {
    color: '#5C5C5C',
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4
  },
  loomieLevel: {
    fontSize: 18
  },
  stats: {
    flexDirection: 'column'
  }
});
