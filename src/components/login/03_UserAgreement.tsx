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
import styles from '../../globals/Styles'


const UserAgreement = () => {

  return (
    <View style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>
      
      <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <ScrollView>

          <Text style = {{fontSize: 20, marginTop: 10, marginLeft: 10, marginRight: 10}}>
            Scroll to accept user agreement{"\n"}
          </Text>
          <Text style = {{fontSize: 14, marginTop: 15, marginLeft: 10, marginRight: 10}}>
          
          <Text style={{fontWeight: 'bold'}}>
          Tucson Repair Cafe AND All Host Venues Liability Agreement{"\n"}{"\n"}
          </Text>

          <Text style={{fontWeight: 'bold'}}>
          Acknowledgement of Risk or Injury Possibility{"\n"}{"\n"}
          </Text>

          As a participant or volunteer in the program, I recognize the risk and acknowledge that there are certain risks of physical injury – including death, damages, property damage, or loss – which I may sustain as a result of participating in any and all activities connected with the program, or the use of the facilities or equipment.{"\n"}{"\n"}
          
          <Text style={{fontWeight: 'bold'}}>
          Waiver of Claim for Injury Clause{"\n"}{"\n"}
          </Text>

          I agree to waive and relinquish all claims that I may have for injuries or damages as a result of participating in the program or using the facilities or equipment against nonprofit organization and its officers, agents, servants, employees, other volunteers, and affiliates.{"\n"}{"\n"}
          
          <Text style={{fontWeight: 'bold'}}>
          Release from Liability Clause{"\n"}{"\n"}
          </Text>

          I do hereby release and discharge nonprofit organization and its officers, agents, servants, employees, volunteers and affiliates from any and all claims for injuries, including death, damages, property damage, or loss which may have or may in future accrue to me in account of participating in or volunteering for the nonprofit organization.{"\n"}{"\n"}

          <Text style={{fontWeight: 'bold'}}>
          Indemnity and Defense Clause{"\n"}{"\n"}
          </Text>

          I further agree to indemnify and hold harmless and pay defense costs and defend the nonprofit organization and its agents, servants, employees, other volunteers, and affiliates, from any and all claims resulting from injuries – including death, damages, property damage, or loss – sustained by me and arising out of, connected with, or in any way associated with the activities of the program or the use of facilities or equipment.{"\n"}{"\n"}

          By selecting "I Agree" below, you are agreeing to the terms of the waiver.{"\n"}
          </Text>

          <Button mode="outlined" style={{
            ...styles.submit_button, width: '90%', maxWidth: 120, marginBottom: 10, alignSelf: 'center',
          }}>
            I Agree
          </Button>

        </ScrollView>
      </View>
    </View>
  );

};

export default UserAgreement;