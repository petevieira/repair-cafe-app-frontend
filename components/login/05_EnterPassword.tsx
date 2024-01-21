import * as React from 'react';
import {
  View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView
} from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider, TextInput, Text, BottomNavigation, HelperText } from 'react-native-paper';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'

import UserRequests from '../../requests/user-requests';

const EnterPassword = ({route, navigation}) => {
  // Normal variables
  const passwordStates = {
    VALID:        0,
    BLANK:        1, // Password field blank
    TOO_SHORT:    2, // Password too short, but not blank
    WRONG:        4, // Wrong password submitted
    SERVER_ERROR: 5  // A server error occurred
  };
  const { user } = route.params; // User object from server
  const passwordMinChars = 6; //FIXME get from .env
  let submitPressed = false; // Whether submit button already pressed

  // State variables
  const [password, setPassword] = React.useState('');
  const [passwordState, setPasswordState] = React.useState(passwordStates.VALID);
  const [passwordHelperText, setPasswordHelperText] = React.useState(false);

  /**
   * Gets the welcome message based on the user's first name.
   * Only called on first render.
   * @param {object} user - User object
   * @param {string} user.first - Users's first name
   * @returns {string} - the welcome message to display
   */
  const getWelcomeMsg = (user) => {
    // Check parameters are valid
    if (!user?.first) {
      // Just log error. We don't need their name for log-in
      console.error("User name not found.");
      return "Welcome back!\n";
    }
    // Create user first name with capital first letter for welcome message
    const firstNameWithCapFirstLetter =
      user.first.charAt(0).toUpperCase() + user.first.slice(1);
    return `Welcome back, ${firstNameWithCapFirstLetter}!\n`;
  }

  /**
   * Sets the state of the password and the helper text below the password field.
   * @param {string} pass - Password to validate
   * @param {number} state - State to force the password state to
   * @returns {boolean} - false if the password field has an error, otherwise true
   */
  const validatePassword = (pass, state=passwordStates.VALID) => {
    if (state === passwordStates.WRONG) {
      setPasswordHelperText("The password you entered is incorrect. Please try again.");
    } else if (state === passwordStates.SERVER_ERROR) {
      setPasswordHelperText("Woops. There a problem with our server. Please try again in a bit.");
    } else if (pass.length < passwordMinChars && pass !== "") {
      setPasswordHelperText(`Please enter a valid password (at least ${passwordMinChars} characters)`);
      state = passwordStates.TOO_SHORT;
    } else if (pass == "") {
      setPasswordHelperText(`Please enter your password`);
      state = passwordStates.BLANK;
    } else {
      setPasswordHelperText("");
      state = passwordStates.VALID;
    }
    setPasswordState(state);
    return state;
  };

  /**
   * Attempts to sign the user in.
   * @param {string} email - User's email address
   * @param {string} password - User's plaintext password
   */
  const signIn = async (email, password) => {
    try {
      const response = await UserRequests.signIn(email, password);
      if (response.status) {
        navigation.navigate('MyItems');
      } else {
        validatePassword(password, passwordStates.WRONG);
      }
    } catch (error) {
      validatePassword(password, passwordStates.SERVER_ERROR);
    }
  };

  // Component's view
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text style={{fontSize: 20}}>{getWelcomeMsg(user)}</Text>
        <TextInput
          label="Enter password"
          autoCorrect={false}
          secureTextEntry={true}
          type="outlined"
          style={styles.short_text_input}
          value={password}
          onChangeText={password => setPassword(password)}
        />
        <HelperText type="error" visible={passwordState !== passwordStates.VALID}>
          {passwordHelperText}
        </HelperText>

        <SubmitButton
          onPress={() => {
            submitPressed = true;
            if (validatePassword(password) === passwordStates.VALID) {
              signIn(user.email, password);
            }
          }}
        >
        </SubmitButton>
      </View>

    </KeyboardAvoidingView>
  );

};

export default EnterPassword;
