import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from './navigation/StackNavigation';
import { AuthProvider } from './context/AuthContext';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
