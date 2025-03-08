import { useCallback, useState, useEffect, useContext, useRef } from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HelperText, TextInput } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import SubmitButton from "globals/SubmitButton"
import styles from 'globals/Styles'
import UserRequests from 'requests/user-requests';
import { useAuth } from 'contexts/auth-context';
import AsyncStorageHelpers from 'globals/async-storage-helpers';
import { Regex } from 'consts/app.consts';
import { TEST_EMAIL, TEST_PASSWORD, DEBUG } from '@env';

const Login = ({navigation}) => {
    // State variables
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        isAdmin, setIsAdmin,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg
    } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [emailsValid, setEmailsValid] = useState(false);
    const [emailsBlurred, setEmailsBlurred] = useState(false);
    let emailInputRef = useRef(null)
    let passwordInputRef = useRef(null);
    const isFocused = useIsFocused();

    /**
     * Validates the user's email they entered in the email field.
     * @returns {boolean} - true if valid, false in not
     */
    const emailIsValid = () => {
        // Email regular expression that must find a match
        return (Regex.EMAIL.test(email) || email === '');
    };

    const handleSubmit = async () => {
        Keyboard.dismiss();
        if (!showPasswordInput) {
            if (email === '') {
                setEmailsValid(false);
                return;
            }

            if (email !== '' && emailIsValid()) {
                setShowLoader(true);
                try {
                    const emailIsRegistered = await UserRequests.emailIsRegistered(email);
                    if (!emailIsRegistered) {
                        setSnackbarMsg("Email not found.");
                        setShowPasswordInput(false);
                        return;
                    }
                    setShowPasswordInput(true);
                    // Checking here maybe b/c it's a race condition for it to load first?
                } catch (error) {
                    console.error(error);
                    setSnackbarMsg(error.message);
                } finally {
                    setShowLoader(false);
                }
            }
        } else {
            signIn();
        }
    };

    const clearContent = () => {
        setEmail('');
        setPassword('');
        setShowPasswordInput(false);
    }

    const signIn = async () => {
        if (!email) {
            return;
        }
        try {
            setShowLoader(true);
            const { token, user } = await UserRequests.signIn(email, password);
            // Add auth token to state
            setAuthToken(token);
            setIsLoggedIn(true);
            setIsAdmin(user.role === 'admin');
            // Store authentication items
            await AsyncStorageHelpers.storeAuth({ user, token });
            navigation.navigate("Repairs");
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    };

    if (DEBUG === "true") {
        // Auto sign-in
        useEffect(() => {
            signIn();
        }, [password]);
        // Auto password
        useEffect(() => {
            setPassword(TEST_PASSWORD);
        }, [email]);
    }

    useEffect(() => {
        if (!!showPasswordInput && !!passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    }, [showPasswordInput]);

    useEffect(() => {
        if (isLoggedIn) {
            if (isFocused) { // Only navigate if the screen is focused
                navigation.navigate('Repairs');
            }
        } else {
            emailInputRef.current?.focus();
        }
    }, [isLoggedIn, isFocused, navigation]);

    useFocusEffect(
        useCallback(() => {
            if (DEBUG === "true") {
                setShowPasswordInput(true);
                setEmail(TEST_EMAIL);
            }
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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <TextInput
                            label="Email"
                            mode="outlined"
                            autoCorrect={false}
                            style={styles.short_text_input}
                            value={email}
                            returnKeyType="done"
                            inputMode={"email"}
                            autoFocus={true}
                            onFocus={() => {
                                setEmailsBlurred(false);
                            }}
                            onBlur={() => {
                                setEmailsValid(emailIsValid());
                                setEmailsBlurred(true);
                            }}
                            ref={emailInputRef}
                            onChangeText={email => setEmail(email.trim().toLowerCase())}
                            onSubmitEditing={handleSubmit}
                        />
                        <HelperText type="error" visible={emailsBlurred && !emailsValid}>
                            Please enter a valid email.
                        </HelperText>
                        <TextInput
                            label="Password"
                            mode="outlined"
                            secureTextEntry={true}
                            autoCorrect={false}
                            returnKeyType="done"
                            style={{
                                ...styles.short_text_input,
                                display: showPasswordInput ? 'flex' : 'none'
                            }}
                            value={password}
                            ref={passwordInputRef}
                            onChangeText={
                                password => setPassword(password.trim())
                            }
                            onSubmitEditing={handleSubmit}
                        />
                        <SubmitButton
                            onPress={() => {handleSubmit()}}
                            icon={() => <FontAwesome5 name="sign-in-alt" size={24} color="white" />}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );

};

export default Login;