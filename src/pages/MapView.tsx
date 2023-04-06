import { NavigationProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useToastAlert } from '../hooks/useToastAlert';
import { Map3D } from '@src/components/Map3D/Map3D';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ModalGym } from '@src/components/ModalDialogs/ModalGym';
import { GymsModalProvider } from '@src/context/GymsModalContext';

interface MapViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const MapView = ({ navigation }: MapViewProps) => {
  const { isLoading, isAuthenticated } = useAuth();
  const { showInfoToast } = useToastAlert();

  // Redirects to the login view if the user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      showInfoToast('You are not logged in');
      navigation.navigate('Login');
    }
  }, [isLoading]);

  return (
    <GymsModalProvider>
      <View style={Styles.container}>
        <Map3D />
        <ModalGym />
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            position: 'absolute',
            bottom: 20,
            right: 20,
            height: 70,
            backgroundColor: '#00000044',
            borderRadius: 200
          }}
          onPress={() => {
            navigation.navigate('Application', { screen: 'Loomies' });
          }}
        >
          <FeatherIcon name={'briefcase'} size={28} color={'white'} />
        </Pressable>
      </View>
    </GymsModalProvider>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
