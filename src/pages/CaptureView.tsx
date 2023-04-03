import React from 'react';
import { RouteProp } from '@react-navigation/core';
import { View, Text } from 'react-native';

interface CaptureViewProps {
  route: RouteProp<{ params: { loomieId: string } }, 'params'>;
}

export const CaptureView = ({ route }: CaptureViewProps) => {
  return (
    <View>
      <Text style={{ color: '#000' }}>Capture view</Text>
      <Text style={{ color: '#000' }}>Loomie: {route.params.loomieId}</Text>
    </View>
  );
};
