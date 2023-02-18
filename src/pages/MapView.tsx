import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

interface MapViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

const Screens = [
  { name: 'Profile' },
  { name: 'Loomies' },
  { name: 'Inventory' }
];

export const MapView = ({ navigation }: MapViewProps) => {
  const { isLoading, isAuthenticated } = useAuth();

  // Redirects to the login view if the user is not authenticated
  if (!isLoading && !isAuthenticated()) {
    navigation.navigate('Login');
  }

  return (
    <View style={Styles.container}>
      <Text>Map view</Text>
      {Screens.map((screen) => (
        <Button
          key={screen.name}
          title={screen.name}
          onPress={() =>
            navigation.navigate('Application', { screen: screen.name })
          }
        />
      ))}
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 12
  }
});
