import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NavigationProp } from '@react-navigation/core';
import { CustomButton } from '../components/CustomButton';
import { signupRequest } from '../services/user.services';
import { useToastAlert } from '../hooks/useToastAlert';

interface SignupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
}

export const Signup = ({ navigation }: SignupProps) => {
  const { showSuccessToast, showErrorToast } = useToastAlert();

  const redirectToLogin = () => {
    navigation.navigate('Login');
  };
  const redirectToEmailValidation = () => {
    // Redirect to the validation screen and pass the email as a param
    // to auto fill the input
    navigation.navigate('EmailValidation', { email: formik.values.email });
  };

  const formik = useFormik({
    initialValues: {
      'email': '',
      'username': '',
      'password': '',
      'password confirmation': ''
    },
    validationSchema: Yup.object({
      'email': Yup.string().email().required(),
      'username': Yup.string().required(),
      'password': Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[)(;.,\][}{_=@$!¡#%*?¿&^+-/<>|~'"])[A-Za-z\d)(;.,\][}{_=@$!¡#%*?¿&^+-/<>|~'"]{8,}$/,
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required(),
      'password confirmation': Yup.string()
        .required()
        .oneOf([Yup.ref('password')], 'Passwords must match')
    }),

    onSubmit: async (values) => {
      const [response, error] = await signupRequest(
        values.email,
        values.username,
        values.password
      );
      if (error && response?.message) {
        showErrorToast(response?.message);
      } else {
        showSuccessToast('User created succesfully, now confirm your Email');
        redirectToEmailValidation();
      }
    }
  });
  return (
    <View style={Styles.container}>
      <View style={Styles.header}>
        <Text style={Styles.headerTitle}>SIGNUP</Text>
      </View>
      <View style={Styles.footer}>
        <View style={Styles.form}>
          <TextInput
            style={Styles.formField}
            placeholderTextColor={'#9C9C9C'}
            placeholder='Your email here'
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
            placeholder='Your username here'
            autoCapitalize='none'
            value={formik.values.username}
            onChangeText={formik.handleChange('username')}
          />
          {/* Shows the username validation error if exists */}
          {formik.errors.username && (
            <Text style={Styles.formError}>*{formik.errors.username}</Text>
          )}
          <TextInput
            style={{ ...Styles.formField, marginTop: 8 }}
            placeholderTextColor={'#9C9C9C'}
            placeholder='Your password here'
            secureTextEntry={true}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
          />
          {/* Shows the password validation error if exists */}
          {formik.errors.password && (
            <Text style={Styles.formError}>*{formik.errors.password}</Text>
          )}
          <TextInput
            style={{ ...Styles.formField, marginTop: 8 }}
            placeholderTextColor={'#9C9C9C'}
            placeholder='Confirm your password here'
            secureTextEntry={true}
            value={formik.values['password confirmation']}
            onChangeText={formik.handleChange('password confirmation')}
          />
          {/* Shows the password confirmation validation error if exists */}
          {formik.errors['password confirmation'] && (
            <Text style={Styles.formError}>
              *{formik.errors['password confirmation']}
            </Text>
          )}
          <CustomButton
            title='Create account'
            type='primary'
            callback={formik.handleSubmit}
          />
        </View>
        <View style={Styles.redirect}>
          <Pressable onPress={redirectToLogin}>
            <Text style={Styles.redirectText}>
              Already have an account? Login
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
    marginBottom: 145,
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
    marginTop: -125,
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
    color: '#5C5C5C'
  }
});
