import * as React from 'react';
import {
  View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, HelperText, Paragraph, Dialog, Portal, Provider, TextInput, Text, BottomNavigation } from 'react-native-paper';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'

import UserRequests from '../../requests/user-requests';

const CreatePassword = ({route, navigation}) => {
  // Route parameters
  const { email } = route.params;

  // State variables
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [pass1, setPass1] = React.useState("");
  const [pass2, setPass2] = React.useState("");

  const passwordMinChars = 6; //FIXME get from .env

  // Password Match
  const nonMatching = () => {
    return (pass1 === "") || (pass2 === "") || (pass1 !== pass2);
  };

  const noFirst = () => {
    return first == "";
  };

  const noLast = () => {
    return last == "";
  };

  const signUp = async (email, first, last, password) => {
    try {
      const response = await UserRequests.signUp(email, first, last, password);
      navigation.navigate('MyItems');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <ScrollView>
        <View style = {
          {alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text style={{fontSize: 20, marginTop: 15,}}>Welcome to Repair Cafe!{"\n"}</Text>
          <Text>{email}</Text>

          <TextInput
            label="First name"
            type="outlined"
            value={first}
            autoCorrect={false}
            style={styles.short_text_input}
            onChangeText={first => setFirst(first)}
          />
          <HelperText type="error" visible={noFirst()}>
            Please enter a first name.
          </HelperText>

          <TextInput
            label="Last name"
            type="outlined"
            value={last}
            autoCorrect={false}
            style={styles.short_text_input}
            onChangeText={last => setLast(last)}
          />
          <HelperText type="error" visible={noLast()}>
            Please enter a last name.
          </HelperText>

          <TextInput
            label="Create a password"
            autoCorrect={false}
            secureTextEntry={true}
            value={pass1}
            type="outlined"
            style={styles.short_text_input}
            onChangeText={pass1 => setPass1(pass1)}
          />

          <TextInput
            label="Enter password again"
            autoCorrect={false}
            secureTextEntry={true}
            value={pass2}
            type="outlined"
            style={styles.short_text_input}
            onChangeText={pass2 => setPass2(pass2)}
          />
          <HelperText type="error" visible={nonMatching()}>
            Passwords must match.
          </HelperText>
          <SubmitButton
            onPress={() => {
              signUp(email, first, last, pass1);
            }}
          >
          </SubmitButton>
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );

};

export default CreatePassword;
