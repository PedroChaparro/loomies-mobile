import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
/* import { useFormik } from 'formik'; */
import { CustomButton } from '../components/CustomButton';


export const Signup = () => {
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
            placeholder='Email'
            autoCapitalize='none'
            /* value={formik.values.email} */
            /* onChangeText={formik.handleChange('email')} */
          />
          <TextInput
            style={{ ...Styles.formField, marginTop: 8 }}
            placeholderTextColor={'#9C9C9C'}
            placeholder='Username'
            autoCapitalize='none'
            /* value={formik.values.password}
            onChangeText={formik.handleChange('password')} */
          />
          <TextInput
            style={{ ...Styles.formField, marginTop: 8 }}
            placeholderTextColor={'#9C9C9C'}
            placeholder='********'
            secureTextEntry={true}
            /* value={formik.values.password}
            onChangeText={formik.handleChange('password')} */
          />
          <CustomButton
            title='Create account'
            type='primary'
            callback={() => {console.log("object");}}
          />
          
        </View>
        <View style={Styles.redirect}>
          <Pressable>
            <Text>Already have an account? Login</Text>
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
  /* formError: {
    color: '#ED4A5F',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }, */
  redirect: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16
  }
});
