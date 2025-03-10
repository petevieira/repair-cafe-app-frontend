import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from 'globals/Styles'
import { getVolunteersByEvent } from 'requests/volunteer-requests';
import Volunteer from 'models/Volunteer';
import { useAuth } from 'contexts/auth-context';
import EventHeader from 'globals/EventHeader';
import { NavigationProp } from 'globals/RootNavigation';
import { Response } from 'types/Response';

/**
 * Volunteers component
 * Displays a table of the volunteers signed up for the current event.
 * @returns
 */
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

    /**
     * Add a new volunteer
     */
    const addVolunteer = () => {
        let volunteer = new Volunteer();
        volunteer.eventId = appEvent._id
        navigation.navigate('Add/Edit Volunteer', {
            volunteer: volunteer
        });
    }

    /**
     * Navigate to the volunteer add/edit screen
     * @param {Volunteer} volunteer - the volunteer to edit
     */
    const volunteerPressed = (volunteer: Volunteer): void => {
        navigation.navigate('Add/Edit Volunteer', {
            volunteer: volunteer
        });
    };

    /**
     * Get the volunteers for the current event and set the state
     * @returns Promise<void>
     */
    const getVolunteers = async (): Promise<void> => {
        if (!appEvent) {
            return;
        }

        try {
            setShowLoader(true);
            const response: Response = await getVolunteersByEvent(appEvent._id);
            setVolunteers(response.data.volunteers);
        } catch (error) {
            console.error(error.message);
            setSnackbarMsg(error.message)
        } finally {
            setShowLoader(false);
            setVolunteersRetrieved(true);
        }
    };

    /**
     * Get the volunteers for the current event when the screen is focused
     * and when the appEvent changes.
     */
    useFocusEffect(
        useCallback(() => {
            getVolunteers();
        }, [appEvent])
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
                            <DataTable.Title>#</DataTable.Title>
                            <DataTable.Title>First</DataTable.Title>
                            <DataTable.Title>Last</DataTable.Title>
                        </DataTable.Header>

                    {volunteers.map((volunteer, idx) => (
                        <DataTable.Row key={volunteer._id}
                            onPress={(!isLoggedIn ? undefined : () => {volunteerPressed(volunteer)})}
                        >
                            <DataTable.Cell>{idx + 1}</DataTable.Cell>
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
