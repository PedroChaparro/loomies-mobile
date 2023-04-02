import { TInventoryItem } from '@src/types/types';
import { images } from '@src/utils/utils';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface IProps {
  item: TInventoryItem;
}

export const ItemCard = ({ item }: IProps) => {
  const itemSerial = item.serial.toString().padStart(3, '0');

  return (
    <View style={Styles.card}>
      <TouchableWithoutFeedback
        onPress={() => {
          console.log('Card clicked!');
        }}
      >
        <View style={Styles.spacing}>
          <View style={Styles.background}>
            <Text style={{ ...Styles.itemQuantity, ...Styles.cardText }}>
              x{item.quantity}
            </Text>
            <View style={Styles.cardImageBg} />
            <Image
              source={images[`O-${itemSerial}`]}
              style={Styles.cardImage}
            />
            <View style={Styles.cardInfoContainer}>
              <Text
                style={{ ...Styles.cardInfoText, ...Styles.itemName }}
                numberOfLines={2}
                ellipsizeMode='tail'
              >
                {item.name}
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
    shadowColor: '#7c7c7c',
    backgroundColor: '#DEDEDE'
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
  itemQuantity: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  itemName: {
    color: '#5C5C5C',
    marginTop: 8,
    height: 40,
    fontWeight: 'bold'
  }
});
