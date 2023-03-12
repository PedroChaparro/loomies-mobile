import { TCaughtLoomies } from '@src/types/types';
import { getLoomieColorFromType } from '@src/utils/utils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface IProps {
  loomie: TCaughtLoomies;
}

export const LoomieCard = ({ loomie }: IProps) => {
  const handleCardClick = () => console.log('Card clicked!');

  // Get the color from the first type
  const typeColor = getLoomieColorFromType(loomie.types[0]);

  return (
    <TouchableWithoutFeedback onPress={handleCardClick}>
      <View style={Styles.card}>
        {/* Inner spacing to create a gap between the elements */}
        <View style={Styles.spacing}>
          <View style={{ ...Styles.background, backgroundColor: typeColor }}>
            <Text>{loomie.name}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 200,
    aspectRatio: 1
  },
  spacing: {
    flex: 1,
    padding: 8
  },
  background: {
    flex: 1,
    borderRadius: 12,
    padding: 8
  }
});
