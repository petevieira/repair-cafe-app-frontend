import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Portal, TextInput, Text, DataTable, Snackbar, FAB } from 'react-native-paper';
import { format } from "date-fns";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
import { getTodaysVolunteers } from '../../requests/volunteer-requests';
import Volunteer from '../../models/Volunteer';
import { AuthContext } from '../../contexts/auth-context';

let fakeVolunteers: [Volunteer] = [
  {id: 0, firstName: "John1", lastName: "Smith"},
  {id: 1, firstName: "John2", lastName: "Smith"},
  {id: 2, firstName: "John3", lastName: "Smith"},
  {id: 3, firstName: "John4", lastName: "Smith"},
  {id: 4, firstName: "John5", lastName: "Smith"},
  {id: 5, firstName: "John6", lastName: "Smith"},
];

const Volunteers = () => {
  const navigation = useNavigation();
  const [volunteers, setVolunteers] = React.useState([]);
  const [snackbarMsg, setSnackbarMsg] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [state, setState] = React.useContext(AuthContext);
  const [volunteersRetrieved, setVolunteersRetrieved] = React.useState(false);

  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;


  const addVolunteer = () => {
    const volunteer: Volunteer = {
      id: -1,
      firstName: "",
      lastName: "",
      email: "",
      acceptsWaiver: false
    };
    navigation.navigate('Add/Edit Volunteer', {
      volunteer: volunteer
    });
  }

  const volunteerTapped = (volunteer: Volunteer) => {
    navigation.navigate('Add/Edit Volunteer', {
      volunteer: volunteer
    });
  };

  const getVolunteers = async () => {
    setState({...state, showLoader: true});

    try {
      const response = await getTodaysVolunteers();
      if (!response.status) {
        throw new Error(response.msg);
      }
      setVolunteers(response.data.volunteers);
    } catch (error) {
      console.error(error);
      setSnackbarMsg("Failed to retrieve volunteers");
      setShowSnackbar(true);
    }
    setState({...state, showLoader: false});
    setVolunteersRetrieved(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      getVolunteers();
    }, [])
  );

  return (
    <View style={styles.container}>
      {authenticated && <FAB
        icon="plus"
        style={styles.fab}
        animated={false}
        onPress={addVolunteer}
      />}
      <View
        style={{ marginBottom: 10 }}>

        {/*<Text style = {{ fontWeight: 'bold', fontSize: 22, marginLeft: 'auto', marginRight: 'auto'}}>Volunteers{"\n"}</Text>*/}
        <DataTable>
          <DataTable.Header style={{minWidth: 500}}>
            <DataTable.Title style={{marginHorizontal: 10}}>First</DataTable.Title>
            <DataTable.Title style={{marginHorizontal: 10}}>Last</DataTable.Title>
          </DataTable.Header>

          {volunteers.map((volunteer) => (
            <DataTable.Row key={volunteer._id}
              onPress={(!authenticated ? undefined : () => {volunteerTapped(volunteer)})}
            >
              <DataTable.Cell style={{marginHorizontal: 10}}>{volunteer.firstName}</DataTable.Cell>
              <DataTable.Cell style={{marginHorizontal: 10}}>{volunteer.lastName}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
      { volunteersRetrieved && volunteers.length <= 0 &&
        <Text
          style={{
            padding: 10,
            alignSelf: 'center'
          }}>No volunteers yet today</Text>
      }
      <Portal>
        <Snackbar
          visible={showSnackbar}
          style={styles.snackbar}
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
  )
};

export default Volunteers;
