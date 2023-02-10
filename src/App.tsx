import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomNavigation } from './navigation/BottomNavigation';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <BottomNavigation />
    </NavigationContainer>
  );
}

export default App;
