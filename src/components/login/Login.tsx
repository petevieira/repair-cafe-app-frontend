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
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Login = ({navigation}) => {
  // State variables
  const [state, setState] = React.useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [emailIsInvalid, setEmailIsInvalid] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [enableEmail, setEnableEmail] = React.useState(true);
  const [showPasswordInput, setShowPasswordInput] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState("");
  const [emailsValid, setEmailsValid] = React.useState(false);
  const [emailsBlurred, setEmailsBlurred] = React.useState(false);
  let authenticated: boolean = false;
  const stateRef = React.useRef();
  let pwdInputRef = React.useRef();

  authenticated = !!state && state.token !== '' && state.user !== null;

  /**
   * Validates the user's email they entered in the email field.
   * @returns {boolean} - true if valid, false in not
   */
  const emailIsValid = () => {
    // Email regular expression that must find a match
    const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
    return (reg.test(email) || email === '');
  };

  const handleSubmit = () => {
    if (!showPasswordInput) {
      if (email === '') {
        setEmailsValid(false);
      }
      if (email !== "" && emailIsValid()) {
        setState({...state, showLoader: true});
        emailIsAdmin(email).then((res) => {
          console.debug("res: ", res);
          setShowPasswordInput(res);
          // Checking here maybe b/c it's a race condition for it to load first?
          setTimeout(() => {
            if (!!pwdInputRef.current) {
              pwdInputRef.current.focus();
            }
            setState({...state, showLoader: false});
          }, 500);
        }).catch((err) => {
          console.error(err);
          setState({...state, showLoader: false});
        });
      }
    } else {
      signInAdmin();
    }
  };

  const emailIsAdmin = async () => {
    setState({...state, showLoader: true});
    try {
      // Ask backend if email is registered
      const response = await UserRequests.userIsAdmin(email);
      setState({...state, showLoader: false});
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
      setState({...state, showLoader: false});
      return false;
    }
  };

  const clearContent = () => {
    setEmail('');
    setPassword('');
    setShowPasswordInput(false);
  }

  const signInAdmin = async () => {
    try {
      const response = await UserRequests.signInAdmin(email, password);
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

  React.useEffect(() => {
    if (authenticated) {
      navigation.navigate('Repairs');
    }
  }, [authenticated]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearContent();
      }
    },[])
  );

  // Component's view
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={styles.container}
        accessibilityRole="form"
      >
        <View
          style={styles.content}>
          <TextInput
            label="Admin Email"
            mode={enableEmail ? "outlined" : "outlined (disabled)"}
            autoCorrect={false}
            style={styles.short_text_input}
            value={email}
            autoFocus={true}
            editable={{enableEmail}}
            onPress={() => {setEnableEmail(true)}}
            onFocus={() => {
              setEmailsBlurred(false);
              setEnableEmail(true);
            }}
            onBlur={() => {
              setEmailsValid(emailIsValid());
              setEmailsBlurred(true);
            }}
            onChangeText={email => setEmail(email.trim().toLowerCase())}
          />
          <HelperText type="error" visible={emailsBlurred && !emailsValid}>
            Woops! Please enter a valid email.
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
                ref={pwdInputRef}
                onChangeText={
                  password => setPassword(password.trim().toLowerCase())
                }
              />
            </>
          }
          <SubmitButton
            onPress={() => {handleSubmit()}}
          />
        </View>
      </View>
      <Portal>
        <Snackbar
          duration={2000}
          style={styles.snackbar}
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

export default Login;