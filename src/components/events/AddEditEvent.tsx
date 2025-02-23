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
import Event from 'models/Event';
import {
    createEvent, updateEvent, getEventById, deleteEventById
} from 'requests/event-requests';
import { useAuth } from 'contexts/auth-context';
import EventDatePicker from 'globals/EventDatePicker';

const AddEditEvent = ({route, navigation}) => {
    const paramEvent = route.params.event;

    // State variables
    const [id, setId] = useState("");
    const [event, setEvent] = useState(new Event());
    const [eventDate, setEventDate] = useState(paramEvent.date);
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg
    } = useAuth();
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);

    const eventOkToSave = (event: Event): boolean => {
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

    const addOrSaveEvent = async (event: Event) => {
        if (!eventOkToSave(event)) {
            return;
        }
        setShowLoader(true);
        try {
            if (!!event._id) {
                const updatedEvent = await updateEvent(event.date);
                console.debug("Updated event: ", updatedEvent);
                setSnackbarMsg("Event updated.");
            } else {
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

    const deleteEvent = async (event: Event) => {
        if (!event._id) {
            setSnackbarMsg("Event can't be deleted. It's not in the database.");
            return;
        }

        try {
            setShowLoader(true);
            const response = await deleteEventById(event._id);
            setSnackbarMsg("Event deleted.");
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

    const getExistingEvent = async (id: string) => {
        try {
            setShowLoader(true);
            const event = await getEventById(id);
            setEvent(event);
            setEventDate(event.date);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }


    useEffect(() => {
        if (!!paramEvent?._id) {
            getExistingEvent(paramEvent._id);
        } else {
            setEvent(paramEvent);
        }
    }, []);

    useEffect(() => {
        if (!!eventDate) {
            setEvent({...event, date: eventDate});
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
                    { !!event._id &&
                        <SubmitButton
                            style={{
                                ...styles.deleteButton,
                                flex: 1,
                                marginHorizontal: 5,
                            }}
                            text="⌫"
                            rippleColor="rgba(168,37,33,0.4)"
                            onPress={() => {
                                setShowDeleteConfirmationDialog(true);
                            }}
                        />
                    }
                        <SubmitButton
                            style={{
                                flex: 1,
                                marginHorizontal: 5,
                                color: 'white',
                            }}
                            text="✓"
                            onPress={() => {
                                addOrSaveEvent(event);
                            }}
                        >
                        </SubmitButton>
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
                            <Text>Are you sure you want to delete {eventDate} event</Text>
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
