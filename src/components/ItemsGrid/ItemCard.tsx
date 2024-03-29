import { TInventoryItem } from '@src/types/types';
import { images } from '@src/utils/utils';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';

interface IProps {
  item: TInventoryItem;
  handleClickCallback?: (_: TInventoryItem) => void;
}

export const ItemCard = ({ item, handleClickCallback }: IProps) => {
  const itemSerial = item.serial.toString().padStart(3, '0');

  return (
    <View style={Styles.card}>
      <Pressable
        onPress={() => {
          // Call the callback if it exists and pass the item
          handleClickCallback && handleClickCallback(item);
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
      </Pressable>
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
    backgroundColor: '#eaeaea'
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
