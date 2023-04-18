import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CustomButton } from './CustomButton';

interface IProps {
  text: string;
  showButton?: boolean;
  buttonText?: string;
  buttonCallback?: () => void;
}

export const EmptyMessage = ({
  text,
  showButton,
  buttonText,
  buttonCallback
}: IProps) => {
  const renderButton = () => {
    if (!showButton || !buttonText || !buttonCallback) return null;

    return (
      <CustomButton
        type='primary'
        title={buttonText}
        callback={buttonCallback}
      />
    );
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.box}>
        <Text style={Styles.boxText}>{text}</Text>
        {renderButton()}
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  // Take the entire height and place the box in the center
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  box: {
    padding: 20,
    width: '80%',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dotted',
    borderColor: '#BDBDBD',
    borderWidth: 3
    // Add a separation between the dots of the dotted border
  },
  boxText: {
    color: '#5C5C5C'
  }
});
