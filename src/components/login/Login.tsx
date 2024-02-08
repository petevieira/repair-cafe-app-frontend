import { useCallback, useState, useEffect, useContext, useRef } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HelperText, TextInput } from 'react-native-paper';

import SubmitButton from "../../globals/SubmitButton"
import styles from '../../globals/Styles'
import UserRequests from '../../requests/user-requests';
import { AuthContext } from '../../contexts/auth-context';
import AsyncStorageHelpers from '../../globals/async-storage-helpers';

const Login = ({navigation}) => {
  // State variables
  const [state, setState] = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [enableEmail, setEnableEmail] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [emailsValid, setEmailsValid] = useState(false);
  const [emailsBlurred, setEmailsBlurred] = useState(false);
  let authenticated: boolean = false;
  const stateRef = useRef();
  let pwdInputRef = useRef();

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

  const handleSubmit = async () => {
    if (!showPasswordInput) {
      if (email === '') {
        setEmailsValid(false);
        return;
      }

      if (email !== '' && emailIsValid()) {
        setState({...state, showLoader: true});
        try {
          const response = await UserRequests.userIsAdmin(email);
          setShowPasswordInput(true);
          // Checking here maybe b/c it's a race condition for it to load first?
          setTimeout(() => {
            if (!!pwdInputRef.current) {
              pwdInputRef.current.focus();
            }
            setState({...state, showLoader: false});
          }, 200);
        } catch (error) {
          console.error(error);
          setState({...state, snackbarMsg: error.message, showLoader: false});
        }
      }
    } else {
      signInAdmin();
    }
  };

  const clearContent = () => {
    setEmail('');
    setPassword('');
    setShowPasswordInput(false);
  }

  const signInAdmin = async () => {
    setState({...state, showLoader: true});
    try {
      const response = await UserRequests.signInAdmin(email, password);
      // Add auth token to state
      setState({
        ...state, user: response.data.user, token: response.data.token
      });
      // Store authentication items
      const ok = await AsyncStorageHelpers.storeAuth(
        { user: response.data.user, token: response.data.token }
      );
      navigation.navigate("Repairs");
      setState({...state, showLoader: false});
    } catch (error) {
      console.error(error);
      setState({...state, snackbarMsg: error.message, showLoader: false});
    }
  };

  useEffect(() => {
    if (authenticated) {
      navigation.navigate('Repairs');
    }
  }, [authenticated]);

  useFocusEffect(
    useCallback(() => {
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
            editable={enableEmail}
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
            Please enter a valid email.
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

    </KeyboardAvoidingView>

  );

};

export default Login;