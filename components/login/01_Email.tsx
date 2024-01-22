import * as React from 'react';
import {
  View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Paragraph, Dialog, HelperText, Portal, Provider, TextInput, Text, BottomNavigation, Snackbar} from 'react-native-paper';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
// For sending requests to the User API
import UserRequests from '../../requests/user-requests';
import { AuthContext } from '../../contexts/auth-context';
import AsyncStorageHelpers from '../../globals/async-storage-helpers';

const EmailEntry = ({navigation}) => {
  // State variables
  const [state, setState] = React.useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [emailIsInvalid, setEmailIsInvalid] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [showPasswordInput, setShowPasswordInput] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState("");

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
    if (!showPasswordInput) {
      if (email !== "" && validateEmail()) {
        emailIsAdmin(email).then((res) => {
          console.debug("res: ", res);
          setShowPasswordInput(res);
        }).catch((err) => {
          console.error(err);
        });
      }
    } else {
      signInAdmin();
    }
  };

  const emailIsAdmin = async () => {
    try {
      // Ask backend if email is registered
      const response = await UserRequests.emailIsRegisteredAsAdmin(email);
      if (!response.status) {
        setSnackbarMsg(response.msg);
        setShowSnackbar(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error);
      setShowSnackbar(true);
      return false;
    }
  };

  const signInAdmin = async () => {
    try {
      const response = await UserRequests.signInAdmin(email, password);
      console.debug("response: ", response);
      if (!response.status) {
        console.error(response.msg);
        setSnackbarMsg(response.msg)
        setShowSnackbar(true)
        return false;
      }
      // Add auth token to state
      setState({
        ...state, user: response.data.user, token: response.data.token
      });
      // Store authentication items
      const ok = await AsyncStorageHelpers.storeAuth(
        { user: response.data.user, token: response.data.token }
      );
      navigation.navigate("Repairs");
    } catch (error) {
      console.error(error);
    }
  };

  // Component's view
  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <View
        style={{alignItems: 'center', justifyContent: 'center'}}
        accessibilityRole="form"
      >
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
              secureTextEntry={true}
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
      <Portal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => {
            setShowSnackbar(false);
            setSnackbarMsg("");
          }}
          action={{
            label: "close"
          }}
        >{snackbarMsg}
        </Snackbar>
      </Portal>
    </KeyboardAvoidingView>

  );

};

export default EmailEntry;