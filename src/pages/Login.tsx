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

      if (error && response.message) {
        showErrorToast(response.message);
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
            placeholder='email'
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
          />
          {/* Shows the email validation error if exists */}
          {formik.errors.email && (
            <Text style={Styles.formError}>*{formik.errors.email}</Text>
          )}
          <TextInput
            style={{ ...Styles.formField, marginTop: 8 }}
            secureTextEntry={true}
            placeholder='********'
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
        </View>
        <View style={Styles.redirect}>
          <Pressable onPress={redirectToSignup}>
            <Text>Does not have an account? Sign-up</Text>
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
    flex: 1,
    alignContent: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#ED4A5F'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 96
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  form: {
    alignSelf: 'center',
    width: '80%',
    marginTop: -64,
    backgroundColor: '#fff',
    padding: 12
  },
  formField: {
    backgroundColor: '#ECECEC',
    paddingHorizontal: 16
  },
  formError: {
    textTransform: 'capitalize',
    color: '#ED4A5F',
    fontSize: 12,
    fontWeight: 'bold'
  },
  redirect: {
    flex: 1,
    padding: 16,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  }
});
