import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, Dialog, Portal, TextInput, HelperText, Text } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import HTMLView from 'react-native-htmlview';
import { Dropdown } from 'react-native-element-dropdown';

import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
import styles from '../../globals/Styles'
import Item from '../../models/Item';
import CheckBox from "../../globals/CheckBox"
import { useAuth } from '../../contexts/auth-context';
import { getTodaysVolunteers } from '../../requests/volunteer-requests';
import { addFullItem, getItem, updateItem, deleteItem, findOwnerByEmail } from '../../requests/item-requests';
import { ProductCategoryValues, RepairStatusValues, RepairBarrierValues} from '../../globals/ords';
import Terms from '../../globals/Terms';
import { WEIGHT_UNITS, COST_UNITS } from '@env';
import { emailIsValid } from '../../lib/helpers';

const ordsProductCategoryList = ProductCategoryValues.map((el, idx) => {
  return { label: el.text, value: idx };
});

const ordsRepairStatusList = RepairStatusValues.map((el, idx) => {
  return { label: el, value: idx };
});

const ordsRepairBarrierList = RepairBarrierValues.map((el, idx) => {
  return { label: el, value: idx };
});

const MiscCategoryIdx = 17;

const AddEditRepair = ({route, navigation}) => {
  const [itemDetails, setItemDetails] = useState(new Item());
  const [waiverBoxChecked, setWaiverBoxChecked] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [showAddItemBtn, setShowAddItemBtn] = useState(false);
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
  const {
    authToken, setAuthToken,
    isLoggedIn, setIsLoggedIn,
    showLoader, setShowLoader,
    snackbarMsg, setSnackbarMsg
  } = useAuth();

  let emailInputRef = useRef()

  const paramItem = route.params.item;

  const isNumeric = (str: string): boolean => {
    return !isNaN(parseFloat(str)) && (parseFloat(str) > 0);
  }

  const itemOkToSave = (item): boolean => {
    let msg = "";
    if (!waiverBoxChecked) {
      msg = "Please agree to the terms at the top";
    } else if (!item.ownersEmail) {
      msg = "Please enter the owner's email";
    } else if (!emailIsValid(item.ownersEmail)) {
      msg = "Please enter a valid email";
    } else if (!item.ownersFirstName) {
      msg = "Please enter the owner's first name";
    } else if (!item.ownersLastName) {
      msg = "Please enter the owner's last name";
    } else if (!item.type) {
      msg = "Please select a product category";
    } else if (!item.symptoms) {
      msg = "Please enter symptoms";
    } else if (!isNumeric(item.weight)) {
      msg = "Please enter a valid weight";
    } else if (!isNumeric(item.cost)) {
      console.debug("cost: ", item.cost);
      msg = "Please enter a valid cost";
    }
    if (msg !== '') {
      setSnackbarMsg(msg);
      return false;
    }
    return true;
  }

  const saveItem = async () => {
    if (!itemOkToSave(itemDetails)) {
      return
    }
    setShowLoader(true);
    try {
      let response = null;
      if (!!itemDetails._id) {
        response = await updateItem(itemDetails);
        setSnackbarMsg("Item updated.");
      } else {
        response = await addFullItem(itemDetails);
        setSnackbarMsg("New item added.");
      }
      setShowLoader(false);
      navigation.navigate('Repairs');
    } catch (error) {
      console.error(error);
      setShowLoader(false);
      setSnackbarMsg(error.message);
    }
  }

  const deleteCurrentItem = async () => {
    if (!itemDetails._id) {
      setSnackbarMsg("Item can't be deleted. It doesn't have an _id.");
      return;
    }
    setShowLoader(false);
    try {
      const response = await deleteItem(itemDetails._id);
      setShowLoader(false);
      setSnackbarMsg("Item deleted.");
      setTimeout(() => {
        navigation.navigate('Repairs');
      }, 500);
    } catch (error) {
      console.error(error);
      setShowLoader(false);
      setSnackbarMsg(error.message);
    }
  }

  const setTitle = (item: Item) => {
    if (!!item?.ownersFirstName) {
      setPageTitle(`${item.ownersFirstName}'s ${item.type}`);
    } else {
      setPageTitle("New Item");
    }
  }

  const isNewItem = (item) => {
    return !item || !item._id;
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

  const addMissingItemProperties = (item) => {
    item.acceptsWaiver = item.acceptsWaiver ?? false;
    return item;
  }

  const initStatus = (item) => {
    item.repairStatus = RepairStatusValues[0];
    setStatusIdx(0);
    return item;
  }

  const initBarrier = (item) => {
    item.barrier = RepairBarrierValues[0];
    setBarrierIdx(0);
    return item;
  }

  const getFullItem = async (item) => {
    setShowLoader(true);
    if (isNewItem(item)) {
      setPageTitle("New Item");
      item = initStatus(item);
      setItemDetails(item);
      setWaiverBoxChecked(item.acceptsWaiver);
      setShowLoader(false);
      return;
    }

    try {
      const response = await getItem(item._id);
      let fullItem = response.data.item;
      setTitle(fullItem);
      if (!fullItem.repairStatus) {
        fullItem = initStatus(fullItem);
      }
      if (!fullItem.type) {
        fullItem.type = ordsProductCategoryList[MiscCategoryIdx].label;
        setProductCategoryIdx(MiscCategoryIdx);
      }
      setItemDetails(fullItem);
      setWaiverBoxChecked(response.data.item.acceptsWaiver);
      setShowLoader(false);
    } catch (error) {
      console.error(error);
      setShowLoader(false);
      setSnackbarMsg(error.message);
    }
  };

  const onEmailBlur = async () => {
    if (!!itemDetails._id || !emailIsValid(itemDetails.ownersEmail)) {
      return;
    }
    setShowLoader(true);
    try {
      const response = await findOwnerByEmail(itemDetails.ownersEmail);
      const owner = response.data.owner;
      if (!!owner) {
        setItemDetails({
          ...itemDetails,
          ownersFirstName: owner.firstName,
          ownersLastName: owner.lastName
        });
      }
      setShowLoader(false);
    } catch (error) {
      console.error(error);
      setShowLoader(false);
      setSnackbarMsg(error.message);
    }
  }

  useEffect(() => {
    if (isNewItem(paramItem)) {
      emailInputRef.current.focus();
    }
    getVolunteers();
  }, []);

  useEffect(() => {
    getFullItem(paramItem);
  }, []);

  useEffect(() => {
    if (statusIdx >= 0) {
      setItemDetails({...itemDetails, repairStatus: ordsRepairStatusList[statusIdx].label})
    }
  }, [statusIdx]);

  useEffect(() => {
    if (barrierIdx >= 0) {
      setItemDetails({...itemDetails, repairBarrier: ordsRepairBarrierList[barrierIdx].label})
    }
  }, [barrierIdx]);

  useEffect(() => {
    if (productCategoryIdx >= 0) {
      setItemDetails({...itemDetails, type: ordsProductCategoryList[productCategoryIdx].label});
    }
  }, [productCategoryIdx]);

  useEffect(() => {
    if (repairerIdx >= 0) {
      setItemDetails({
        ...itemDetails,
        repairerFirstName: volunteers[repairerIdx].firstName,
        repairerLastName: volunteers[repairerIdx].lastName
      });
    }
    return () => {
      setItemDetails(new Item());
    }
  }, [repairerIdx]);

  useEffect(() => {
    ordsRepairStatusList.forEach((s, idx) => {
      if (s.label === itemDetails.repairStatus) {
        setStatusIdx(idx);
      }
      return () => {
        setStatusIdx(-1);
      }
    });
  }, [itemDetails]);

  useEffect(() => {
    ordsRepairBarrierList.forEach((s, idx) => {
      if (s.label === itemDetails.repairBarrier) {
        setBarrierIdx(idx);
      }
      return () => {
        setBarrierIdx(-1);
      }
    });
  }, [itemDetails]);

  useEffect(() => {
    volunteers.forEach((v, idx) => {
      if (v.firstName === itemDetails.repairerFirstName
        && v.lastName === itemDetails.repairerLastName
      ) {
        setRepairerIdx(idx);
      }
    });
    return () => {
      setRepairerIdx(-1);
    }
  }, [volunteers, itemDetails]);



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
          <CheckBox
          style={{alignSelf: 'center'}}
            label={
              <Text>{"I agree to the "}
                <Text style={{color: "blue"}}
                  onPress={() => {
                    setTermsModalVisible(true);
                  }}
                >{"terms and conditions"}</Text>
                <Text style={{color: 'red'}}>*</Text>
              </Text>
            }
            status={waiverBoxChecked ? 'checked' : 'unchecked'}
            onPress={() => {
              setItemDetails({...itemDetails, acceptsWaiver: !waiverBoxChecked});
              setWaiverBoxChecked(!waiverBoxChecked);
            }}
          />
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
            value={itemDetails.ownersEmail ?? ""}
            onBlur={onEmailBlur}
            ref={emailInputRef}
            onChangeText={newEmail => setItemDetails(
              { ...itemDetails, ownersEmail: newEmail.trim() }
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
            value={itemDetails.ownersFirstName ?? ""}
            onChangeText={newFirstName => setItemDetails(
              {...itemDetails, ownersFirstName: newFirstName.trim()}
            )}
          />
          <TextInput
            label={
                <Text style={{color: '#717171'}}>{"Owner's last name "}
                  <Text style={{color: 'red'}}>*</Text>
                </Text>
            }
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={itemDetails.ownersLastName ?? ""}
            onChangeText={newLastName => setItemDetails(
              {...itemDetails, ownersLastName: newLastName}
            )}
          />
          <View style={styles.dropdownContainer}>
            <View style={[styles.label]}>
              <Text style={{color: '#717171'}}>
                Product Category
                <Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <Dropdown
              style={[styles.dropdown, productCategoryFocused && {borderWidth: 2}]}
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
            label={
                <Text style={{color: '#717171'}}>{"Symptoms "}
                  <Text style={{color: 'red'}}>*</Text>
                </Text>
            }
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={itemDetails.symptoms ?? ""}
            onChangeText={newSymptoms => setItemDetails(
              {...itemDetails, symptoms: newSymptoms}
            )}
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
            value={itemDetails.weight ? itemDetails.weight.toString() : ""}
            onChangeText={newWeight => setItemDetails(
              {...itemDetails, weight: newWeight}
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
            value={itemDetails.cost ? itemDetails.cost.toString() : ""}
            onChangeText={newCost => setItemDetails(
              {...itemDetails, cost: newCost}
            )}
          />
          <TextInput
            label="Brand"
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={itemDetails.brand ?? ""}
            onChangeText={newBrand => setItemDetails(
              {...itemDetails, brand: newBrand}
            )}
          />
          <TextInput
            label="Model"
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={itemDetails.model ?? ""}
            onChangeText={newModel => setItemDetails({...itemDetails, model: newModel})}
          />
          <TextInput
            label="Repair Notes"
            mode="outlined"
            autoCorrect={false}
            style={styles.short_text_input}
            value={itemDetails.repairNotes ?? ""}
            onChangeText={newNotes => setItemDetails({...itemDetails, repairNotes: newNotes})}
          />
          {
            repairerList.length > 0 &&
            <View
              style={{marginTop: 5, width: '100%', maxWidth: 500}}
            >
              <DropDown
                label={"Repairer"}
                mode="outlined"
                visible={showRepairerDropdown}
                showDropDown={() => setShowRepairerDropdown(true)}
                onDismiss={() => setShowRepairerDropdown(false)}
                value={repairerIdx}
                setValue={setRepairerIdx}
                list={repairerList}
                dropdownPosition={"top"}
              />
            </View>
          }
          <View
            style={{marginTop: 10, width: '100%'}}
          >
            <DropDown
              label={"Repair Status"}
              mode="outlined"
              visible={showStatusDropdown}
              showDropDown={() => setShowStatusDropdown(true)}
              onDismiss={() => setShowStatusDropdown(false)}
              value={statusIdx}
              setValue={setStatusIdx}
              list={ordsRepairStatusList}
              dropdownPosition={"top"}
              renderRightIcon={false}
            />
          </View>
          { statusIdx >= 0 && ordsRepairStatusList[statusIdx].label === 'End of life' &&
            <View
              style={{marginTop: 10, width: '100%'}}
            >
              <DropDown
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
              justifyContent: "space-evenly",
              alignItems: "center",
              marginBottom: 15
            }}
          >
            { !!itemDetails._id &&
              <SubmitButton
                style={styles.deleteButton}
                rippleColor="rgba(168,37,33,0.4)"
                text="Delete"
                onPress={() => {
                  setShowDeleteConfirmationDialog(true);
                }}
              />
            }
            <SubmitButton
              text="Save"
              style={{marginHorizontal: 10}}
              onPress={() => {
                saveItem(itemDetails)
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
        {/*</ScrollView>*/}

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
              <Text>Are you sure you want to delete {itemDetails.ownersFirstName} {itemDetails.ownersLastName}'s {itemDetails.type}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => {setShowDeleteConfirmationDialog(false)}}>Cancel</Button>
              <Button onPress={() => {
                deleteCurrentItem(itemDetails);
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
