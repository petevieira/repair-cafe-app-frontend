import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB, Portal, Button, Dialog } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from "date-fns";

import styles from 'globals/Styles'
import { getEvents, deleteEventById } from 'requests/event-requests';
import Event from 'models/Event';
import { useAuth } from 'contexts/auth-context';
import { NavigationProp } from 'globals/RootNavigation';
import appColors from 'globals/colors';

const Events = () => {
    const [events, setEvents] = useState([]);
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg,
        eventDate, setEventDate,
    } = useAuth();
    const [eventsRetrieved, setEventsRetrieved] = useState(false);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const navigation = useNavigation<NavigationProp>();

    // Today's date
    const todaysDate = format(new Date(), "MMMM do, yyyy");

    const fetchEvents = async () => {
        try {
            setShowLoader(true);
            const fetchedEvents = await getEvents();
            setEvents(fetchedEvents);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
        setEventsRetrieved(true);
    }

    const addEventPressed = () => {
        navigation.navigate('Add/Edit Event', {
            event: new Event()
        });
    }

    const goToEventPressed = (event: Event) => {

    }

    const deleteEventPressed = async (event) => {
        try {
            await deleteEventById(event._id);
            setSnackbarMsg("Event deleted.");
            fetchEvents();
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        }
    }

    const toSimpleDate = (date: string | null): string => {
        if (!date) {
            return "";
        }
        return date.split("T")[0];
    }


    const editEventPressed = (event) => {
        if (!isLoggedIn) {
            return;
        }
        navigation.navigate('Add/Edit Event', {
            event: event
        });
    }

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        },[])
    );

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.topScrollView}
                style={{backgroundColor: appColors.bgGray}}
            >
                <View style={styles.content}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>#</DataTable.Title>
                            <DataTable.Title style={{flex:10}}>Date (YYYY-MM-DD)</DataTable.Title>
                            <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>{""}</DataTable.Title>
                            <DataTable.Title style={{flex: 1, justifyContent: 'center'}}>{""}</DataTable.Title>
                        </DataTable.Header>

                    {events.map((event, idx) => (
                        <DataTable.Row
                            key={event._id}
                        >
                            <DataTable.Cell style={{flex: 1, justifyContent: 'center'}}>{idx+1}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 10}}>{toSimpleDate(event.date)}</DataTable.Cell>
                            <DataTable.Cell
                                style={{flex: 1, justifyContent: 'center'}}
                                onPress={isLoggedIn ? (() => editEventPressed(event)) : undefined}
                            >{"\u270e"}</DataTable.Cell>
                            <DataTable.Cell
                                style={{flex: 1, justifyContent: 'center'}}
                                onPress={isLoggedIn ? (() => goToEventPressed(event)) : undefined}
                            >{"►"}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                    </DataTable>
                { eventsRetrieved && events.length <= 0 &&
                    <Text
                        style={{
                            padding: 10,
                            alignSelf: 'center'
                        }}>{"No events found"}
                    </Text>
                }
                </View>
            </ScrollView>
            { isLoggedIn &&
                <FAB
                icon="plus"
                style={styles.fab}
                animated={false}
                onPress={addEventPressed}
                />
            }
        </>
    )
};

export default Events;
