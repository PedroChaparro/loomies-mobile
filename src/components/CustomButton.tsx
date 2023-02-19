import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonTypes = 'primary' | 'bordered';

interface IProps {
  title: string;
  type: ButtonTypes;
  callback: () => void;
}

export const CustomButton = ({ title, type, callback }: IProps) => {
  return (
    <Pressable style={GetButtonStyles(type)} onPress={() => callback()}>
      <Text style={GetButtonTextStyles(type)}>{title}</Text>
    </Pressable>
  );
};

// Get the styles for the button based on the type,
// This is an easily extensible pattern that allows you to add more button types
const GetButtonStyles = (type: ButtonTypes) => {
  let instanceStyles;

  if (type === 'primary') {
    instanceStyles = Styles.buttonPrimary;
  } else if (type === 'bordered') {
    instanceStyles = Styles.buttonBordered;
  }

  return { ...Styles.button, ...instanceStyles };
};

// Get the styles for the button text based on the type
const GetButtonTextStyles = (type: ButtonTypes) => {
  if (type === 'primary') {
    return Styles.buttonTextPrimary;
  } else if (type === 'bordered') {
    return Styles.buttonTextBordered;
  }
};

const Styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 1,
    marginVertical: 8
  },
  buttonPrimary: {
    backgroundColor: '#ED4A5F'
  },
  buttonTextPrimary: {
    color: '#fff'
  },
  buttonBordered: {
    backgroundColor: '#fff',
    borderColor: '#ED4A5F',
    borderWidth: 1
  },
  buttonTextBordered: {
    color: '#ED4A5F'
  }
});
