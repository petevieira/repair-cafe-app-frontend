import * as React from 'react';
import {
  View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Paragraph, Dialog, HelperText, Portal, Provider, TextInput, Text, BottomNavigation } from 'react-native-paper';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
// For sending requests to the User API
import UserRequests from '../../requests/user-requests';

const EmailEntry = ({navigation}) => {
  // State variables
  const [email, setEmail] = React.useState("");
  const [emailIsInvalid, setEmailIsInvalid] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPasswordInput, setShowPasswordInput] = React.useState(false);


  /**
   * Validates the user's email they entered in the email field.
   * @returns {boolean} - true if valid, false in not
   */
  const validateEmail = () => {
    // Email regular expression that must find a match
    const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
    return (reg.test(email) || email === '');
  };

  const handleSubmit = () => {
    if (showPasswordInput) {
      if (password === "trc") {
        navigation.navigate("Repairs");
      }
    } else {
      if (email !== "" && validateEmail()) {
        checkEmailAndNavigate(email);
      }
    }
  };

  /**
   * Checks if user email is registered and navigates to the appropriate next
   * page/screen: sign-up or sign-in.
   * @param {string} email - Email to check registration of
   */
  const checkEmailAndNavigate = async (email) => {
    if (email == "trc@gmail.com") {
      setShowPasswordInput(true);
      return;
    }
    try {
      // Ask backend if email is registered
      const response = await UserRequests.emailIsRegistered(email);
      const { emailIsRegistered, user } = response.data;
      // Navigate to next screen depending on email status
      if (emailIsRegistered) {
        navigation.navigate('EnterPassword', { user: user });
      } else {
        navigation.navigate('CreatePassword', { email: email });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Component's view
  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <View style = {{alignItems: 'center', justifyContent: 'center'}}>
        <TextInput
          label="Admin Email"
          mode={showPasswordInput ? "outlined (disabled)" : "outlined"}
          autoCorrect={false}
          style={styles.short_text_input}
          value={email}
          editable={!showPasswordInput}
          onChangeText={email => setEmail(email.trim().toLowerCase())}
        />
        <HelperText type="error" visible={!validateEmail()}>
          Please enter a valid email address.
        </HelperText>
        {showPasswordInput &&
          <>
            <TextInput
              label="Admin Password"
              mode="outlined"
              autoCorrect={false}
              style={styles.short_text_input}
              value={password}
              onChangeText={password => setPassword(password.trim().toLowerCase())}
            />
            <HelperText type="error" visible={!validateEmail()}>
              Please enter a valid email address.
            </HelperText>
          </>
        }
        <SubmitButton
          onPress={() => {handleSubmit()}}
        />
      </View>

    </KeyboardAvoidingView>
  );

};

export default EmailEntry;