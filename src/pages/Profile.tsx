import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Button, Text, View } from 'react-native';

interface ProfileProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  navigation: NavigationProp<any, any>;
}

export const Profile = ({ navigation }: ProfileProps) => {
  return (
    <View>
      <Text>Profile</Text>
      <Button
        title='Go to capture'
        onPress={() => navigation.navigate('Capture')}
      />
    </View>
  );
};
