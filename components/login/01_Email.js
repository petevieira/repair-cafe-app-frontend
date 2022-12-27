import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView } from 'react-native';
import {
  Button,
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


const EmailEntry = () => {

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar style = "auto" />
      <Nav></Nav>
      <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <TextInput
          label="What is your email?"
          type="outlined"
          style={styles.short_text_input}
        />
        <SubmitButton></SubmitButton>
      </View>
    </KeyboardAvoidingView>
  );

};

export default EmailEntry;