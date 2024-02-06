import { useContext, useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Text, DataTable, FAB } from 'react-native-paper';
import { format } from "date-fns";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from '../../globals/Styles'
import { getTodaysVolunteers } from '../../requests/volunteer-requests';
import Volunteer from '../../models/Volunteer';
import { AuthContext } from '../../contexts/auth-context';

const Volunteers = () => {
  const navigation = useNavigation();
  const [volunteers, setVolunteers] = useState([]);
  const [state, setState] = useContext(AuthContext);
  const [volunteersRetrieved, setVolunteersRetrieved] = useState(false);

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

  const volunteerPressed = (volunteer: Volunteer) => {
    navigation.navigate('Add/Edit Volunteer', {
      volunteer: volunteer
    });
  };

  const getVolunteers = async () => {
    setState({...state, showLoader: true});
    try {
      const response = await getTodaysVolunteers();
      setVolunteers(response.data.volunteers);
      setState({...state, showLoader: false});
    } catch (error) {
      console.error(error.message);
      setState({...state, snackbarMsg: error.message});
    }
    setVolunteersRetrieved(true);
  };

  useFocusEffect(
    useCallback(() => {
      getVolunteers();
    }, [])
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>

          <DataTable>
            <DataTable.Header style={{minWidth: 500}}>
              <DataTable.Title style={{marginHorizontal: 10}}>First</DataTable.Title>
              <DataTable.Title style={{marginHorizontal: 10}}>Last</DataTable.Title>
            </DataTable.Header>

            {volunteers.map((volunteer) => (
              <DataTable.Row key={volunteer._id}
                onPress={(!authenticated ? undefined : () => {volunteerPressed(volunteer)})}
              >
                <DataTable.Cell style={{marginHorizontal: 10}}>{volunteer.firstName}</DataTable.Cell>
                <DataTable.Cell style={{marginHorizontal: 10}}>{volunteer.lastName}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

        { volunteersRetrieved && volunteers.length <= 0 &&
          <Text
            style={{
              padding: 10,
              alignSelf: 'center'
            }}>{"No volunteers yet today"}
          </Text>
        }

        </View>
      </ScrollView>
      { authenticated &&
        <FAB
          icon="plus"
          style={styles.fab}
          animated={false}
          onPress={addVolunteer}
        />
      }
    </>
  )
};

export default Volunteers;
