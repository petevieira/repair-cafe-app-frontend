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


const AccountSuccess = () => {

  let itemaActionText = "";
  let accountSuccessText = "";

  const userType = "user";
  // const userType = "repairer";
  const success = true;
  // const success = false;

  if (userType == "repairer"){
    itemaActionText = "Continue to add items to your repair queue.";
  } else {
    itemaActionText = "Continue to add items.";
  }

  if (success == true){
    accountSuccessText = "Account created successfully.";
  } else {
    accountSuccessText = "Account creation error. Contact administrator.";
  }

  return (

    <View style={styles.container}>
      <StatusBar style = "auto" />
      <Nav></Nav>
      <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text style = {{textAlign: 'center', fontSize: 20, marginTop: 15, marginLeft: 10, marginRight: 10}}>
          {accountSuccessText}{"\n"}{"\n"}{itemaActionText}
        </Text>
        <Button mode="outlined" style={{
          ...styles.submit_button, width: '90%', maxWidth: 120, marginBottom: 10, alignSelf: 'center',
        }}>
          Continue
        </Button>
      </View>
    </View>
    );

};

export default AccountSuccess;