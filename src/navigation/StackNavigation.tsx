import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapView } from '../pages/MapView';
import { CaptureView } from '../pages/CaptureView';
import { CombatView } from '../pages/CombatView';
import { BottomNavigation } from './BottomNavigation';

const Stack = createStackNavigator();
export const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName='Map'
      screenOptions={{ headerShown: false }}
    >
      {/* Views that are not included in the bottom tabs navigation but are reachable using the navigator hook */}
      <Stack.Screen name='Map' component={MapView} />
      <Stack.Screen name='Capture' component={CaptureView} />
      <Stack.Screen name='Combat' component={CombatView} />
      {/* Views that includes the bottom tabs navigation */}
      <Stack.Screen name='Application' component={BottomNavigation} />
    </Stack.Navigator>
  );
};
