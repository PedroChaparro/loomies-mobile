import React from 'react';
import { View } from 'react-native';

export function Gap({
  size,
  direction = 'horizontal'
}: {
  size: number;
  direction: string;
}) {
  return (
    <View style={{ [direction === 'horizontal' ? 'width' : 'height']: size }} />
  );
}
