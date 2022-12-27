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


const CreatePassword = () => {

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <ScrollView>
        <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text style = {{fontSize: 20, marginTop: 15,}}>Welcome to Repair Cafe! {"\n"}</Text>
          <TextInput
            label="First name"
            type="outlined"
            style={styles.short_text_input}
          />
          <TextInput
            label="Last name"
            type="outlined"
            style={styles.short_text_input}
          />
          <TextInput
            label="Create a password"
            type="outlined"
            style={styles.short_text_input}
          />
          <TextInput
            label="Enter password again"
            type="outlined"
            style={styles.short_text_input}
          />
          <SubmitButton></SubmitButton>
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );

};

export default CreatePassword;