import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFormik } from 'formik';
import { NavigationProp, RouteProp } from '@react-navigation/core';
import { CustomButton } from '../components/CustomButton';
import { codeValidationRequest } from '../services/user.services';
import { useToastAlert } from '../hooks/useToastAlert';

interface EmailValidationViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any, any>;
  route: RouteProp<{ params: { email: string } }, 'params'>;
}

export const EmailValidationView = ({
  navigation,
  route
}: EmailValidationViewProps) => {
  const { showSuccessToast, showErrorToast } = useToastAlert();

  const redirectToLogin = () => {
    navigation.navigate('Login');
  };

  const redirectToNewCode = () => {
    // Redirect to the validation screen and pass the email as a param
    navigation.navigate('NewCode', { email: formik.values.email });
  };

  // Try to get the email from the params
  const { email } = route.params || {};

  const formik = useFormik({
    initialValues: {
      email: email || '',
      code: ''
    },
    onSubmit: async (values) => {
      const [response, error] = await codeValidationRequest(
        values.email,
        values.code
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
        <Text style={Styles.headerTitle}>Validate account</Text>
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
            placeholder='Your Code'
            autoCapitalize='none'
            value={formik.values.code}
            onChangeText={formik.handleChange('code')}
          />
          <CustomButton
            title='Validate'
            type='primary'
            callback={formik.handleSubmit}
          />
        </View>
        <View style={Styles.redirect}>
          <Pressable onPress={redirectToNewCode}>
            <Text style={Styles.redirectText}>
              Lost your code? Click here and get another one!
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
