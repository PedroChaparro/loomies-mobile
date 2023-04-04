import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/core';
import { CustomButton } from '../components/CustomButton';
import { LinkCard } from '../components/LinkCard';

interface ProfileProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const Profile = ({ navigation }: ProfileProps) => {
  const redirectToResetPassword = () => {
    navigation.navigate('ResetPassword');
  };
  const { user } = useContext(AuthContext);
  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <Text style={Styles.headerTitle}>PROFILE</Text>
      </View>
      <View style={Styles.main}>
        <Text style={[Styles.mainTitle, Styles.mainTitleBold]}>
          {user?.username}
        </Text>
        <LinkCard
          iconName='lock'
          displayText='Reset Password'
          callback={redirectToResetPassword}
        />
        <View style={Styles.form}>
          {/* todo */}
          <CustomButton
            title='Log Out'
            type='primary'
            callback={() => console.log('Log Out')}
          />
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignContent: 'center',
    backgroundColor: '#ED4A5F',
    justifyContent: 'flex-end'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    justifyContent: 'center',
    padding: 50,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  main: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 18
  },
  mainTitle: {
    color: '#5C5C5C',
    textAlign: 'center',
    margin: 2,
    fontSize: 16
  },
  mainTitleBold: {
    fontWeight: 'bold'
  },
  form: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: 0,
    padding: 12,
    width: '86%'
  }
});
