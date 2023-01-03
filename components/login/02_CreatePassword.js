import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  HelperText,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
  Text,
  BottomNavigation
} from 'react-native-paper';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles.js'


const CreatePassword = () => {
  const [email, setEmail] = React.useState("");
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [pass1, setPass1] = React.useState("");
  const [pass2, setPass2] = React.useState("");

  const getEnteredEmail = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      console.log(value);
      if (value !== null) {
        setEmail(value);
      }
    } catch(error) {
      console.error(error);
    }
  };
  getEnteredEmail();

  // Password Match
  const nonMatching = () => {
    if (pass1 =="" || pass2 =="" || (pass1 == pass2) ) {
      return false;
    } else {
      return true;
    }
  };

  // First name entered
  let noFirst = false;

  // Last name entered
  let noLast = false;


  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <ScrollView>
        <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text style = {{fontSize: 20, marginTop: 15,}}>Welcome to Repair Cafe! {"\n"}</Text>
          <Text>{email}</Text>
          <TextInput
            label="First name"
            type="outlined"
            value={first}
            autoCorrect={false}
            style={styles.short_text_input}
            onChangeText={first => setFirst(first)}
          />
          <HelperText type="error" visible={noFirst}>
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
          <HelperText type="error" visible={noLast}>
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
          <Button mode="outlined"
            onPress={async () => {
              try {
                console.log(`'${first}'`);
                console.log(`'${last}'`);
                noFirst = (first.length==0);
                noLast = (last.length==0);

              } catch (error) {
                console.error(error);
              }
            }}
            style={{
            //flex: props.flex_num,
            ...styles.submit_button,
          }}>
          Submit
        </Button>
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );

};

export default CreatePassword;
