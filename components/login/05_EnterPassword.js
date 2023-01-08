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
  const [passwordInvalid, setPasswordInvalid] = React.useState(false);

  const passwordMinChars = 6; //FIXME get from .env

  // Check parameters are valid
  if (!user?.first) {
    throw new Error('Error. Expected user info not found');
    return; //FIXME
  }

  // Create user first name with capital first letter for welcome message
  const first = user.first;
  const firstCapFirstLetter = first.charAt(0).toUpperCase() + first.slice(1);

  const passwordIsValid = (pass) => {
    return (pass.length >= passwordMinChars || pass === "");
  };

  const signIn = async (email, password) => {
    if (password === "") {
      return;
    }

    try {
      const response = await UserRequests.signIn(email, password);
      console.log("response: ", response);
      navigation.navigate('MyItems');
    } catch (error) {
      console.error("catch error: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text style={{fontSize: 20}}>
          Welcome back, {firstCapFirstLetter}!{"\n"}
        </Text>
        <TextInput
          label="Enter password"
          autoCorrect={false}
          secureTextEntry={true}
          type="outlined"
          style={styles.short_text_input}
          value={password}
          onChangeText={password => setPassword(password)}
        />
        <HelperText type="error" visible={passwordInvalid}>
          Please enter your password.
        </HelperText>

        <SubmitButton
          onPress={() => {
            setPasswordInvalid(!passwordIsValid(password));
            signIn(user.email, password);
          }}
        >
        </SubmitButton>
      </View>

    </KeyboardAvoidingView>
  );

};

export default EnterPassword;
