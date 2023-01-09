import * as React from 'react';
import {
  View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView
} from 'react-native';
import {
  Button, Paragraph, Dialog, Portal, Provider,
  TextInput, Text, BottomNavigation, HelperText
} from 'react-native-paper';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles.js'

import UserRequests from '../../requests/user-requests';

const EnterPassword = ({route, navigation}) => {
  // Route parameters
  const { user } = route.params;

  // State variables
  const [password, setPassword] = React.useState('');
  const [passwordIsInvalid, setPasswordIsInvalid] = React.useState(false);
  const [passwordHelperText, setPasswordHelperText] = React.useState(false);

  const passwordMinChars = 6; //FIXME get from .env
  let welcomeMsg = ""

  // Check parameters are valid
  if (!user?.first) {
    console.log("User name not found.");
    welcomeMsg = "Welcome back!\n";
  } else {
    // Create user first name with capital first letter for welcome message
    const first = user.first;
    const firstCapFirstLetter = first.charAt(0).toUpperCase() + first.slice(1);
    welcomeMsg = `Welcome back, ${firstCapFirstLetter}!\n`;
  }

  const validatePassword = (pass) => {
    if (pass.length < passwordMinChars && pass !== "") {
      setPasswordHelperText(`Please enter your password`);
      setPasswordIsInvalid(true);
    } else if (pass == "") {
      setPasswordHelperText(`Please enter a valid password (at least ${passwordMinChars} characters)`);
      setPasswordIsInvalid(true);
    } else {
      console.debug("password is valid");
      setPasswordIsInvalid(false);
      setPasswordHelperText("");
    }
  };

  const signIn = async (email, password) => {
    console.debug(`passwordInvalid: (${passwordIsInvalid})`);
    if (passwordIsInvalid) {
      console.debug("not signing in. password is invalid");
      return;
    }
    console.debug("signing in");
    try {
      const response = await UserRequests.signIn(email, password);
      navigation.navigate('MyItems');
    } catch (error) {
      if (error.response !== undefined) {
        alert(error.response.data.msg);
      } else {
        alert(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text style={{fontSize: 20}}>{welcomeMsg}</Text>
        <TextInput
          label="Enter password"
          autoCorrect={false}
          secureTextEntry={true}
          type="outlined"
          style={styles.short_text_input}
          value={password}
          onChangeText={password => setPassword(password)}
        />
        <HelperText type="error" visible={passwordIsInvalid}>
          {passwordHelperText}
        </HelperText>

        <SubmitButton
          onPress={() => {
            validatePassword(password);
            signIn(user.email, password);
          }}
        >
        </SubmitButton>
      </View>

    </KeyboardAvoidingView>
  );

};

export default EnterPassword;
