import * as React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Divider, HelperText, Text, Portal, Modal, Snackbar } from 'react-native-paper';
import { format } from "date-fns";
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
import CheckBox from "../../globals/CheckBox"
// Styles
import styles from '../../globals/Styles'
// Fake data
import HTMLView from 'react-native-htmlview';
import Volunteer from '../../models/Volunteer';
import { addVolunteer, getVolunteer, updateVolunteer } from '../../requests/volunteer-requests';
import { AuthContext } from '../../contexts/auth-context';

// fakeUserEventsItems.sort((a, b) => (new Date(b.startDatetime)).getTime() - (new Date(a.startDatetime)).getTime());

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
  const paramVolunteer = route.params.volunteer;

  // State variables
  const [id, setId] = React.useState("");
  const [waiverBoxChecked, setWaiverBoxChecked] = React.useState(false);
  const [volunteer, setVolunteer] = React.useState(new Volunteer());
  // const [firstName, setFirstName] = React.useState(volunteer.firstName ?? "");
  // const [lastName, setLastName] = React.useState(volunteer.lastName ?? "");
  // const [email, setEmail] = React.useState(volunteer.email ?? "");
  // const [acceptsWaiver, setAcceptsWaiver] = React.useState(volunteer.acceptsWaiver ?? false);
  const [termsModalVisible, setTermsModalVisible] = React.useState(false);
  // const [firstNameValid, setFirstNameValid] = React.useState(true);
  // const [lastNameValid, setLastNameValid] = React.useState(true);
  // const [emailValid, setEmailValid] = React.useState(false);
  const [state, setState] = React.useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  const authenticated = !!state && state.token !== '' && state.user !== null;
  // const validateFirstName = (): boolean => {
  // 	const valid = firstName !== "";
	// 	setFirstNameValid(valid);
	// 	return valid;
  // }
  const [snackbarMsg, setSnackbarMsg] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
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

  const addSaveVolunteer = async (volunteer: Volunteer) => {
    console.debug("[AddEditVolunteer::addVolunteer]");
    if (!authenticated) {
      setSnackbarMsg("You need to be signed in as an admin to add volunteers");
      setShowSnackbar(true);
      return;
    }
    try {
      let response = null;
      if (!!volunteer._id) {
        response = await updateVolunteer(volunteer);
      } else {
        response = await addVolunteer(volunteer);
      }
      if (!response.status) {
        console.error(response.msg);
        setSnackbarMsg(response.msg);
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getExistingVolunteer = async (id: string) => {
    console.debug("[getExistingVolunteer]");
    try {
      const response = await getVolunteer(id);
      if (!response.status) {
        throw new Error(response.msg);
      }
      console.debug("Got volunteer details: ", response.data.volunteer);
      setVolunteer(response.data.volunteer);
      setId(response.data.volunteer.id);
      console.debug("Setting waive box to ", response.data.volunteer.acceptsWaiver);
      setWaiverBoxChecked(response.data.volunteer.acceptsWaiver);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error);
      setShowSnackbar(true);
    }
  }

  React.useEffect(() => {
    console.debug("efft vol: ", paramVolunteer);
    if (!!paramVolunteer._id) {
      getExistingVolunteer(paramVolunteer._id);
    } else {
      console.debug("set volunteer to param volunteer");
      setVolunteer(paramVolunteer);
      console.debug("Setting waive box to param ", paramVolunteer.acceptsWaiver ?? false);
      setWaiverBoxChecked(paramVolunteer.acceptsWaiver ?? false);
    }
  }, []);

  // Today's date
  const today = format(new Date(), "MMMM do, yyyy");
  // Component's view
  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <View style = {{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{"Volunteer"}</Text>
        <Divider style={{ height: 1, backgroundColor: 'black', marginTop: 3}}/>
        <TextInput
          label="First name"
          mode="outlined"
          autoCorrect={false}
          style={styles.short_text_input}
          value={volunteer.firstName}
          onChangeText={newFirstName => setVolunteer({...volunteer, firstName: newFirstName})}
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
          value={volunteer.lastName}
          onChangeText={newLastName => setVolunteer({...volunteer, lastName: newLastName})}
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
          value={volunteer.email}
          onChangeText={newEmail => setVolunteer({...volunteer, email: newEmail.trim()})}
          // onBlur={() => validateEmail()}
        />
{/*        <HelperText type="error" visible={!emailValid}>
          Please enter a valid email address.
        </HelperText>*/}

        <CheckBox
          label={<Text>I agree to the <Text style={{color: "blue"}} onPress={() => {
            setTermsModalVisible(true);
          }}>terms and conditions</Text></Text>}
          status={waiverBoxChecked ? 'checked' : 'unchecked'}
          onPress={async () => {
            setVolunteer({...volunteer, acceptsWaiver: !waiverBoxChecked});
            setWaiverBoxChecked(!waiverBoxChecked);
          }}
        />

        <SubmitButton
          disabled={!waiverBoxChecked}
          text="Save"
          onPress={() => {
            addSaveVolunteer(volunteer);
          	// if (!validateFirstName() || !validateLastName() || !validateEmail()) {
          		// return;
          	// }
	        	// navigation.navigate('Repairs');
          }}
        >
        </SubmitButton>
        <Portal>
          <Modal
            style={styles.modalStyle}
            visible={termsModalVisible}
            onDismiss={() => {setTermsModalVisible(false)}}
          >
            <HTMLView value={terms}/>
          </Modal>
        </Portal>

        <Portal>
          <Snackbar
            visible={showSnackbar}
            onDismiss={() => {
              setShowSnackbar(false);
              setSnackbarMsg("");
            }}
            action={{
              label: "close"
            }}
          >{snackbarMsg}
          </Snackbar>
        </Portal>
      </View>

    </KeyboardAvoidingView>
  );

};

export default AddEditVolunteer;
