import * as React from 'react';
import {
  View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Paragraph,
  Dialog,
  HelperText,
  Portal,
  Provider,
  TextInput,
  Text,
  BottomNavigation
} from 'react-native-paper';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles.js'

import UserRequests from '../../requests/user-requests';


const EmailEntry = ({navigation}) => {

  const [email, setEmail] = React.useState("");

  // Email validation
  const emailIsInvalid = () => {
    const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
    return (!reg.test(email) && email !== "");
  };

  const checkSubmittedEmail = async (email) => {
    try {
      // ask backend if email is already registered
      const response = await UserRequests.emailIsRegistered(email);
      // if request succeeds, save user email in async storage
      await AsyncStorage.setItem('email', email);
      // if email is already registered, go to sign-in page,
      //   otherwise, go to sign-up page
      if (response.data.emailIsRegistered) {
        navigation.navigate('EnterPassword', { screen: 'EnterPassword' });
      } else {
        navigation.navigate('CreatePassword', { screen: 'CreatePassword' });
      }
    } catch (error) {
      console.error("checkEmail error: ", error.response?.data?.msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar style = "auto" />
      <Nav></Nav>
      <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <TextInput
          label="What is your email?"
          type="outlined"
          autoCorrect={false}
          style={styles.short_text_input}
          value={email}
          onChangeText={email => setEmail(email)}
        />
        <HelperText type="error" visible={emailIsInvalid()}>
          Please enter a valid email address.
        </HelperText>
        <Button mode="outlined"
          onPress={() => {
            if (!emailIsInvalid()) {
              checkSubmittedEmail(email);
            }
          }}
          style={{
          //flex: props.flex_num,
          ...styles.submit_button,
        }}>
        Submit
        </Button>
      </View>
    </KeyboardAvoidingView>
  );

};

export default EmailEntry;
