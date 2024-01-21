import * as React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, HelperText, Text, Portal, Modal } from 'react-native-paper';
import { format } from "date-fns";
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
import CheckBox from "../../globals/CheckBox"
// Styles
import styles from '../../globals/Styles'
// Fake data
import fakeUserEventsItems from '../../images/example_user_events.json';
import HTMLView from 'react-native-htmlview';
import Volunteer from '../../modesl/Volunteer';

fakeUserEventsItems.sort((a, b) => (new Date(b.startDatetime)).getTime() - (new Date(a.startDatetime)).getTime());

const terms =
`
<div>
  <div role="heading" aria-level="3">
    <h2><span>Tucson Repair Café/Library Liability Waiver</span></h2>
    </h3<span>Acknowledgement of Risk or Injury Possibility</span</h3>
    <p>
      <span>As a participant or volunteer in the program, I recognize the risk and acknowledge that there are certain risks of physical injury – including death, damages, property damage, or loss – which I may sustain as a result of participating in any and all activities connected with the program, or the use of the facilities or equipment.</span>
    </p>
    <h3><span>Waiver of Claim for Injury Clause</span></h3>
    <p>
      <span>I agree to waive and relinquish all claims that I may have for injuries or damages as a result of participating in the program or using the facilities or equipment against nonprofit organization and its officers, agents, servants, employees, other volunteers, and affiliates.</span>
    </p>
    <h3><span>Release from Liability Clause</span></h3>
    <p>
      <span>I do hereby release and discharge nonprofit organization and its officers, agents, servants, employees, volunteers and affiliates from any and all claims for injuries, including death, damages, property damage, or loss which may have or may in future accrue to me in account of participating in or volunteering for the nonprofit organization.</span>
    </p>
    <h3><span>Indemnity and Defense Clause</span></h3>
    <p>
      <span>I further agree to indemnify and hold harmless and pay defense costs and defend the nonprofit organization and its agents, servants, employees, other volunteers, and affiliates, from any and all claims resulting from injuries – including death, damages, property damage, or loss – sustained by me and arising out of, connected with, or in any way associated with the activities of the program or the use of facilities or equipment.</span>
    </p>
    <p>
      <i><span style="font-weight:normal;text-decoration:none">By checking the box below, you are agreeing to the terms of the waiver.</span></i>
    </p>
  </div>
</div>
</html>
`;

const AddEditVolunteer = ({route, navigation}) => {
  const volunteer = route.params.volunteer;

  // State variables
  const [firstName, setFirstName] = React.useState(volunteer.firstName);
  const [lastName, setLastName] = React.useState(volunteer.lastName);
  const [email, setEmail] = React.useState(volunteer.email);
  const [acceptsWaiver, setAcceptsWaiver] = React.useState(volunteer.acceptsWaiver);
  const [termsModalVisible, setTermsModalVisible] = React.useState(false);
  // const [firstNameValid, setFirstNameValid] = React.useState(true);
  // const [lastNameValid, setLastNameValid] = React.useState(true);
  // const [emailValid, setEmailValid] = React.useState(false);

  // const validateFirstName = (): boolean => {
  // 	const valid = firstName !== "";
	// 	setFirstNameValid(valid);
	// 	return valid;
  // }

  // const validateLastName = (): boolean => {
  // 	const valid = lastName !== "";
  // 	setLastNameValid(valid);
  // 	return valid;
  // }

  /**
   * Validates the user's email they entered in the email field.
   * @returns {boolean} - true if valid, false in not
   */
  // const validateEmail = (): boolean => {
  //   // Email regular expression that must find a match
  //   const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
  //   const valid = reg.test(email) && email !== '';
  //   setEmailValid(valid);
  //   return valid;
  // };

  // const validateForm = (): boolean => {
  // 	return firstNameValid && lastNameValid && emailValid;
  // }

  const saveVolunteer = (volunteer: Volunteer) => {
    console.debug("Saving volunteer: ", volunteer);
  }

  // Today's date
  const today = format(new Date(), "MMMM do, yyyy");
  // Component's view
  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      	<Text variant="titleMedium">Volunteer</Text>
        <TextInput
          label="First name"
          mode="outlined"
          autoCorrect={false}
          style={styles.short_text_input}
          value={firstName}
          onChangeText={firstName => setFirstName(firstName)}
          // onBlur={() => validateFirstName()}
        />
{/*        <HelperText type="error" visible={!firstNameValid}>
          Please enter a valid first name.
        </HelperText>*/}

        <TextInput
          label="Last name"
          mode="outlined"
          autoCorrect={false}
          style={styles.short_text_input}
          value={lastName}
          onChangeText={lastName => setLastName(lastName)}
          // onBlur={() => validateLastName()}
        />
{/*        <HelperText type="error" visible={!lastNameValid}>
          Please enter a valid last name or initial.
        </HelperText>*/}

        <TextInput
          label="Email"
          mode="outlined"
          autoCorrect={false}
          style={styles.short_text_input}
          value={email}
          onChangeText={email => setEmail(email.trim())}
          // onBlur={() => validateEmail()}
        />
{/*        <HelperText type="error" visible={!emailValid}>
          Please enter a valid email address.
        </HelperText>*/}

        <CheckBox
          label={<Text>I agree to the <Text style={{color: "blue"}} onPress={() => {
            setTermsModalVisible(true);
          }}>terms and conditions</Text></Text>}
          status={acceptsWaiver ? 'checked' : 'unchecked'}
          onPress={() => {
            setAcceptsWaiver(!acceptsWaiver);
          }}
        />

        <SubmitButton
          // disabled={!validateForm()}
          text="Save"
          onPress={() => {
            const volunteer: Volunteer = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              acceptsWaiver: acceptsWaiver
            };
            saveVolunteer(volunteer);
          	// if (!validateFirstName() || !validateLastName() || !validateEmail()) {
          		// return;
          	// }
	        	// navigation.navigate('Repairs');
          }}
        >
        </SubmitButton>
        <Portal>
          <Modal style={styles.modalStyle} visible={termsModalVisible} onDismiss={() => {setTermsModalVisible(false)}}>
            <HTMLView value={terms}/>
          </Modal>
        </Portal>
      </View>

    </KeyboardAvoidingView>
  );

};

export default AddEditVolunteer;
