import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import { NavigationProp, RouteProp } from '@react-navigation/core';
import { CustomButton } from '../components/CustomButton';
import { resetCodePasswordRequest } from '../services/user.services';
import { useToastAlert } from '../hooks/useToastAlert';

interface ResetPasswordViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: NavigationProp<any, any>;
  route?: RouteProp<{ params: { email?: string } }, 'params'>;
}

export const ResetPasswordView = ({
  navigation,
  route
}: ResetPasswordViewProps) => {
  const { showSuccessToast, showErrorToast } = useToastAlert();

  const redirectToChangePassword = () => {
    navigation?.navigate('ChangePassword', { email: formik.values.email });
  };

  // Try to get the email from the params
  const email = route?.params?.email || '';

  const formik = useFormik({
    initialValues: {
      email: email || ''
    },
    onSubmit: async (values) => {
      const [response, error] = await resetCodePasswordRequest(values.email);
      if (error && response?.message) {
        showErrorToast(response?.message);
      } else {
        showSuccessToast(response?.message);
        redirectToChangePassword();
      }
    }
  });
  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <Text style={Styles.headerTitle}>Reset Your Password</Text>
      </View>
      <View style={Styles.footer}>
        <View style={Styles.form}>
          <TextInput
            style={Styles.formField}
            placeholderTextColor={'#9C9C9C'}
            placeholder='Email'
            autoCapitalize='none'
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
          />
          <CustomButton
            title='Send me a code!'
            type='primary'
            callback={formik.handleSubmit}
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
    flex: 1,
    justifyContent: 'flex-end'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 96,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  footer: {
    backgroundColor: '#fff',
    flex: 1
  },
  form: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: -64,
    padding: 12,
    width: '80%'
  },
  formField: {
    backgroundColor: '#ECECEC',
    color: '#6C6C6C',
    paddingHorizontal: 16
  }
});
