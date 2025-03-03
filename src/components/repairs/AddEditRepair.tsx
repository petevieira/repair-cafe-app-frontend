import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, Dialog, Portal, TextInput, HelperText, Text } from 'react-native-paper';
import { DropDown as PaperDropDown }  from "react-native-paper-dropdown";
import HTMLView from 'react-native-htmlview';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Nav from "globals/Nav"
import SubmitButton from "globals/SubmitButton"
import styles from 'globals/Styles'
import Repair from 'models/Repair';
import CheckBox from "globals/CheckBox"
import { useAuth } from 'contexts/auth-context';
import { getTodaysVolunteers } from 'requests/volunteer-requests';
import {
    addFullRepair, getRepair, updateRepair, deleteRepair, findOwnerByEmail, findIncompleteRepairsByOwner
} from 'requests/repair-requests';
import {
    subscribeEmailToNewsletter,
    unsubscribeEmailFromNewsletter,
} from 'requests/subscriber-requests';
import { ProductCategoryValues, RepairStatusValues, RepairBarrierValues} from 'globals/ords';
import Terms from 'globals/Terms';
import { WEIGHT_UNITS, COST_UNITS } from '@env';
import { emailIsValid } from 'lib/helpers';
import { sub } from 'date-fns';

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

const AddEditRepair = ({route, navigation}) => {
    const [repairDetails, setRepairDetails] = useState(new Repair());
    const [waiverBoxChecked, setWaiverBoxChecked] = useState(false);
    const [pageTitle, setPageTitle] = useState("");
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [showAddRepairBtn, setShowAddRepairBtn] = useState(false);
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
    const [selectedPreviousRepairIdx, setSelectedPreviousRepairIdx] = useState(null);
    const [showPreviousRepairsDropdown, setShowPreviousRepairsDropdown] = useState(false);
    const [subscribedToNewsletter, setSubscribedToNewsletter] = useState(false);
    let previousRepairsList = [];
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg,
        appEvent, setAppEvent,
    } = useAuth();

    let emailInputRef = useRef<string>(null)

    const paramRepair = route.params.repair;

    const isNumeric = (str: string): boolean => {
        return !isNaN(parseFloat(str)) && (parseFloat(str) > 0);
    }

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
            console.debug("cost: ", repair.cost);
            msg = "Please enter a valid cost";
        }
        if (msg !== '') {
            setSnackbarMsg(msg);
            return false;
        }
        return true;
    }

    const saveRepair = async () => {
        if (!appEvent._id) {
            setSnackbarMsg("Event not found. Please try again.");
            return;
        }
        console.debug("saving repair: ", repairDetails);
        repairDetails.eventId = appEvent._id;
        if (!repairOkToSave(repairDetails)) {
            return
        }

        try {
            setShowLoader(true);
            if (!!repairDetails._id) {
                console.debug("Updating repair: ", repairDetails);
                await updateRepair(repairDetails);
                setSnackbarMsg("Repair updated.");
            } else {
                console.debug("Adding repair: ", repairDetails);
                await addFullRepair(repairDetails);
                setSnackbarMsg("Repair added.");
            }
            navigation.navigate('Repairs');
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }

    const deleteCurrentRepair = async () => {
        if (!repairDetails._id) {
            setSnackbarMsg("Repair can't be deleted. It doesn't have an _id.");
            return;
        }
        setShowLoader(false);
        try {
            const response = await deleteRepair(repairDetails._id);
            setShowLoader(false);
            setSnackbarMsg("Repair deleted.");
            setTimeout(() => {
                navigation.navigate('Repairs');
            }, 500);
        } catch (error) {
            console.error(error);
            setShowLoader(false);
            setSnackbarMsg(error.message);
        }
    }

    const setTitle = (repair: Repair) => {
        if (!!repair?.ownersFirstName) {
            setPageTitle(`${repair.ownersFirstName}'s ${repair.type}`);
        } else {
            setPageTitle("New Repair");
        }
    }

    const isNewRepair = (repair: Repair) => {
        return !repair || !repair._id;
    }

    const getVolunteers = async () => {
        try {
            const response = await getTodaysVolunteers();
            let list = [];
            response.data.volunteers.forEach((v, idx) => {
                list.push({ label: `${v.firstName} ${v.lastName}`, value: idx});
            });
            setRepairerList(list);
            setVolunteers(response.data.volunteers);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        }
    }

    const initStatus = (repair: Repair) => {
        repair.repairStatus = RepairStatusValues[0];
        setStatusIdx(0);
        return repair;
    }

    const getFullRepair = async (repair: Repair) => {
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
            const response = await getRepair(repair._id);
            let fullRepair = response.data.repair;
            setTitle(fullRepair);
            if (!fullRepair.repairStatus) {
                fullRepair = initStatus(fullRepair);
            }
            if (!fullRepair.type) {
                fullRepair.type = ordsProductCategoryList[MiscCategoryIdx].label;
                setProductCategoryIdx(MiscCategoryIdx);
            }
            setRepairDetails(fullRepair);
            setWaiverBoxChecked(response.data.repair.acceptsWaiver);
            setShowLoader(false);
        } catch (error) {
            console.error(error);
            setShowLoader(false);
            setSnackbarMsg(error.message);
        }
    };

    const onEmailBlur = async () => {
        if (!!repairDetails._id || !emailIsValid(repairDetails.ownersEmail)) {
            return;
        }

        try {
            setShowLoader(true);
            const owner = await findOwnerByEmail(repairDetails.ownersEmail);

            setSubscribedToNewsletter(owner.subscribedToNewsletter);

            if (!owner?.firstName) {
                // Owner not found in the database
                return;
            }

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
    }

    const onSubscribeToggled = async (checked: boolean) => {
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
                setSnackbarMsg("Owner subscribed to newsletter.");
            } else {
                await unsubscribeEmailFromNewsletter(repairDetails.ownersEmail);
                setSnackbarMsg("Owner unsubscribed from newsletter.");
            }
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
    }

    /**
     * Triggered when the "Follow-up repair?" checkbox is checked or unchecked.
     * Searches for past uncompleted repairs for the same owner.
     * @param checked - true if the checkbox is checked, false if it's unchecked
     * @returns {Promise<void>}
     */
    const onFollowUpRepairToggled = async (checked: boolean) => {
        console.debug("Checked: ", checked);
        if (checked) {
            if (!repairDetails.ownersEmail) {
                setSnackbarMsg("Please enter the owner's email first.");
                return;
            }
            try {
                setShowLoader(true);
                previousRepairsList = await findIncompleteRepairsByOwner(repairDetails.ownersEmail);
                console.debug("Previous repairs: ", previousRepairsList);
                let previousRepairsDisplayList = [];
                previousRepairsList.forEach((i, idx) => {
                    previousRepairsDisplayList.push({
                        label: `${i.type} - ${i.product} - ${i.symptoms}`,
                        value: idx
                    });
                });
                setPreviousIncompleteRepairs(previousRepairsDisplayList);
            } catch (error) {
                console.error(error);
                setSnackbarMsg(error.message);
            } finally {
                setShowLoader(false);
            }
        } else {
            setPreviousIncompleteRepairs([]);
        }
    }

    const fillRepairFieldsFromPreviousRepair = async (idx) => {
        console.debug("fillRepairFieldsFromPreviousRepair: ", idx);
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
    }

    useEffect(() => {
        if (isNewRepair(paramRepair)) {
            if (emailInputRef.current) {
                emailInputRef.current?.focus();
            }
        }
        getVolunteers();
    }, []);

    useEffect(() => {
        getFullRepair(paramRepair);
    }, []);

    useEffect(() => {
        if (statusIdx >= 0) {
            setRepairDetails({...repairDetails, repairStatus: ordsRepairStatusList[statusIdx].label})
        }
    }, [statusIdx]);

    useEffect(() => {
        if (barrierIdx >= 0) {
            setRepairDetails({...repairDetails, repairBarrier: ordsRepairBarrierList[barrierIdx].label})
        }
    }, [barrierIdx]);

    useEffect(() => {
        if (productCategoryIdx >= 0) {
            setRepairDetails({...repairDetails, type: ordsProductCategoryList[productCategoryIdx].label});
        }
    }, [productCategoryIdx]);

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
                    <View style={{marginTop: 10, width: '100%'}}>
                        <PaperDropDown
                            label={"Previous Repairs"}
                            mode="outlined"
                            visible={showPreviousRepairsDropdown}
                            showDropDown={() => setShowPreviousRepairsDropdown(true)}
                            onDismiss={() => setShowPreviousRepairsDropdown(false)}
                            value={selectedPreviousRepairIdx}
                            setValue={setSelectedPreviousRepairIdx}
                            list={previousIncompleteRepairs}
                            dropdownPosition={"top"}
                            renderRightIcon={false}
                            onChange={v => {
                                fillRepairFieldsFromPreviousRepair(v);
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
                        <Dropdown
                            style={[styles.dropdown, productCategoryFocused && {borderWidth: 1}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.itemTextStyle}
                            iconStyle={styles.iconStyle}
                            data={ordsProductCategoryList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Product Category"
                            searchPlaceholder="Search..."
                            value={productCategoryIdx}
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
                        <Dropdown
                            placeholder={"Select repairer"}
                            value={repairerIdx}
                            data={repairerList}
                            style={[styles.dropdown, showStatusDropdown && {borderWidth: 1}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.itemTextStyle}
                            iconStyle={styles.iconStyle}
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
                        <Dropdown
                            placeholder={"Repair Status"}
                            value={statusIdx}
                            data={ordsRepairStatusList}
                            style={[styles.dropdown, showStatusDropdown && {borderWidth: 1}]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={styles.itemTextStyle}
                            iconStyle={styles.iconStyle}
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
                            dropdownPosition={"top"}
                            renderRightIcon={false}
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
                        style={{alignSelf: 'center'}}
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
                            style={{
                                ...styles.deleteButton,
                                flex: 1,
                            }}
                            rippleColor="rgba(168,37,33,0.4)"
                            onPress={() => {
                                setShowDeleteConfirmationDialog(true);
                            }}
                            icon={() => <FontAwesome5 name="trash-alt" size={18} color="white" />}
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
                                saveRepair()
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
                        transform: [{translateX: '-50%'}],
                        height: '70vh',
                        maxWidth: '80vw',
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
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to delete {repairDetails.ownersFirstName} {repairDetails.ownersLastName}'s {repairDetails.type}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {setShowDeleteConfirmationDialog(false)}}>Cancel</Button>
                            <Button
                                onPress={() => {
                                    deleteCurrentRepair(repairDetails);
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

export default AddEditRepair;
