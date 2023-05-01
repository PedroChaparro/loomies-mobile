import {
  NavigationProp,
  useFocusEffect,
  useIsFocused
} from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { useAuth } from '../hooks/useAuth';
import { useToastAlert } from '../hooks/useToastAlert';
import { Map3D } from '@src/components/Map3D/Map3D';
import { APP_SCENE, BabylonContext } from '@src/context/BabylonProvider';
import { ModalGym } from '@src/components/Modals/Gyms/ModalGym';
import { ModalCongratsCapture } from '@src/components/Modals/Capture/ModalCongratsCapture';

interface MapViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const MapView = ({ navigation }: MapViewProps) => {
  const isFocused = useIsFocused();
  const { isLoading, isAuthenticated } = useAuth();
  const { showInfoToast } = useToastAlert();
  const { showScene } = useContext(BabylonContext);

  // Redirects to the login view if the user is not authenticated
  useEffect(() => {
    if (isFocused && !isLoading && !isAuthenticated()) {
      showInfoToast('You are not logged in');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    }
  }, [isLoading, isFocused]);

  // toggle render loop on focus events
  useFocusEffect(
    React.useCallback(() => {
      showScene(APP_SCENE.MAP);
      return () => showScene(APP_SCENE.NONE);
    }, [])
  );

  return (
    <View style={Styles.container}>
      <Map3D />
      <ModalGym />
      <ModalCongratsCapture />
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
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
