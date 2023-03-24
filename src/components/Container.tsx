import React from 'react';
import { StyleSheet, View } from 'react-native';

interface IProps {
  children: React.ReactNode;
}

// Reusable component to wrap the contend and add some padding
export const Container = ({ children }: IProps) => {
  return <View style={Styles.container}>{children}</View>;
};

const Styles = StyleSheet.create({
  container: {
    padding: 8
  }
});
