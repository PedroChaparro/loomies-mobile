import { TCaughtLoomieToRender } from '@src/types/types';
import { colors, images } from '@src/utils/utils';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IProps {
  loomie: TCaughtLoomieToRender;
  markIfBusy: boolean;
  markIfSelected: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardCallback(_a: any): void;
}

export const LoomieCard = ({
  loomie,
  markIfBusy,
  markIfSelected,
  cardCallback
}: IProps) => {
  // Get the color from the first type
  const mainColor = loomie.types[0].toUpperCase();

  const typeColor =
    markIfBusy && loomie.is_busy ? '#c8c8c8' : colors[mainColor];

  const loomieSerial = `${loomie.serial.toString().padStart(3, '0')}`;

  // Function to render a border if the loomie is part of the user's team
  const renderBorder = () => {
    if (markIfSelected && loomie.is_selected) {
      return {
        borderColor: '#ED4A5F'
      };
    } else {
      return {
        borderColor: 'transparent'
      };
    }
  };

  const renderLoomieImage = () => {
    if (markIfBusy && loomie.is_busy) {
      return (
        <Grayscale>
          <Image source={images[loomieSerial]} style={Styles.cardImage} />
        </Grayscale>
      );
    } else {
      return <Image source={images[loomieSerial]} style={Styles.cardImage} />;
    }
  };

  return (
    <View style={Styles.card}>
      <Pressable onPress={() => cardCallback(loomie._id)}>
        {/* Inner spacing to create a gap between the elements */}
        <View style={Styles.spacing}>
          <View
            style={{
              ...Styles.background,
              ...renderBorder(),
              backgroundColor: typeColor
            }}
          >
            {/* Show an sword if the loomie is in the loomie team of the user */}
            {loomie.is_in_team && (
              <View style={Styles.floatingIconContainer}>
                <MaterialCommunityIcon name='sword' color={'white'} size={24} />
              </View>
            )}

            {/* Mark the busy loomies if the option is true */}
            {loomie.is_busy && (
              <View
                style={{
                  ...Styles.floatingIconContainer,
                  backgroundColor: '#aa4aed'
                }}
              >
                <MaterialCommunityIcon
                  name='shield-home'
                  color={'white'}
                  size={24}
                />
              </View>
            )}

            <Text style={{ ...Styles.loomieSerial, ...Styles.cardText }}>
              #{loomieSerial}
            </Text>
            <View style={Styles.cardImageBg} />
            {renderLoomieImage()}
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
      </Pressable>
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
    flex: 1,
    padding: 16,
    shadowColor: '#7c7c7c',
    borderWidth: 3,
    elevation: 4
  },
  floatingIconContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 36,
    height: 36,
    padding: 4,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ED4A5F'
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
    fontWeight: '500',
    marginTop: 2
  }
});
