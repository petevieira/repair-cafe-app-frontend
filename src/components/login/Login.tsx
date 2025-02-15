import { useCallback, useState, useEffect, useContext, useRef } from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HelperText, TextInput } from 'react-native-paper';

import SubmitButton from "globals/SubmitButton"
import styles from 'globals/Styles'
import UserRequests from 'requests/user-requests';
import { useAuth } from 'contexts/auth-context';
import AsyncStorageHelpers from 'globals/async-storage-helpers';

const Login = ({navigation}) => {
    // State variables
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg
    } = useAuth();
    const [email, setEmail] = useState("");
    const [emailIsInvalid, setEmailIsInvalid] = useState(false);
    const [password, setPassword] = useState("");
    const [enableEmail, setEnableEmail] = useState(true);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [emailsValid, setEmailsValid] = useState(false);
    const [emailsBlurred, setEmailsBlurred] = useState(false);
    let emailInputRef = useRef()
    let pwdInputRef = useRef();

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
                setShowLoader(true);
                try {
                    const response = await UserRequests.userIsAdmin(email);
                    console.debug("response: ", response);
                    if (!response.status) {
                        throw new Error("Unknown error");
                    }
                    setShowPasswordInput(true);
                    // Checking here maybe b/c it's a race condition for it to load first?
                    setShowLoader(false);
                } catch (error) {
                    console.error(error);
                    setShowLoader(false);
                    setSnackbarMsg(error.message);
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
        setShowLoader(true);
        try {
            const response = await UserRequests.signInAdmin(email, password);
            // Add auth token to state
            setAuthToken(response.data.token);
            setIsLoggedIn(true);
            // Store authentication items
            const ok = await AsyncStorageHelpers.storeAuth(
                { user: response.data.user, token: response.data.token }
            );
            navigation.navigate("Repairs");
            setShowLoader(false);
        } catch (error) {
            console.error(error);
            setShowLoader(false);
            setSnackbarMsg(error.message);
        }
    };

    useEffect(() => {
        if (!!showPasswordInput && !!pwdInputRef.current) {
            pwdInputRef.current.focus();
        }
    }, [showPasswordInput]);

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate('Repairs');
        } else {
            emailInputRef.current.focus();
        }
    }, [isLoggedIn]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                clearContent();
            }
        },[])
    );

    // Component's view
    return (
        <ScrollView
        contentContainerStyle={styles.topScrollView}
        style={{backgroundColor: '#f2f2f2'}}
        >
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <View
        style={styles.container}
        >
        <View
        style={styles.content}>
        <TextInput
        label="Admin Email"
        mode={enableEmail ? "outlined" : "outlined (disabled)"}
        autoCorrect={false}
        style={styles.short_text_input}
        value={email}
        inputMode={"email"}
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
        ref={emailInputRef}
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
        </ScrollView>
    );

};

export default Login;