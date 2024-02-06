import { useState, useEffect, useContext } from 'react';
import {
  View, ScrollView, KeyboardAvoidingView, Platform, Pressable
} from 'react-native';
import { Button, TextInput, HelperText, Text, Modal, Dialog, Portal
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
  updateVolunteer, deleteVolunteer, findVolunteerByEmail
} from '../../requests/volunteer-requests';
import { AuthContext } from '../../contexts/auth-context';
import Terms from '../../globals/Terms';
import { Dropdown } from 'react-native-element-dropdown';
import { emailIsValid } from '../../lib/helpers';

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
  const [pastVolunteerIdx, setPastVolunteerIdx] = useState(0)
  const [pastVolunteersFocused, setPastVolunteersFocused] = useState(false);
  const [pastVolunteers, setPastVolunteers] = useState([]);

  const volunteerOkToSave = (volunteer): boolean => {
    let msg = "";
    if (!volunteer.email) {
      msg = "Please enter in your email.";
    } else if (!emailIsValid(volunteer.email)) {
      msg = "Please enter a valid email."
    } else if (!volunteer.firstName) {
      msg = "Please enter your first name.";
    } else if (!volunteer.lastName) {
      msg = "Please enter in your last name.";
    } else if (!waiverBoxChecked) {
      msg = "Please agree to the terms.";
    }
    if (msg !== '') {
      setState({...state, snackbarMsg: msg});
      return false;
    }
    return true;
  }

  const addSaveVolunteer = async (volunteer: Volunteer) => {
    if (!volunteerOkToSave(volunteer)) {
      return;
    }
    setState({...state, showLoader: true});
    try {
      let response = null;
      if (!!volunteer._id) {
        response = await updateVolunteer(volunteer);
      } else {
        response = await addVolunteer(volunteer);
      }
      setState({...state, showLoader: false});
      navigation.navigate("Volunteers");
    } catch (error) {
      console.error(error);
      setState({...state, showLoader: false, snackbarMsg: error.message});
    }
  }

  const deleteCurrentVolunteer = async () => {
    if (!volunteer._id) {
      setState({
        ...state,
        snackbarMsg: "Volunteer can't be deleted. They aren't in the database."
      });
      return;
    }
    setState({...state, showLoader: true});
    try {
      const response = await deleteVolunteer(volunteer._id);
      setState({...state, snackbarMsg: "Volunteer deleted", showLoader: false});
      setTimeout(() => {
        navigation.navigate('Volunteers');
      }, 1000);
    } catch (error) {
      console.error(error);
      setState({...state, showLoader: false, snackbarMsg: error.message});
    }
  }

  const getExistingVolunteer = async (id: string) => {
    setState({...state, showLoader: true});
    try {
      const response = await getVolunteer(id);
      setVolunteer(response.data.volunteer);
      setId(response.data.volunteer.id);
      setWaiverBoxChecked(response.data.volunteer.acceptsWaiver);
      setState({...state, showLoader: false});
    } catch (error) {
      console.error(error);
      setState({...state, snackbarMsg: error.message, showLoader: false});
    }
  }

  const onEmailBlur = async () => {
    if (!!volunteer._id || !emailIsValid(volunteer.email)) {
      return;
    }
    setState({...state, showLoader: true});
    try {
      const response = await findVolunteerByEmail(volunteer.email);
      if (!!response.data.volunteer) {
        setVolunteer({
          ...volunteer,
          firstName: response.data.volunteer.firstName,
          lastName: response.data.volunteer.lastName
        });
      }
      setState({...state, showLoader: false});
    } catch (error) {
      console.error(error);
      setState({...state, showLoader: false, snackbarMsg: error.message});
    }
  }

  useEffect(() => {
    if (!!paramVolunteer._id) {
      getExistingVolunteer(paramVolunteer._id);
    } else {
      setVolunteer(paramVolunteer);
      setWaiverBoxChecked(paramVolunteer.acceptsWaiver ?? false);
    }
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

          <TextInput
            label={<><Text style={{color: '#717171'}}>Email</Text><Text style={{color: 'red'}}>*</Text></>}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={volunteer.email}
            onBlur={onEmailBlur}
            onChangeText={newEmail => setVolunteer(
              {...volunteer, email: newEmail.trim()}
            )}
          />

          <TextInput
            label={<><Text style={{color: '#717171'}}>First name</Text><Text style={{color: 'red'}}>*</Text></>}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={volunteer.firstName}
            onChangeText={newFirstName => setVolunteer({...volunteer, firstName: newFirstName.trim()})}
          />

          <TextInput
            label={<><Text style={{color: '#717171'}}>Last name</Text><Text style={{color: 'red'}}>*</Text></>}
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={volunteer.lastName}
            onChangeText={newLastName => setVolunteer({...volunteer, lastName: newLastName.trim()})}
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
            { !!volunteer._id &&
              <SubmitButton
                style={styles.deleteButton}
                rippleColor="rgba(168,37,33,0.4)"
                text="Delete"
                onPress={() => {
                  setShowDeleteConfirmationDialog(true);
                }}
              />
            }

            <SubmitButton
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
        <Dialog
          style={{
            minWidth: 320, maxWidth: 738, alignSelf: 'center'
          }}
          visible={showDeleteConfirmationDialog}
          onDismiss={() => { setShowDeleteConfirmationDialog(false) }}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete {volunteer.firstName} {volunteer.lastName}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {setShowDeleteConfirmationDialog(false)}}>Cancel</Button>
            <Button
              onPress={() => {
                deleteCurrentVolunteer(volunteer);
                setShowDeleteConfirmationDialog(false);
              }}
              labelStyle={{color: 'red'}}
            >Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </KeyboardAvoidingView>
  );

};

export default AddEditVolunteer;
