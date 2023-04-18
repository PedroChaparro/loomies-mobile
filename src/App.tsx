import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from './navigation/StackNavigation';
import { AuthProvider } from './context/AuthContext';
import { navigationRef } from '@src/navigation/RootNavigation';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <StackNavigation />
        {/* Toast must be the las element in the components tree to be used from any file */}
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
