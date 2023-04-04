import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CustomButton } from '../components/CustomButton';
import { NavigationProp } from '@react-navigation/core';
import { useAuth } from '../hooks/useAuth';
import { useToastAlert } from '../hooks/useToastAlert';

interface LoginProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const Login = ({ navigation }: LoginProps) => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { showInfoToast, showErrorToast } = useToastAlert();

  // Redirects to the map view if the user is already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated()) {
      showInfoToast('You are already logged in');
      navigation.navigate('Map');
    }
  }, [isLoading]);

  const redirectToSignup = () => {
    navigation.navigate('Signup');
  };
  const redirectToEmailVal = () => {
    navigation.navigate('EmailValidation', { email: formik.values.email });
  };
  const redirectToResetPassword = () => {
    navigation.navigate('ResetPassword', { email: formik.values.email });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().required()
    }),
    onSubmit: async (values) => {
      const [response, error] = await login(values.email, values.password);

      if (error && response?.message) {
        showErrorToast(response?.message);
      }
    }
  });

  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <Text style={Styles.headerTitle}>Login</Text>
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
          {/* Shows the email validation error if exists */}
          {formik.errors.email && (
            <Text style={Styles.formError}>*{formik.errors.email}</Text>
          )}
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
            title='Login'
            type='primary'
            callback={formik.handleSubmit}
          />
          <CustomButton
            title='Validate account'
            type='primary'
            callback={redirectToEmailVal}
          />
        </View>
        <View style={Styles.redirect}>
          <Pressable onPress={redirectToSignup}>
            <Text style={Styles.redirectText}>
              Does not have an account? Sign-up
            </Text>
          </Pressable>
          <Pressable onPress={redirectToResetPassword}>
            <Text style={Styles.redirectText}>
              Forgot your Password? Reset Your Password
            </Text>
          </Pressable>
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
  },
  redirect: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16
  },
  redirectText: {
    color: '#5C5C5C',
    textAlign: 'center',
    padding: 4
  }
});
