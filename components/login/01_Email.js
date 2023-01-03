import * as React from 'react';
import {View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  Paragraph,
  Dialog,
  HelperText,
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


const EmailEntry = ({navigation}) => {

  const [email, setEmail] = React.useState("");

  // Email validation
  const invalidEmail = () => {
    const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
    return !(reg.test(email) || email == "");
  };

  const validate = (text) => {
    console.log(text);
    if (invalidEmail(text) === true || text == "") {
      console.log("Email is invalid");
      this.setState({ email: text })
      return false;
    }
    else {
      this.setState({ email: text })
      console.log("Email is valid");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar style = "auto" />
      <Nav></Nav>
      <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <TextInput
          label="What is your email?"
          type="outlined"
          autoCorrect={false}
          style={styles.short_text_input}
          value={email}
          onChangeText={email => setEmail(email)}
        />
        <HelperText type="error" visible={invalidEmail()}>
          Please enter a valid email address.
        </HelperText>
        <Button mode="outlined"
          onPress={async () => {
            try {
              await AsyncStorage.setItem('email', email);
              if (invalidEmail(email) === false) {
                navigation.navigate('CreatePassword', { screen: 'CreatePassword' });
              };
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
    </KeyboardAvoidingView>
  );

};

export default EmailEntry;