import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB } from 'react-native-paper';
import { format } from "date-fns";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from 'globals/Styles'
import { getTodaysVolunteers } from 'requests/volunteer-requests';
import Volunteer from 'models/Volunteer';
import { useAuth } from 'contexts/auth-context';
import EventHeader from 'globals/EventHeader';
import { NavigationProp } from 'globals/RootNavigation';

const Volunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const {
        isLoggedIn,
        setShowLoader,
        setSnackbarMsg,
        appEvent,
    } = useAuth();
    const [volunteersRetrieved, setVolunteersRetrieved] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const addVolunteer = () => {
        let volunteer = new Volunteer();
        volunteer.eventId = appEvent._id
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
                    <EventHeader/>
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
