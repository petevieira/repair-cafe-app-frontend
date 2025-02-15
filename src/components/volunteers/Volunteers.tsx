import { useContext, useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Text, DataTable, FAB } from 'react-native-paper';
import { format } from "date-fns";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from 'globals/Styles'
import { getTodaysVolunteers } from 'requests/volunteer-requests';
import Volunteer from 'models/Volunteer';
import { useAuth } from 'contexts/auth-context';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const {
    authToken, setAuthToken,
    isLoggedIn, setIsLoggedIn,
    showLoader, setShowLoader,
    snackbarMsg, setSnackbarMsg
  } = useAuth();
  const [volunteersRetrieved, setVolunteersRetrieved] = useState(false);
  const navigation = useNavigation();

  // Today's date
  const todaysDate = format(new Date(), "MMMM do, yyyy");

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
    setShowLoader(true);
    try {
      const response = await getTodaysVolunteers();
      setVolunteers(response.data.volunteers);
      setShowLoader(false);
    } catch (error) {
      console.error(error.message);
      setSnackbarMsg(error.message)
      setShowLoader(false);
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
      <ScrollView
        contentContainerStyle={styles.topScrollView}
        style={{backgroundColor: '#f2f2f2'}}
      >
      <View style={styles.content}>
        <Text style={{textAlign: "center"}}>({todaysDate})</Text>
        <DataTable>
          <DataTable.Header style={{minWidth: 320}}>
            <DataTable.Title>First</DataTable.Title>
            <DataTable.Title>Last</DataTable.Title>
          </DataTable.Header>

          {volunteers.map((volunteer) => (
            <DataTable.Row key={volunteer._id}
              onPress={(!isLoggedIn ? undefined : () => {volunteerPressed(volunteer)})}
            >
              <DataTable.Cell>{volunteer.firstName}</DataTable.Cell>
              <DataTable.Cell>{volunteer.lastName}</DataTable.Cell>
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
      { isLoggedIn &&
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
