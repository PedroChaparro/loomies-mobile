import { NavigationProp } from '@react-navigation/native';
import { TCaughtLoomies } from '@src/types/types';
import { colors, images } from '@src/utils/utils';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
  loomie: TCaughtLoomies;
}

export const LoomieCard = ({ navigation, loomie }: IProps) => {
  const handleCardClick = () => {
    // Navigate to the details page
    navigation.navigate('LoomieDetails', { loomie });
  };

  // Get the color from the first type
  const mainColor = loomie.types[0].toUpperCase();
  const typeColor = colors[mainColor];
  const loomieSerial = `${loomie.serial.toString().padStart(3, '0')}`;

  return (
    <View style={Styles.card}>
      <TouchableWithoutFeedback onPress={handleCardClick}>
        {/* Inner spacing to create a gap between the elements */}
        <View style={Styles.spacing}>
          <View style={{ ...Styles.background, backgroundColor: typeColor }}>
            <Text style={{ ...Styles.loomieSerial, ...Styles.cardText }}>
              #{loomieSerial}
            </Text>
            <View style={Styles.cardImageBg} />
            <Image source={images[loomieSerial]} style={Styles.cardImage} />
            <View style={Styles.cardInfoContainer}>
              <Text style={{ ...Styles.cardInfoText, ...Styles.cardText }}>
                Lvl {loomie.level}
              </Text>
              <Text
                style={{ ...Styles.cardInfoText, ...Styles.loomieName }}
                numberOfLines={2}
                ellipsizeMode='tail'
              >
                {loomie.name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const Styles = StyleSheet.create({
  card: {
    // Take the entire width of the column but prevent
    // columns with the same width of the screen.
    flex: 1,
    maxWidth: '50%'
  },
  spacing: {
    flex: 1,
    padding: 10
  },
  background: {
    borderRadius: 12,
    elevation: 6,
    flex: 1,
    padding: 16,
    shadowColor: '#7c7c7c'
  },
  cardImageBg: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.065)',
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
  cardText: {
    color: '#5C5C5C'
  },
  cardInfoText: {
    textAlign: 'center',
    fontSize: 16,
    textTransform: 'capitalize'
  },
  loomieSerial: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  loomieName: {
    color: '#5C5C5C',
    // 40pt equals 2 lines with the current font size
    height: 40,
    fontWeight: '500'
  }
});
