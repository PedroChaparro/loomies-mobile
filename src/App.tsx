import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigation } from './navigation/StackNavigation';
import { AuthProvider } from './context/AuthContext';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StackNavigation />
        {/* Toast must be the las element in the components tree to be used from any file */}
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
