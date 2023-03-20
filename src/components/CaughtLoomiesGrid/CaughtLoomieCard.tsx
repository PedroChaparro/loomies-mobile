import { TCaughtLoomies } from '@src/types/types';
import { colors, images } from '@src/utils/utils';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface IProps {
  loomie: TCaughtLoomies;
}

export const LoomieCard = ({ loomie }: IProps) => {
  const handleCardClick = () => console.log('Card clicked!');

  // Get the color from the first type
  const mainColor = loomie.types[0].toUpperCase();
  const typeColor = colors[mainColor];
  const loomieSerial = `${loomie.serial.toString().padStart(3, '0')}`;

  return (
    <TouchableWithoutFeedback onPress={handleCardClick}>
      <View style={Styles.card}>
        {/* Inner spacing to create a gap between the elements */}
        <View style={Styles.spacing}>
          <View style={{ ...Styles.background, backgroundColor: typeColor }}>
            <Text style={Styles.loomieSerial}>#{loomieSerial}</Text>
            <View style={Styles.cardImageBg} />
            <Image source={images[loomieSerial]} style={Styles.cardImage} />
            <View style={Styles.cardInfoContainer}>
              <Text style={{ ...Styles.cardInfoText, ...Styles.loomieLvl }}>
                Lvl {loomie.lvl}
              </Text>
              <Text style={{ ...Styles.cardInfoText, ...Styles.loomieName }}>
                {loomie.name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Styles = StyleSheet.create({
  card: {
    flex: 1,
    width: 200
  },
  spacing: {
    flex: 1,
    padding: 8
  },
  background: {
    borderRadius: 24,
    flex: 1,
    padding: 16
  },
  cardImageBg: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 24,
    height: 110,
    position: 'absolute',
    top: 24,
    transform: [{ rotate: '35deg' }],
    width: 110
  },
  cardImage: {
    alignSelf: 'center',
    height: 120,
    resizeMode: 'contain',
    width: 120
  },
  cardInfoContainer: {
    marginTop: 16
  },
  cardInfoText: {
    alignSelf: 'center',
    fontSize: 16,
    textTransform: 'capitalize'
  },
  loomieSerial: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  loomieLvl: {
    fontWeight: '500'
  },
  loomieName: {
    color: '#5C5C5C',
    fontWeight: 'bold'
  }
});
