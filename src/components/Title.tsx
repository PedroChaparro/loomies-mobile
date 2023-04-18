import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface IProps {
  text: string;
}

export const Title = ({ text }: IProps) => {
  return <Text style={Styles.title}>{text}</Text>;
};

const Styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginVertical: 8,
    color: '#ED4A5F'
  }
});
