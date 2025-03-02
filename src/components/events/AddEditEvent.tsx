import { useState, useEffect, useRef } from 'react';
import {
    View, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { Button, Text, Dialog, Portal
} from 'react-native-paper';
// Custom Components
import SubmitButton from "globals/SubmitButton"
// Styles
import styles from 'globals/Styles'
import RepairEvent from 'models/RepairEvent';
import {
    createEvent, updateEvent, getEventById, deleteEventById
} from 'requests/repair-event-requests';
import { useAuth } from 'contexts/auth-context';
import EventDatePicker from 'globals/EventDatePicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AddEditEvent = ({route, navigation}) => {
    const paramEvent = route.params.event;
    console.debug("paramEvent: ", paramEvent);

    // State variables
    const [event, setEvent] = useState(new RepairEvent());
    const [eventDate, setEventDate] = useState(new Date(paramEvent.date));
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg
    } = useAuth();
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);

    const eventOkToSave = (event: RepairEvent): boolean => {
        let msg = "";
        if (!event.date) {
            msg = "Please set the event date.";
        }

        if (msg !== '') {
            setSnackbarMsg(msg);
            return false;
        }
        return true;
    }

    const addOrSaveEvent = async (event: RepairEvent) => {
        console.debug("event: ", event);
        console.debug("eventDate: ", eventDate);
        if (!eventOkToSave(event)) {
            return;
        }
        try {
            setShowLoader(true);
            if (!!event._id) {
                const updatedEvent = await updateEvent(event);
                console.debug("Updated event: ", updatedEvent);
                setSnackbarMsg("Event updated.");
            } else {
                console.debug("Creating event: ", event);
                const createdEvent = await createEvent(event.date);
                console.debug("Created event: ", createdEvent);
                setSnackbarMsg("New event added.")
            }
            navigation.navigate("Events");
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }

    const deleteEvent = async (event: RepairEvent) => {
        if (!event._id) {
            setSnackbarMsg("Event can't be deleted. It's not in the database.");
            return;
        }

        try {
            setShowLoader(true);
            const deletedEvent = await deleteEventById(event._id);
            setSnackbarMsg(`${deletedEvent.date.toUTCString()} Event was deleted.`);
            setTimeout(() => {
                navigation.navigate('Events');
            }, 500);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }

    useEffect(() => {
        if (!!paramEvent) {
            console.log("Setting paramevent: ", paramEvent);
            setEvent(paramEvent);
        }
    }, [paramEvent]);

    useEffect(() => {
        if (!!eventDate && event._id) {
            console.log("Setting eventDate: ", eventDate, event);
            setEvent(prevEvent => ({
                ...prevEvent,
                date: eventDate
            }))
        }
    }, [eventDate]);

    // Component's view
    return (
        <ScrollView
            contentContainerStyle={styles.topScrollView}
            style={{backgroundColor: '#f2f2f2'}}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.content}>
                    <EventDatePicker
                        eventDate={eventDate}
                        setEventDate={setEventDate}
                    />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        gap: 10,
                    }}>
                    { event?._id &&
                        <SubmitButton
                            style={{
                                ...styles.deleteButton,
                                flex: 1,
                                marginHorizontal: 5,
                            }}
                            icon={() => <FontAwesome5 name="trash" size={24} color="white" />}
                            rippleColor="#974045"
                            onPress={() => {
                                setShowDeleteConfirmationDialog(true);
                            }}
                        />
                    }
                    { event &&
                        <SubmitButton
                            style={{
                                flex: 1,
                                marginHorizontal: 5,
                                color: 'white',
                            }}
                            icon={() => <FontAwesome5 name="save" size={24} color="white" />}
                            rippleColor="#285882"
                            onPress={() => {
                                addOrSaveEvent(event);
                            }}
                        />
                    }
                    </View>
                </View>

                <Portal>
                    <Dialog
                        style={{ minWidth: 320, maxWidth: 738, alignSelf: 'center' }}
                        visible={showDeleteConfirmationDialog}
                        onDismiss={() => { setShowDeleteConfirmationDialog(false) }}
                    >
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to delete event on {new Date(eventDate).toISOString().split('T')[0]}?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {setShowDeleteConfirmationDialog(false)}}>Cancel</Button>
                            <Button
                                onPress={() => {
                                    deleteEvent(event);
                                    setShowDeleteConfirmationDialog(false);
                                }}
                                labelStyle={{color: 'red'}}
                            >Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

            </KeyboardAvoidingView>
        </ScrollView>
    );

};

export default AddEditEvent;
