import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Divider, Paragraph, Dialog, Portal, Provider, TextInput, Text, BottomNavigation, DataTable } from 'react-native-paper';
import { format } from "date-fns";
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
import UserRequests from '../../requests/repairs-requests';
import { useNavigation } from '@react-navigation/native';
import Volunteer from '../../modesl/Volunteer';

let fakeVolunteers = [
  {id: 0, firstName: "John1", lastName: "Smith", email: "john.smith1@gmail.com"},
  {id: 1, firstName: "John2", lastName: "Smith", email: "john.smith@gmail.com"},
  {id: 2, firstName: "John3", lastName: "Smith", email: "john.smith@gmail.com"},
  {id: 3, firstName: "John4", lastName: "Smith", email: "john.smith@gmail.com"},
  {id: 4, firstName: "John5", lastName: "Smith", email: "john.smith@gmail.com"},
  {id: 5, firstName: "John6", lastName: "Smith", email: "john.smith@gmail.com"},
];

const Volunteers = () => {
  const navigation = useNavigation();
  const [volunteers] = React.useState(fakeVolunteers);

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

      <View style = {{alignSelf: 'center', alignItems: 'flex-start', alignItems: 'center', margin: 20}}>
        <View style = {{marginBottom: 10}}>
          <Text style = {{ fontWeight: 'bold', fontSize: 16, marginLeft: 'auto', marginRight: 'auto'}}>Volunteers{"\n"}</Text>
          <Divider style={{ height: 1, backgroundColor: 'black', marginTop: 3}}/>

          <SubmitButton
            text="+ Add Volunteer"
            onPress={() => {addVolunteer()}}
          />

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
      </View>
    </View>
  )
};

export default Volunteers;
