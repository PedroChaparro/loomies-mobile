import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface IProps {
  onPress: () => void;
  collection: string;
  name: string;
  bottom: number;
  right: number;
}

export const FloatingRedIcon = ({
  onPress,
  collection,
  name,
  bottom,
  right
}: IProps) => {
  const getIcon = () => {
    switch (collection) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcon name={name} size={36} color='white' />;
      case 'MaterialIcons':
        return <MaterialIcon name={name} size={36} color='white' />;
    }
  };

  return (
    <Pressable
      style={{ ...Styles.floatingButton, bottom, right }}
      onTouchEnd={onPress}
    >
      {getIcon()}
    </Pressable>
  );
};

const Styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    backgroundColor: '#ED4A5F',
    padding: 8,
    borderRadius: 50
  }
});
