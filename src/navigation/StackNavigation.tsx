import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapView } from '../pages/MapView';
import { CaptureView } from '../pages/CaptureView';
import { CombatView } from '../pages/CombatView';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { BottomNavigation } from './BottomNavigation';
import { MapProvider } from '@src/context/MapProvider';
import { EmailValidationView } from '../pages/EmailValidationView';
import { NewCodeView } from '../pages/NewCodeView';

const Stack = createStackNavigator();
export const StackNavigation = () => {
  // Map provider at the top so that the map data is kept between screens
  return (
    <MapProvider>
      <Stack.Navigator
        initialRouteName='Map'
        screenOptions={{ headerShown: false }}
      >
        {/* Views that are not included in the bottom tabs navigation but are reachable using the navigator hook */}
        <Stack.Screen name='Map' component={MapView} />
        <Stack.Screen name='Capture' component={CaptureView} />
        <Stack.Screen name='Combat' component={CombatView} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='EmailValidation' component={EmailValidationView} />
        <Stack.Screen name='NewCode' component={NewCodeView} />
        {/* Views that includes the bottom tabs navigation */}
        <Stack.Screen name='Application' component={BottomNavigation} />
      </Stack.Navigator>
    </MapProvider>
  );
};
