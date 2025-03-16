import { useState, useEffect, useRef } from 'react';
import { View, Platform, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { Button, Dialog, Portal, TextInput, HelperText, Text } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
const PaperDropDown = DropDown;
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import SubmitButton from "globals/SubmitButton"
import styles from 'globals/Styles'
import Repair from 'models/Repair';
import CheckBox from "globals/CheckBox"
import { useAuth } from 'contexts/auth-context';
import { getVolunteersByEvent } from 'requests/volunteer-requests';
import {
    addFullRepair, getRepair, updateRepair, deleteRepair, findOwnerByEmail, findIncompleteRepairsByOwner
} from 'requests/repair-requests';
import {
    subscribeEmailToNewsletter,
    unsubscribeEmailFromNewsletter,
    getIsSubscribed,
} from 'requests/subscriber-requests';
import { ProductCategoryValues, RepairStatusValues, RepairBarrierValues} from 'globals/ords';
import Terms from 'globals/Terms';
import { WEIGHT_UNITS, COST_UNITS } from '@env';
import { emailIsValid, eventInThePast, eventInTheFuture } from 'lib/helpers';
import { Response, RepairData, RepairsData, OwnerData, VolunteersData, SubscribedData } from 'types/Response';

const ordsProductCategoryList = ProductCategoryValues.map((el, idx) => {
    return { label: `${el.text} (${el.description})`, value: idx };
});

const ordsRepairStatusList = RepairStatusValues.map((el, idx) => {
    return { label: el, value: idx };
});

const ordsRepairBarrierList = RepairBarrierValues.map((el, idx) => {
    return { label: el, value: idx };
});

const MiscCategoryIdx = 17;

/**
 * Add/Edit Repair component
 * @param {Object} route - the route object
 * @param {Object} navigation - the navigation object
 * @returns The component view
 */
const AddEditRepair = ({route, navigation}) => {
    const [repairDetails, setRepairDetails] = useState(new Repair());
    const [waiverBoxChecked, setWaiverBoxChecked] = useState(false);
    const [pageTitle, setPageTitle] = useState("");
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [repairerList, setRepairerList] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [repairerIdx, setRepairerIdx] = useState(-1);
    const [showRepairerDropdown, setShowRepairerDropdown] = useState(false);
    const [statusIdx, setStatusIdx] = useState(-1);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [barrierIdx, setBarrierIdx] = useState(-1);
    const [showBarrierDropdown, setShowBarrierDropdown] = useState(false);
    const [productCategoryIdx, setProductCategoryIdx] = useState(MiscCategoryIdx)
    const [productCategoryFocused, setProductCategoryFocused] = useState(false);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const [previousIncompleteRepairs, setPreviousIncompleteRepairs] = useState([]);
    const [previousRepairsFocused, setPreviousRepairsFocused] = useState(false);
    const [selectedPreviousRepairIdx, setSelectedPreviousRepairIdx] = useState(null);
    const [showPreviousRepairsDropdown, setShowPreviousRepairsDropdown] = useState(false);
    const [subscribedToNewsletter, setSubscribedToNewsletter] = useState(false);
    const [showSaveConfirmationDialog, setShowSaveConfirmationDialog] = useState(false);
    const [saveConfirmationDialogMsg, setSaveConfirmationDialogMsg] = useState("");
    const [previousRepairsList, setPrevoiusRepairsList] = useState([]);
    const {
        setShowLoader,
        setSnackbarMsg,
        appEvent,
    } = useAuth();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    let emailInputRef = useRef<string>(null)

    const paramRepair = route.params.repair;

    /**
     * Check if a string is numeric
     * @param {string} str - the string to check
     * @returns {boolean} - true if the string is numeric, false otherwise
     */
    const isNumeric = (str: string): boolean => {
        return !isNaN(parseFloat(str)) && (parseFloat(str) > 0);
    };

    /**
     * Check if the repair is ready to be saved
     * @param {Repair} repair - the repair to check
     * @returns {boolean} - true if the repair is ready to be saved, false otherwise
     */
    const repairOkToSave = (repair: Repair): boolean => {
        let msg = "";
        if (!waiverBoxChecked) {
            msg = "Please agree to the terms";
        } else if (!repair.ownersEmail) {
            msg = "Please enter the owner's email";
        } else if (!emailIsValid(repair.ownersEmail)) {
            msg = "Please enter a valid email";
        } else if (!repair.ownersFirstName) {
            msg = "Please enter the owner's first name";
        } else if (!repair.product) {
            msg = "Please enter the product";
        } else if (!repair.type) {
            msg = "Please select a product category";
        } else if (!repair.symptoms) {
            msg = "Please enter symptoms";
        } else if (!isNumeric(repair.weight)) {
            msg = "Please enter a valid weight";
        } else if (!isNumeric(repair.cost)) {
            msg = "Please enter a valid cost";
        }
        if (msg !== '') {
            setSnackbarMsg(msg);
            return false;
        }
        return true;
    };

    /**
     * Save the repair to the database
     * @returns {Promise<void>}
     */
    const saveRepair = async (): Promise<void> => {
        if (!appEvent._id) {
            setSnackbarMsg("Event not found. Please try again.");
            return;
        }

        repairDetails.eventId = appEvent._id;
        if (!repairOkToSave(repairDetails)) {
            return
        }

        try {
            setShowLoader(true);
            if (!!repairDetails._id) {
                const res: Response<RepairData> = await updateRepair(repairDetails);
                setSnackbarMsg(res.msg);
            } else {
                const res: Response<RepairData> = await addFullRepair(repairDetails);
                setSnackbarMsg(res.msg);
            }
            navigation.navigate('Repairs');
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    };

    /**
     * Delete the current repair from the database
     * @returns {Promise}
     */
    const deleteCurrentRepair = async (): Promise<void> => {
        if (!repairDetails._id) {
            setSnackbarMsg("Repair can't be deleted. It doesn't have an _id.");
            return;
        }
        setShowLoader(false);
        try {
            const res: Response<RepairData> = await deleteRepair(repairDetails._id);
            setSnackbarMsg(res.msg);
            setTimeout(() => {
                navigation.navigate('Repairs');
            }, 500);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }

    /**
     * Set the page title based on the repair's owner's first name
     * @param {Repair} repair - the repair to set the title for
     * @returns {void}
     */
    const setTitle = (repair: Repair): void => {
        if (!!repair?.ownersFirstName) {
            setPageTitle(`${repair.ownersFirstName}'s ${repair.type}`);
        } else {
            setPageTitle("New Repair");
        }
    }

    /**
     * Check if the repair is new
     * @param {Repair} repair - the repair to check
     * @returns {boolean} - true if the repair is new, false otherwise
     */
    const isNewRepair = (repair: Repair): boolean => {
        return !repair || !repair._id;
    };

    /**
     * Get the volunteers for the current event
     * @returns {Promise<void>}
     */
    const getVolunteers = async (): Promise<void> => {
        if (!appEvent) {
            return;
        }

        try {
            const res: Response<VolunteersData> = await getVolunteersByEvent(appEvent._id);
            let list = [];
            if (res.data.volunteers.length <= 0) {
                setRepairerList(list);
                setVolunteers([]);
                return;
            }

            let tempVolunteers = res.data.volunteers;
            tempVolunteers.forEach((v, idx) => {
                list.push({ label: `${v.firstName} ${v.lastName}`, value: idx});
            });
            setRepairerList(list);
            setVolunteers(tempVolunteers);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        }
    };

    /**
     * Initialize the repair status
     * @param {Repair} repair - the repair to initialize the status for
     * @returns {Repair} - the repair with the status initialized
     */
    const initStatus = (repair: Repair): Repair => {
        repair.repairStatus = RepairStatusValues[0];
        setStatusIdx(0);
        return repair;
    };

    /**
     * Get the full repair details
     * @param {Repair} repair - the repair to get the details for
     * @returns {Promise<void>}
     */
    const getFullRepair = async (repair: Repair): Promise<void> => {
        setShowLoader(true);
        if (isNewRepair(repair)) {
            setPageTitle("New Repair");
            repair = initStatus(repair);
            setRepairDetails(repair);
            setWaiverBoxChecked(repair.acceptsWaiver);
            setShowLoader(false);
            return;
        }

        try {
            const res: Response<RepairData> = await getRepair(repair._id);
            let fullRepair = res.data.repair;
            setTitle(fullRepair);
            if (!fullRepair.repairStatus) {
                fullRepair = initStatus(fullRepair);
            }
            if (!fullRepair.type) {
                fullRepair.type = ordsProductCategoryList[MiscCategoryIdx].label;
                setProductCategoryIdx(MiscCategoryIdx);
            }
            setRepairDetails(fullRepair);
            setWaiverBoxChecked(fullRepair.acceptsWaiver);
            getSetSubscriberStatus(fullRepair.ownersEmail);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    };

    /**
     * Triggered when the "Owner's email" field loses focus.
     * If the repair is new and the email is valid, it searches for the owner by email.
     * If the owner is found, it fills the owner's first and last name.
     * @returns {Promise<void>}
     */
    const onEmailBlur = async (): Promise<void> => {
        if (!!repairDetails._id || !emailIsValid(repairDetails.ownersEmail)) {
            return;
        }

        try {
            setShowLoader(true);
            const res: Response<OwnerData> = await findOwnerByEmail(repairDetails.ownersEmail);

            if (!res.data.owner) {
                return;
            }

            const owner = res.data.owner;
            setSubscribedToNewsletter(owner.subscribedToNewsletter);
            setRepairDetails({
                ...repairDetails,
                ownersFirstName: owner.firstName,
                ownersLastName: owner.lastName
            });

        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    };

    /**
     * Triggered when the "Subscribe to newsletter?" checkbox is checked or unchecked.
     * @param {boolean} checked - true if the checkbox is checked, false if it's unchecked
     * @returns {Promise<void>}
     */
    const onSubscribeToggled = async (checked: boolean): Promise<void> => {
        if (!repairDetails.ownersEmail) {
            setSnackbarMsg("Please enter the owner's email first.");
            // Reset checkbox
            setSubscribedToNewsletter(!checked);
            return;
        }

        try {
            setShowLoader(true);
            if (checked) {
                await subscribeEmailToNewsletter(repairDetails.ownersEmail);
                setSnackbarMsg(repairDetails.ownersEmail + " subscribed to newsletter.");
            } else {
                await unsubscribeEmailFromNewsletter(repairDetails.ownersEmail);
                setSnackbarMsg(repairDetails.ownersEmail + " unsubscribed from newsletter.");
            }
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    };

    /**
     * Triggered when the "Follow-up repair?" checkbox is checked or unchecked.
     * Searches for past uncompleted repairs for the same owner.
     * @param checked - true if the checkbox is checked, false if it's unchecked
     * @returns {Promise<void>}
     */
    const onFollowUpRepairToggled = async (checked: boolean): Promise<void> => {
        if (checked) {
            if (!repairDetails.ownersEmail) {
                setRepairDetails({
                    ...repairDetails,
                    isFollowUpRepair: false,
                });
                setSnackbarMsg("Please enter the owner's email first.");
                return;
            }
            try {
                setShowLoader(true);
                const res: Response<RepairsData> = await findIncompleteRepairsByOwner(repairDetails.ownersEmail);
                handlePreviousRepairs(res.data.repairs);
            } catch (error) {
                console.error(error);
                setSnackbarMsg(error.message);
            } finally {
                setShowLoader(false);
            }
        } else {
            setPreviousIncompleteRepairs([]);
        }
    };

    const handlePreviousRepairs = (previousRepairs: Repair[]) => {
        setPrevoiusRepairsList(previousRepairs);
        let previousRepairsDisplayList = [];
        previousRepairs.forEach((i: Repair, idx: number) => {
            previousRepairsDisplayList.push({
                label: `${i.type} - ${i.product} - ${i.symptoms}`,
                value: `${idx}`
            });
        });
        setPreviousIncompleteRepairs(previousRepairsDisplayList);
    };

    /**
     * Fill the repair fields with the details of the selected previous repair
     * @param {number} idx - the index of the selected previous repair
     * @returns {Promise<void>}
     */
    const fillRepairFieldsFromPreviousRepair = async (idx: number): Promise<void> => {
        if (idx === null) {
            return;
        }

        const prevRepair = previousRepairsList[idx];
        setRepairDetails({
            ...repairDetails,
            product: prevRepair.product,
            type: prevRepair.type,
            brand: prevRepair.brand,
            model: prevRepair.model,
            symptoms: prevRepair.symptoms,
            repairerFirstName: prevRepair.repairerFirstName,
            repairerLastName: prevRepair.repairerLastName,
            repairNotes: prevRepair.repairNotes,
            repairStatus: "In Queue",
            weight: prevRepair.weight,
            cost: prevRepair.cost,
            isFollowUpRepair: true
        });
    };

    /**
     * Get the subscriber status for the given email
     * @param {string} email - the email to check
     * @returns {Promise<void>}
     */
    const getSetSubscriberStatus = async (email: string): Promise<void> => {
        if (!email) {
            return;
        }

        try {
            setShowLoader(true);
            const res: Response<SubscribedData> = await getIsSubscribed(email);
            setSubscribedToNewsletter(res.data.isSubscribed);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    };

    /**
     * Fetch the volunteers for the current event when the app event changes.
     */
    useEffect(() => {
        if (isNewRepair(paramRepair)) {
            if (emailInputRef.current) {
                emailInputRef.current?.focus();
            }
        }
        getVolunteers();
    }, [appEvent]);

    /**
     * Fetch the repair details when the component mounts
     */
    useEffect(() => {
        const fetchData = async () => {
            await getFullRepair(paramRepair);
        };
        fetchData();
    }, []);

    /**
     * Fetch and set whether the owner is subscribed to the newsletter
     * when the owner's email changes
     */
    useEffect(() => {
        getSetSubscriberStatus(repairDetails.ownersEmail);
    }, [repairDetails.ownersEmail]);

    /**
     * Set the repair status when the repair status index changes
     */
    useEffect(() => {
        if (statusIdx >= 0) {
            setRepairDetails({...repairDetails, repairStatus: ordsRepairStatusList[statusIdx].label})
        }
    }, [statusIdx]);

    /**
     * Set the repair barrier when the repair barrier index changes
     */
    useEffect(() => {
        if (barrierIdx >= 0) {
            setRepairDetails({...repairDetails, repairBarrier: ordsRepairBarrierList[barrierIdx].label})
        }
    }, [barrierIdx]);

    /**
     * Set the product category when the product category index changes
     */
    useEffect(() => {
        if (productCategoryIdx >= 0) {
            setRepairDetails({...repairDetails, type: ordsProductCategoryList[productCategoryIdx].label});
        }
    }, [productCategoryIdx]);

    /**
     * Set the repairer info when the repairer index changes
     */
    useEffect(() => {
        if (repairerIdx >= 0) {
            setRepairDetails({
                ...repairDetails,
                repairerFirstName: volunteers[repairerIdx].firstName,
                repairerLastName: volunteers[repairerIdx].lastName
            });
        }
        return () => {
            setRepairDetails(new Repair());
        }
    }, [repairerIdx]);

    /**
     * Set the repair status index when the repair status changes
     */
    useEffect(() => {
        ordsRepairStatusList.forEach((s, idx) => {
            if (s.label === repairDetails.repairStatus) {
                setStatusIdx(idx);
            }
            return () => {
                setStatusIdx(-1);
            }
        });
    }, [repairDetails]);

    /**
     * Set the repair barrier index when the repair changes
     */
    useEffect(() => {
        ordsRepairBarrierList.forEach((s, idx) => {
            if (s.label === repairDetails.repairBarrier) {
                setBarrierIdx(idx);
            }
            return () => {
                setBarrierIdx(-1);
            }
        });
    }, [repairDetails]);

    /**
     * Set the repairer index when the repairer changes
     */
    useEffect(() => {
        volunteers.forEach((v, idx) => {
            if (v.firstName.toLowerCase() === repairDetails.repairerFirstName.toLowerCase()
                && v.lastName.toLowerCase() === repairDetails.repairerLastName.toLowerCase()
        ) {
            setRepairerIdx(idx);
        }});
        return () => {
            setRepairerIdx(-1);
        }
    }, [volunteers, repairDetails]);

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
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 22,
                            alignSelf: 'center'
                        }}>{pageTitle}
                    </Text>

                    <TextInput
                        label={
                            <Text style={{color: '#717171'}}>{"Owner's email "}
                            <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        }
                        autoComplete={"off"}
                        inputMode={"email"}
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.ownersEmail ?? ""}
                        onBlur={onEmailBlur}
                        ref={emailInputRef}
                        onChangeText={newEmail => setRepairDetails(
                            { ...repairDetails, ownersEmail: newEmail.trim() }
                        )}
                    />
                    <TextInput
                        label={
                            <Text style={{color: '#717171'}}>{"Owner's first name "}
                            <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        }
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.ownersFirstName ?? ""}
                        onChangeText={newFirstName => setRepairDetails(
                            {...repairDetails, ownersFirstName: newFirstName.trim()}
                        )}
                    />
                    <TextInput
                        label={
                            <Text style={{color: '#717171'}}>{"Owner's last initial "}
                            </Text>
                        }
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.ownersLastName ?? ""}
                        onChangeText={newLastName => setRepairDetails(
                            {...repairDetails, ownersLastName: newLastName}
                        )}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <CheckBox
                            label={
                                <Text>{"Is this a "}
                                    <Text style={{ fontWeight: "bold" }}>
                                        {"follow-up repair"}
                                    </Text>
                                    {"?"}
                                </Text>
                            }
                            status={repairDetails.isFollowUpRepair ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setRepairDetails({
                                    ...repairDetails,
                                    isFollowUpRepair: !repairDetails.isFollowUpRepair
                                });
                                onFollowUpRepairToggled(!repairDetails.isFollowUpRepair);
                            }}
                        />
                    </View>
                { previousIncompleteRepairs.length > 0 &&
                    <View style={styles.dropdownContainer}>
                        <View style={[styles.label]}>
                            <Text style={{color: '#717171'}}>
                                Previous Repairs
                            </Text>
                        </View>
                        <ElementDropdown
                            style={[styles.dropdown, previousRepairsFocused && {borderWidth: 1}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.itemTextStyle}
                            data={previousIncompleteRepairs}
                            visible={showPreviousRepairsDropdown}
                            search={false}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Previous Repair"
                            value={selectedPreviousRepairIdx}
                            onFocus={() => setPreviousRepairsFocused(true)}
                            onBlur={() => setPreviousRepairsFocused(false)}
                            onChange={v => {
                                setSelectedPreviousRepairIdx(v.value);
                                fillRepairFieldsFromPreviousRepair(v.value);
                            }}
                        />
                    </View>
                }
                    <TextInput
                        label={
                            <Text style={{color: '#717171'}}>{"Product"}
                            <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        }
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.product ?? ""}
                        onChangeText={newProduct => setRepairDetails(
                            {...repairDetails, product: newProduct}
                        )}
                        placeholder="Vacuum / Toaster / Pants / ..."
                        placeholderTextColor={'#717171'}
                    />
                    <View style={styles.dropdownContainer}>
                        <View style={[styles.label]}>
                            <Text style={{color: '#717171'}}>
                                Product Category
                                <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        </View>
                        <ElementDropdown
                            style={[styles.dropdown, productCategoryFocused && {borderWidth: 1}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.itemTextStyle}
                            data={ordsProductCategoryList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Product Category"
                            searchPlaceholder="Search..."
                            value={ordsProductCategoryList[productCategoryIdx]}
                            onFocus={() => setProductCategoryFocused(true)}
                            onBlur={() => setProductCategoryFocused(false)}
                            onChange={v => {
                                setProductCategoryIdx(v.value);
                            }}
                        />
                    </View>
                    <TextInput
                        label="Brand"
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.brand ?? ""}
                        onChangeText={newBrand => setRepairDetails(
                            {...repairDetails, brand: newBrand}
                        )}
                        placeholder="Sony / Philips / Unknown / n.a."
                        placeholderTextColor={'#717171'}
                    />
                    <TextInput
                        label="Model"
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.model ?? ""}
                        onChangeText={newModel => setRepairDetails({...repairDetails, model: newModel})}
                        placeholder="Senseo HD 7850 / iPhone 15 / ..."
                        placeholderTextColor={'#717171'}
                    />
                    <TextInput
                        label={
                            <Text style={{color: '#717171'}}>{"Symptoms "}
                            <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        }
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.symptoms ?? ""}
                        onChangeText={newSymptoms => setRepairDetails(
                            {...repairDetails, symptoms: newSymptoms}
                        )}
                        placeholder="Doesn't turn on / no sound / won't heat / ..."
                        placeholderTextColor={'#717171'}
                    />
                    <TextInput
                        label={
                            <Text style={{color: '#717171'}}>{`Weight (${WEIGHT_UNITS})`}
                            <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        }
                        inputMode={"decimal"}
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.weight ? repairDetails.weight.toString() : ""}
                        onChangeText={newWeight => setRepairDetails(
                            {...repairDetails, weight: newWeight}
                        )}
                    />
                    <TextInput
                        label={
                            <Text style={{color: '#717171'}}>{`Cost (${COST_UNITS})`}
                            <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        }
                        mode="outlined"
                        inputMode={"decimal"}
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.cost ? repairDetails.cost.toString() : ""}
                        onChangeText={newCost => setRepairDetails(
                            {...repairDetails, cost: newCost}
                        )}
                    />
                    <TextInput
                        label="Repair Notes"
                        mode="outlined"
                        autoCorrect={false}
                        style={styles.short_text_input}
                        value={repairDetails.repairNotes ?? ""}
                        onChangeText={newNotes => setRepairDetails({...repairDetails, repairNotes: newNotes})}
                        placeholder="Fuse was blown. Replaced. / Soldered severed wire / ..."
                        placeholderTextColor={'#717171'}
                    />
                {
                    repairerList.length > 0 &&
                    <View style={styles.dropdownContainer}>
                        <View style={[styles.label]}>
                            <Text style={{color: '#717171'}}>
                                Repairer
                                <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        </View>
                        <ElementDropdown
                            placeholder={"Select repairer"}
                            value={repairerIdx}
                            data={repairerList}
                            style={[styles.dropdown, showStatusDropdown && {borderWidth: 1}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.itemTextStyle}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            onFocus={() => setShowRepairerDropdown(true)}
                            onBlur={() => setShowRepairerDropdown(false)}
                            onChange={v => {
                                setRepairerIdx(v.value);
                            }}
                        />
                    </View>
                }
                    <View style={styles.dropdownContainer}>
                        <View style={[styles.label]}>
                            <Text style={{color: '#717171'}}>
                                Repair Status
                                <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        </View>
                        <ElementDropdown
                            placeholder={"Repair Status"}
                            value={ordsRepairStatusList[statusIdx]}
                            data={ordsRepairStatusList}
                            style={[styles.dropdown, showStatusDropdown && {borderWidth: 1}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.itemTextStyle}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            onFocus={() => setShowStatusDropdown(true)}
                            onBlur={() => setShowStatusDropdown(false)}
                            onChange={v => {
                                setStatusIdx(v.value);
                            }}
                        />
                    </View>
                { statusIdx >= 0 && ordsRepairStatusList[statusIdx].label === 'End of life' &&
                    <View style={{marginTop: 10, width: '100%'}}>
                        <PaperDropDown
                            label={"Repair Barrier"}
                            mode="outlined"
                            visible={showBarrierDropdown}
                            showDropDown={() => setShowBarrierDropdown(true)}
                            onDismiss={() => setShowBarrierDropdown(false)}
                            value={barrierIdx}
                            setValue={setBarrierIdx}
                            list={ordsRepairBarrierList}
                        />
                    </View>
                }
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <CheckBox
                            label={
                                <Text>{"Subscribe to the newsletter?"}
                                </Text>
                            }
                            status={subscribedToNewsletter ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setSubscribedToNewsletter(!subscribedToNewsletter);
                                onSubscribeToggled(!subscribedToNewsletter);
                            }}
                        />
                    </View>
                    <CheckBox
                        label={
                            <Text>{"Repair owner agrees to the "}
                            <Text style={{color: "blue"}}
                            onPress={() => {
                                setTermsModalVisible(true);
                            }}
                            >{"terms and conditions"}</Text>
                            <Text>?</Text>
                            <Text style={{color: 'red'}}>*</Text>
                            </Text>
                        }
                        status={waiverBoxChecked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setRepairDetails({...repairDetails, acceptsWaiver: !waiverBoxChecked});
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
                    { !!repairDetails._id &&
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
                        >
                        </SubmitButton>
                    }
                        <SubmitButton
                            icon={() => <FontAwesome5 name="save" size={24} color="white" iconStyle="solid" />}
                            style={{
                                flex: 1,
                                marginHorizontal: 5
                            }}
                            rippleColor="#285882"
                            onPress={() => {
                                if (eventInThePast(appEvent)) {
                                    if (repairDetails._id) {
                                        setSaveConfirmationDialogMsg("You are editing a repair from a past event. Are you sure you want to save it?");
                                    } else {
                                        setSaveConfirmationDialogMsg("You are adding a repair to a past event. Are you sure you want to save it?");
                                    }
                                    setShowSaveConfirmationDialog(true);
                                } else if (eventInTheFuture(appEvent)) {
                                    if (repairDetails._id) {
                                        setSaveConfirmationDialogMsg("You are editing a repair from a future event. Are you sure you want to save it?");
                                    } else {
                                        setSaveConfirmationDialogMsg("You are adding a repair to a future event. Are you sure you want to save it?");
                                    }
                                    setShowSaveConfirmationDialog(true);
                                } else {
                                    saveRepair()
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
                    <Terms/>
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
                        <Dialog.Title>{"\u26A0 Alert"}</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to delete {repairDetails.ownersFirstName} {repairDetails.ownersLastName}'s {repairDetails.type}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {setShowDeleteConfirmationDialog(false)}}>Cancel</Button>
                            <Button
                                onPress={() => {
                                    deleteCurrentRepair();
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
                                    saveRepair();
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

export default AddEditRepair;
