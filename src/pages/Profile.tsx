import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/core';
import { CustomButton } from '../components/CustomButton';

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
        <Text style={Styles.mainTitle}>{user?.email}</Text>
        <TouchableOpacity
          style={Styles.linkCard}
          onPress={redirectToResetPassword}
        >
          <View style={Styles.groupIconText}>
            <FeatherIcon name={'lock'} size={20} color={'black'} />
            <Text style={Styles.linkText}>Reset Password</Text>
          </View>
          <FeatherIcon name={'chevron-right'} size={20} color={'black'} />
        </TouchableOpacity>
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
    marginTop: 100,
    marginBottom: 10,
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
  linkCard: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 4,
    paddingLeft: 8,
    width: '80%',
    backgroundColor: '#f2f1ed',
    justifyContent: 'space-between',
    height: 42,
    borderRadius: 4
  },
  groupIconText: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  linkText: {
    color: '#8f8f8f',
    marginLeft: 12
  },
  form: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: 0,
    padding: 12,
    width: '86%'
  }
});
