import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Divider, Paragraph, Dialog, Portal, Provider, TextInput, Text, BottomNavigation, DataTable } from 'react-native-paper';
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
import UserRequests from '../../requests/repairs-requests';
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
  const [volunteers] = React.useState(fakeVolunteers);
  const [state, setState] = React.useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  const authenticated = !!state && state.token !== '' && state.user !== null;

  const addVolunteer = () => {
    const volunteer: Volunteer = {
      id: -1,
      firstName: "",
      lastName: "",
      email: "",
      acceptsWaiver: false
    };
    navigation.navigate('AddEditVolunteer', {
      volunteer: volunteer
    });
  }

  const volunteerTapped = (volunteer: Volunteer) => {
    console.debug("volunteer: ", volunteer)
    navigation.navigate('AddEditVolunteer', {
      volunteer: volunteer
    });
  };

  return (
    <View style={styles.container}>

      {/*<View style = {{alignSelf: 'center', alignItems: 'flex-start', alignItems: 'center'}}>*/}
        <View style = {{marginBottom: 10}}>
          <Text style = {{ fontWeight: 'bold', fontSize: 16, marginLeft: 'auto', marginRight: 'auto'}}>Volunteers{"\n"}</Text>
          {authenticated &&
            <SubmitButton
              text="+ Add Volunteer"
              onPress={() => {addVolunteer()}}
            />
          }

          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>First</DataTable.Title>
                <DataTable.Title>Last</DataTable.Title>
              </DataTable.Header>

              {volunteers.map((volunteer) => (
                <DataTable.Row key={volunteer.id}
                  onPress={() => volunteerTapped(volunteer)}
                >
                  <DataTable.Cell>{volunteer.firstName}</DataTable.Cell>
                  <DataTable.Cell>{volunteer.lastName}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </View>
      {/*</View>*/}
    </View>
  )
};

export default Volunteers;
