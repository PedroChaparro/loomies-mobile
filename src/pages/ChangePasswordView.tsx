import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { NavigationProp, RouteProp } from '@react-navigation/core';
import { CustomButton } from '../components/CustomButton';
import { resetPasswordRequest } from '../services/user.services';
import { useToastAlert } from '../hooks/useToastAlert';

interface ChangePasswordViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: NavigationProp<any, any>;
  route?: RouteProp<{ params: { email: string } }, 'params'>;
}

export const ChangePasswordView = ({
  navigation,
  route
}: ChangePasswordViewProps) => {
  const { showSuccessToast, showErrorToast } = useToastAlert();

  const redirectToLogin = () => {
    navigation?.navigate('Login', { email: formik.values.email });
  };

  // Try to get the email from the params
  const email = route?.params?.email || '';

  const formik = useFormik({
    initialValues: {
      code: '',
      email: email || '',
      password: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[)(;.,\][}{_=@$!¡#%*?¿&^+-/<>|~'"])[A-Za-z\d)(;.,\][}{_=@$!¡#%*?¿&^+-/<>|~'"]{8,}$/,
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required()
    }),
    onSubmit: async (values) => {
      const [response, error] = await resetPasswordRequest(
        values.code,
        values.email,
        values.password
      );
      if (error && response?.message) {
        showErrorToast(response?.message);
      } else {
        showSuccessToast(response?.message);
        redirectToLogin();
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
          <TextInput
            style={{ ...Styles.formField, marginTop: 8 }}
            placeholderTextColor={'#9C9C9C'}
            placeholder='Insert Your Code'
            autoCapitalize='none'
            value={formik.values.code}
            onChangeText={formik.handleChange('code')}
          />
          <TextInput
            style={{ ...Styles.formField, marginTop: 8 }}
            placeholderTextColor={'#9C9C9C'}
            placeholder='********'
            secureTextEntry={true}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
          />
          {/* Shows the password validation error if exists */}
          {formik.errors.password && (
            <Text style={Styles.formError}>*{formik.errors.password}</Text>
          )}
          <CustomButton
            title='Change Password'
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
  },
  formError: {
    color: '#ED4A5F',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }
});
