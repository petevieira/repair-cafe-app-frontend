import { useState, useEffect, useContext } from 'react';
import {
  View, ScrollView, KeyboardAvoidingView, Platform, Pressable
} from 'react-native';
import { Button, TextInput, HelperText, Text, Portal, Modal, Dialog, Snackbar
} from 'react-native-paper';
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
import {
  addVolunteer, getVolunteer,
  updateVolunteer, deleteVolunteer, getPastVolunteers
} from '../../requests/volunteer-requests';
import { AuthContext } from '../../contexts/auth-context';
import Terms from '../../globals/Terms';
import { Dropdown } from 'react-native-element-dropdown';

const AddEditVolunteer = ({route, navigation}) => {
  const paramVolunteer = route.params.volunteer;

  // State variables
  const [id, setId] = useState("");
  const [waiverBoxChecked, setWaiverBoxChecked] = useState(false);
  const [volunteer, setVolunteer] = useState(new Volunteer());
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [state, setState] = useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  const authenticated = !!state && state.token !== '' && state.user !== null;
  const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [pastVolunteerIdx, setPastVolunteerIdx] = useState(0)
  const [pastVolunteersFocused, setPastVolunteersFocused] = useState(false);
  const [pastVolunteers, setPastVolunteers] = useState([]);

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

  const getPriorVolunteers = async () => {
    console.debug("[getPriorVolunteers]");
    try {
      const response = await getPastVolunteers();
      if (!response.status) {
        throw new Error(response.msg);
      }
      console.debug("response: ", response);
      setPastVolunteers(response.data.pastVolunteers);
    } catch (err) {
      console.error(err);
    }
  }

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
        return;
      }
      navigation.navigate("Volunteers");
    } catch (error) {
      console.error(error);
    }
  }

  const deleteCurrentVolunteer = async () => {
    if (!volunteer._id) {
      setSnackbarMsg("Volunteer can't be deleted. It doesn't have an _id.");
      setShowSnackbar(true);
      return;
    }
    try {
      const response = await deleteVolunteer(volunteer._id);
      console.debug("dv response: ", response);
      if (!response) {
        console.error("Unknown error");
        setSnackbarMsg("Unknown error");
        setShowSnackbar(true);
        return;
      } else if (!response.status) {
        console.error(response.msg);
        setSnackbarMsg(response.msg);
        setShowSnackbar(true);
        return;
      }
      setSnackbarMsg("Volunteer deleted");
      setShowSnackbar(true);
      setTimeout(() => {
        setSnackbarMsg("");
        setShowSnackbar(false);
        navigation.navigate('Volunteers');
      }, 1000);
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

  useEffect(() => {
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

  useEffect(() => {
    getPriorVolunteers();
  }, []);

  // Today's date
  const today = format(new Date(), "MMMM do, yyyy");
  // Component's view
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style = {styles.content}>
          <Text
            style={{ fontWeight: 'bold', fontSize: 22, alignSelf: 'center' }}>
            {"Volunteer"}
          </Text>

          <View style={styles.dropdownContainer}>
            <View style={[styles.label]}>
              <Text style={{color: '#717171'}}>
                Search past volunteers
              </Text>
            </View>
            <Dropdown
              style={[styles.dropdown, pastVolunteersFocused && {borderWidth: 2}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              itemTextStyle={styles.itemTextStyle}
              iconStyle={styles.iconStyle}
              data={pastVolunteers}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Search Past Volunteers"
              searchPlaceholder="Search..."
              value={pastVolunteerIdx}
              onFocus={() => setPastVolunteersFocused(true)}
              onBlur={() => setPastVolunteersFocused(false)}
              onChange={v => {
                setPastVolunteerIdx(v.value);
              }}
            />
          </View>

          <TextInput
            label={<><Text style={{color: '#717171'}}>Email</Text><Text style={{color: 'red'}}>*</Text></>}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={volunteer.email}
            onChangeText={newEmail => setVolunteer({...volunteer, email: newEmail.trim()})}
          />

          <TextInput
            label={<><Text style={{color: '#717171'}}>First name</Text><Text style={{color: 'red'}}>*</Text></>}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={volunteer.firstName}
            onChangeText={newFirstName => setVolunteer({...volunteer, firstName: newFirstName})}
          />

          <TextInput
            label={<><Text style={{color: '#717171'}}>Last name</Text><Text style={{color: 'red'}}>*</Text></>}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={volunteer.lastName}
            onChangeText={newLastName => setVolunteer({...volunteer, lastName: newLastName})}
          />

          <CheckBox
            label={<Text>I agree to the <Text style={{color: "blue"}} onPress={() => {
              setTermsModalVisible(true);
            }}>terms and conditions</Text><Text style={{color: 'red'}}>*</Text></Text>}
            status={waiverBoxChecked ? 'checked' : 'unchecked'}
            onPress={async () => {
              setVolunteer({...volunteer, acceptsWaiver: !waiverBoxChecked});
              setWaiverBoxChecked(!waiverBoxChecked);
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: "space-evently",
              alignItems: "center",
              marginBottom: 15,
              alignSelf: 'center'
            }}
          >
              { authenticated && !!volunteer._id &&
                <SubmitButton
                  buttonColor='red'
                  textColor="white"
                  rippleColor="rgba(168,37,33,0.4)"
                  text="Delete"
                  onPress={() => {
                    setShowDeleteConfirmationDialog(true);
                  }}
                />
              }

            <SubmitButton
              disabled={!waiverBoxChecked}
              text="Save"
              onPress={() => {
                addSaveVolunteer(volunteer);
              }}
            >
            </SubmitButton>
          </View>
        </View>
      </ScrollView>

      { termsModalVisible &&
        <View
          style={{
            position: 'absolute',
            top: 5,
            left: '50%',
            transform: [{translateX: '-50%'}],
            height: '70vh',
            maxWidth: '80vw',
            minWidth: 320,
            backgroundColor: '#f2f2f2'
          }}
        >
          <Text
            onPress={() => { setTermsModalVisible(false) }}
            style={{
              fontSize: 22,
              marginLeft: 'auto',
              paddingRight: 5,
            }}
          >
            {"Close"}
          </Text>
          <Terms />
        </View>
      }

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

      <Portal>
        <Dialog
          visible={showDeleteConfirmationDialog}
          onDismiss={() => { setShowDeleteConfirmationDialog(false) }}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete {volunteer.firstName} {volunteer.lastName}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {setShowDeleteConfirmationDialog(false)}}>Cancel</Button>
            <Button onPress={() => {
              deleteCurrentVolunteer(volunteer);
              setShowDeleteConfirmationDialog(false);
            }}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </KeyboardAvoidingView>
  );

};

export default AddEditVolunteer;
