import React, { useState, useEffect, useRef } from 'react';
import {
    View, ScrollView, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { Button, TextInput, Text, Dialog, Portal
} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Custom Components
import SubmitButton from "globals/SubmitButton"
import CheckBox from "globals/CheckBox"
import styles from 'globals/Styles'
import Volunteer from 'models/Volunteer';
import {
    addVolunteer, getVolunteer,
    updateVolunteer, deleteVolunteer, findVolunteerByEmail
} from 'requests/volunteer-requests';
import { useAuth } from 'contexts/auth-context';
import Terms from 'globals/Terms';
import { emailIsValid, eventInThePast, eventInTheFuture } from 'lib/helpers';
import { Response, VolunteerData } from 'types/Response';

/**
 * Component for adding or editing Volunteers
 * @param {object} props - The props for the component
 * @param {object} props.route - The route object
 * @param {object} props.navigation - The navigation object
 * @returns The component view
 */
const AddEditVolunteer = ({route, navigation}) => {
    const paramVolunteer = route.params.volunteer;

    // State variables
    const [waiverBoxChecked, setWaiverBoxChecked] = useState(false);
    const [volunteer, setVolunteer] = useState(new Volunteer());
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const {
        setShowLoader,
        setSnackbarMsg,
        appEvent,
    } = useAuth();
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const [showSaveConfirmationDialog, setShowSaveConfirmationDialog] = useState(false);
    const [saveConfirmationDialogMsg, setSaveConfirmationDialogMsg] = useState("");
    let emailInputRef = useRef<React.ElementRef<typeof TextInput> | null>(null);
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const volunteerOkToSave = (volunteer: Volunteer): boolean => {
        let msg = "";
        if (!volunteer.email) {
            msg = "Please enter your email.";
        } else if (!emailIsValid(volunteer.email)) {
            msg = "Please enter a valid email."
        } else if (!volunteer.firstName) {
            msg = "Please enter your first name.";
        } else if (!volunteer.lastName) {
            msg = "Please enter your last name.";
        } else if (!waiverBoxChecked) {
            msg = "Please agree to the terms.";
        }

        if (msg !== '') {
            setSnackbarMsg(msg);
            return false;
        }
        return true;
    }

    /**
     * Add or update a volunteer in the database depending on if the volunteer
     * has an _id or not.
     * @returns Promise<void>
     */
    const addSaveVolunteer = async (): Promise<void> => {
        if (!volunteerOkToSave(volunteer)) {
            return;
        }
        setShowLoader(true);
        try {
            if (!!volunteer._id) {
                const res: Response<VolunteerData> = await updateVolunteer(volunteer);
                setSnackbarMsg(res.msg);
            } else {
                volunteer.eventId = appEvent._id;
                const res: Response<VolunteerData> = await addVolunteer(volunteer);
                setSnackbarMsg(res.msg);
            }
            setShowLoader(false);
            navigation.navigate("Volunteers");
        } catch (error) {
            console.error(error);
            setShowLoader(false);
            setSnackbarMsg(error.message);
        }
    }

    /**
     * Delete the current volunteer from the database
     * @returns Promise<void>
     */
    const deleteCurrentVolunteer = async (): Promise<void> => {
        if (!volunteer._id) {
            setSnackbarMsg("Volunteer can't be deleted. They aren't in the database.");
            return;
        }
        setShowLoader(true);
        try {
            const response: Response<VolunteerData> = await deleteVolunteer(volunteer._id);
            setSnackbarMsg(response.msg);
            setTimeout(() => {
                navigation.navigate('Volunteers');
            }, 500);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }

    /**
     * Get the volunteer from the database
     * @param {string} id - The id of the volunteer to get
     * @returns Promise<void>
     */
    const getExistingVolunteer = async (id: string): Promise<void> => {
        setShowLoader(true);
        try {
            const response: Response<VolunteerData> = await getVolunteer(id);
            setVolunteer(response.data.volunteer);
            setWaiverBoxChecked(response.data.volunteer.acceptsWaiver);
            setShowLoader(false);
        } catch (error) {
            console.error(error);
            setShowLoader(false);
            setSnackbarMsg(error.message)
        }
    }

    /**
     * Check if the email is valid, and if the volunteer is new, check if the email
     * is already in the database and fill in the first and last name if it is.
     * @returns Promise<void>
     */
    const onEmailBlur = async (): Promise<void> => {
        if (!!volunteer._id || !emailIsValid(volunteer.email)) {
            return;
        }
        setShowLoader(true);
        try {
            const response: Response<VolunteerData> = await findVolunteerByEmail(volunteer.email);
            if (!response.data.volunteer) {
                return;
            }
            setVolunteer({
                ...volunteer,
                firstName: response.data.volunteer.firstName,
                lastName: response.data.volunteer.lastName
            });
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }

    useEffect(() => {
        if (!!paramVolunteer._id) {
            getExistingVolunteer(paramVolunteer._id);
        } else {
            setVolunteer(paramVolunteer);
            setWaiverBoxChecked(paramVolunteer.acceptsWaiver ?? false);
            emailInputRef.current?.focus();
        }
    }, []);

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

                    <TextInput
                        label={<><Text style={{color: '#717171'}}>Email</Text><Text style={{color: 'red'}}>*</Text></>}
                        mode="outlined"
                        inputMode={"email"}
                        autoComplete={"off"}
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={volunteer.email}
                        onBlur={onEmailBlur}
                        ref={emailInputRef}
                        onChangeText={newEmail => setVolunteer(
                            {...volunteer, email: newEmail.trim()}
                        )}
                    />

                    <TextInput
                        label={<><Text style={{color: '#717171'}}>First name</Text><Text style={{color: 'red'}}>*</Text></>}
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={volunteer.firstName}
                        onChangeText={newFirstName => setVolunteer({...volunteer, firstName: newFirstName.trim()})}
                    />

                    <TextInput
                        label={<><Text style={{color: '#717171'}}>Last name</Text><Text style={{color: 'red'}}>*</Text></>}
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={volunteer.lastName}
                        onChangeText={newLastName => setVolunteer({...volunteer, lastName: newLastName.trim()})}
                    />

                    <CheckBox
                        label={<Text>I agree to the <Text style={{color: "blue"}} onPress={() => {
                            setTermsModalVisible(true);
                        }}>terms and conditions</Text><Text style={{color: 'red'}}>*</Text></Text>}
                        status={waiverBoxChecked ? 'checked' : 'unchecked'}
                        onPress={async () => {
                            setVolunteer({...volunteer, acceptsWaiver: !waiverBoxChecked});
                            setWaiverBoxChecked(!waiverBoxChecked);
                        }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            gap: 10,
                        }}
                    >
                    { !!volunteer._id &&
                        <SubmitButton
                            icon={() => <FontAwesome5 name="trash-alt" size={18} color="white" />}
                            style={{
                                ...styles.deleteButton,
                                flex: 1,
                            }}
                            rippleColor="rgba(168,37,33,0.4)"
                            onPress={() => {
                                setShowDeleteConfirmationDialog(true);
                            }}
                        />
                    }
                        <SubmitButton
                            icon={() => <FontAwesome5 name="save" size={24} color="white" iconStyle="solid" />}
                            style={{
                                flex: 1,
                                marginHorizontal: 5,
                            }}
                            rippleColor="#285882"
                            onPress={() => {
                                if (eventInThePast(appEvent)) {
                                    if (volunteer._id) {
                                        setSaveConfirmationDialogMsg("You are editing a volunteer from a past event. Are you sure you want to save it?");
                                    } else {
                                        setSaveConfirmationDialogMsg("You are adding a volunteer to a past event. Are you sure you want to save it?");
                                    }
                                    setShowSaveConfirmationDialog(true);
                                } else if (eventInTheFuture(appEvent)) {
                                    if (volunteer._id) {
                                        setSaveConfirmationDialogMsg("You are editing a volunteer from a future event. Are you sure you want to save it?");
                                    } else {
                                        setSaveConfirmationDialogMsg("You are adding a volunteer to a future event. Are you sure you want to save it?");
                                    }
                                    setShowSaveConfirmationDialog(true);
                                } else {
                                    addSaveVolunteer()
                                }
                            }}
                        />
                    </View>
                </View>

            { termsModalVisible &&
                <View
                    style={{
                        position: 'absolute',
                        top: 5,
                        left: '50%',
                        transform: [{translateX: (-0.5 * screenWidth)}],
                        height: 0.7 * screenHeight,
                        maxWidth: 0.8 * screenWidth,
                        minWidth: 320,
                        backgroundColor: '#f2f2f2'
                    }}
                >
                    <Text
                        onPress={() => { setTermsModalVisible(false) }}
                        style={{
                            fontSize: 22,
                            marginLeft: 'auto',
                            paddingRight: 5,
                        }}
                    >
                        {"Close"}
                    </Text>
                    <Terms />
                </View>
            }

                <Portal>
                    <Dialog
                        style={{
                            minWidth: 320, maxWidth: 738, alignSelf: 'center'
                        }}
                        visible={showDeleteConfirmationDialog}
                        onDismiss={() => { setShowDeleteConfirmationDialog(false) }}
                    >
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to delete {volunteer.firstName} {volunteer.lastName}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {setShowDeleteConfirmationDialog(false)}}>Cancel</Button>
                            <Button
                                onPress={() => {
                                    deleteCurrentVolunteer();
                                    setShowDeleteConfirmationDialog(false);
                                }}
                                labelStyle={{color: 'red'}}
                            >Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                <Portal>
                    <Dialog
                        style={{
                            minWidth: 320, maxWidth: 738, alignSelf: 'center'
                        }}
                        visible={showSaveConfirmationDialog}
                        onDismiss={() => { setShowSaveConfirmationDialog(false) }}
                    >
                        <Dialog.Title style={{color: "red"}}>{"\u26A0 Alert"}</Dialog.Title>
                        <Dialog.Content>
                            <Text>{saveConfirmationDialogMsg}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {setShowSaveConfirmationDialog(false)}}>Cancel</Button>
                            <Button
                                onPress={() => {
                                    addSaveVolunteer();
                                    setShowSaveConfirmationDialog(false);
                                }}
                                labelStyle={{color: 'red'}}
                            >Save</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

            </KeyboardAvoidingView>
        </ScrollView>
    );

};

export default AddEditVolunteer;
