import * as React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Button, Dialog, Portal, TextInput, HelperText, Text, Modal, Snackbar } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import { Dropdown } from 'react-native-element-dropdown';
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
// Fake data
import Item from '../../models/Item';
import CheckBox from "../../globals/CheckBox"
import { AuthContext } from '../../contexts/auth-context';
import { getTodaysVolunteers } from '../../requests/volunteer-requests';
import { addBasicItem, addFullItem, getItem, updateItem, deleteItem } from '../../requests/item-requests';
import { ProductCategoryValues, RepairStatusValues, RepairBarrierValues} from '../../globals/ords';

const terms =
`
<div>
  <div role="heading" aria-level="3">
    <h2><span>Tucson Repair Café/Library Liability Waiver</span></h2>
    </h3<span>Acknowledgement of Risk or Injury Possibility</span</h3>
    <p>
      <span>As a participant or volunteer in the program, I recognize the risk and acknowledge that there are certain risks of physical injury – including death, damages, property damage, or loss – which I may sustain as a result of participating in any and all activities connected with the program, or the use of the facilities or equipment.</span>
    </p>
    <h3><span>Waiver of Claim for Injury Clause</span></h3>
    <p>
      <span>I agree to waive and relinquish all claims that I may have for injuries or damages as a result of participating in the program or using the facilities or equipment against nonprofit organization and its officers, agents, servants, employees, other volunteers, and affiliates.</span>
    </p>
    <h3><span>Release from Liability Clause</span></h3>
    <p>
      <span>I do hereby release and discharge nonprofit organization and its officers, agents, servants, employees, volunteers and affiliates from any and all claims for injuries, including death, damages, property damage, or loss which may have or may in future accrue to me in account of participating in or volunteering for the nonprofit organization.</span>
    </p>
    <h3><span>Indemnity and Defense Clause</span></h3>
    <p>
      <span>I further agree to indemnify and hold harmless and pay defense costs and defend the nonprofit organization and its agents, servants, employees, other volunteers, and affiliates, from any and all claims resulting from injuries – including death, damages, property damage, or loss – sustained by me and arising out of, connected with, or in any way associated with the activities of the program or the use of facilities or equipment.</span>
    </p>
    <p>
      <i><span style="font-weight:normal;text-decoration:none">By checking the box below, you are agreeing to the terms of the waiver.</span></i>
    </p>
  </div>
</div>
</html>
`;

const statusesList = [
	{ value: 0, label: 'In Queue'  },
	{ value: 1, label: 'In Progress'  },
	{ value: 2, label: 'Complete' },
];

const ordsProductCategoryList = ProductCategoryValues.map((el, idx) => {
	return { label: el.text, value: idx };
});

const ordsRepairStatusList = RepairStatusValues.map((el, idx) => {
	return { label: el, value: idx };
});

const ordsRepairBarrierList = RepairBarrierValues.map((el, idx) => {
	return { label: el, value: idx };
});

const volunteersList = [
	{ label: 'John S.', value: 0 },
	{ label: 'Steve Johnson', value: 1 },
	{ label: 'Lauren Dahlin', value: 2 },
];

const miscCategoryIdx = 17;

const AddEditRepair = ({route, navigation}) => {
  const [itemDetails, setItemDetails] = React.useState(new Item());
  const [waiverBoxChecked, setWaiverBoxChecked] = React.useState(false);
  const [pageTitle, setPageTitle] = React.useState("");
	const [showRepairerDropdown, setShowRepairerDropdown] = React.useState(false);
	const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  const [termsModalVisible, setTermsModalVisible] = React.useState(false);
	const [showAddItemBtn, setShowAddItemBtn] = React.useState(false);
	const [repairerList, setRepairerList] = React.useState([]);
	const [volunteers, setVolunteers] = React.useState([]);
  const [snackbarMsg, setSnackbarMsg] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [repairerIdx, setRepairerIdx] = React.useState(-1);
  const [statusIdx, setStatusIdx] = React.useState(-1);
  const [state, setState] = React.useContext(AuthContext);
  const [statusFocused, setStatusFocused] = React.useState(false);
  const [productCategoryIdx, setProductCategoryIdx] = React.useState(miscCategoryIdx)
  const [productCategoryFocused, setProductCategoryFocused] = React.useState(false);
	const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = React.useState(false);

  // Set whether the user is authenticated from the AuthContext state
  const authenticated = !!state && state.token !== '' && state.user !== null;

	const paramItem = route.params.item;

  const validateFirstName = (): boolean => {
  	const valid = firstName !== "";
		setFirstNameValid(valid);
		return valid;
  }

  const validateLastName = (): boolean => {
  	const valid = lastName !== "";
  	setLastNameValid(valid);
  	return valid;
  }

  /**
   * Validates the user's email they entered in the email field.
   * @returns {boolean} - true if valid, false in not
   */
  const validateEmail = (): boolean => {
    // Email regular expression that must find a match
    const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
    const valid = reg.test(email) && email !== '';
    setEmailValid(valid);
    return valid;
  };

  const validateForm = (): boolean => {
  	return firstNameValid && lastNameValid && emailValid;
  }

  const saveItem = async () => {
  	try {
  		let response = null;
  		if (authenticated) {
  			if (!!itemDetails._id) {
  				response = await updateItem(itemDetails);
  			} else {
			  	response = await addFullItem(itemDetails);
  			}
		  } else {
		  	response = await addBasicItem(itemDetails);
		  }
		  if (!response.status) {
		  	console.error(response.msg);
	      setSnackbarMsg(response.msg);
	      setShowSnackbar(true);
	      return;
		  }
	  	navigation.navigate('Repairs');
	  } catch (error) {
	  	console.error(error);
	  }
  }

  const deleteCurrentItem = async () => {
  	if (!itemDetails._id) {
  		setSnackbarMsg("Item can't be deleted. It doesn't have an _id.");
  		setShowSnackbar(true);
  		return;
  	}
  	try {
	  	const response = await deleteItem(itemDetails._id);
		  if (!response.status) {
		  	console.error(response.msg);
	      setSnackbarMsg(response.msg);
	      setShowSnackbar(true);
	      return;
		  }
		  setSnackbarMsg("Item deleted");
		  setShowSnackbar(true);
		  setTimeout(() => {
		  	setSnackbarMsg("");
		  	setShowSnackbar(false);
		  	navigation.navigate('Repairs');
		  }, 1000);
	  } catch (error) {
	  	console.error(error);
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

  const getVolunteers = async (signal) => {
    try {
      const response = await getTodaysVolunteers(signal);
      let list = [];
      response.data.volunteers.forEach((v, idx) => {
      	list.push({ label: `${v.firstName} ${v.lastName}`, value: idx});
      });
      setRepairerList(list);
      setVolunteers(response.data.volunteers);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error);
      setShowSnackbar(true);
    }
  }

  const addMissingItemProperties = (item) => {
  	item.acceptsWaiver = item.acceptsWaiver ?? false;
  	return item;
  }

  const initStatus = (item) => {
		item.status = "In Queue";
		setStatusIdx(0);
		return item;
	}

  const getFullItem = async (item, signal) => {
  	setState({...state, showLoader: true});
  	if (isNewItem(item)) {
  		setPageTitle("New Item");
  		item = initStatus(item);
  		setItemDetails(item);
  		setWaiverBoxChecked(item.acceptsWaiver);
	  	setState({...state, showLoader: false});
  		return;
  	}

  	try {
  		const response = await getItem(item._id, signal);
  		let fullItem = response.data.item;
  		setTitle(fullItem);
  		if (!fullItem.status) {
				fullItem = initStatus(fullItem);
  		}
  		if (!fullItem.type) {
  			fullItem.type = ordsProductCategoryList[miscCategoryIdx].label;
  			setProductCategoryIdx(miscCategoryIdx);
  		}
  		setItemDetails(fullItem);
  		setWaiverBoxChecked(response.data.item.acceptsWaiver);
  	} catch (error) {
  		console.error(error);
  	}
  	setState({...state, showLoader: false});
  };

  const okayToSave = () => {
  	return (waiverBoxChecked
  		&& !!itemDetails.ownersFirstName
  		&& !!itemDetails.ownersLastName
  		&& !!itemDetails.ownersEmail
  		&& !!itemDetails.type)
  }

  React.useEffect(() => {
  	const abortController = new AbortController();
  	const signal = abortController.signal;
		getVolunteers(signal);
  	return () => {
  		abortController.abort();
  	}
  }, []);

  React.useEffect(() => {
  	const abortController = new AbortController();
  	const signal = abortController.signal;
  	getFullItem(paramItem, signal);
  	return () => {
  		console.debug("AddEditRepair unmounted")
  		abortController.abort();
  	}
  }, []);

  React.useEffect(() => {
  	if (statusIdx >= 0) {
	  	setItemDetails({...itemDetails, status: statusesList[statusIdx].label})
	  }
  }, [statusIdx]);

  React.useEffect(() => {
  	if (productCategoryIdx >= 0) {
  		setItemDetails({...itemDetails, type: ordsProductCategoryList[productCategoryIdx].label});
  	}
  }, [productCategoryIdx]);

  React.useEffect(() => {
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

  React.useEffect(() => {
		statusesList.forEach((s, idx) => {
			if (s.label === itemDetails.status) {
				setStatusIdx(idx);
			}
			return () => {
				setStatusIdx(-1);
			}
		});
  }, [itemDetails]);

  React.useEffect(() => {
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
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <View style = {{
      	alignItems: 'center',
      	justifyContent: 'center',
      }}>
	      	<Text style={{ fontWeight: 'bold', fontSize: 22 }}>{pageTitle}</Text>

	        <CheckBox
	          label={<Text>I agree to the <Text style={{color: "blue"}} onPress={() => {
	            setTermsModalVisible(true);
	          }}>terms and conditions</Text><Text style={{color: 'red'}}>*</Text></Text>}
	          status={waiverBoxChecked ? 'checked' : 'unchecked'}
	          onPress={() => {
	            setItemDetails({...itemDetails, acceptsWaiver: !waiverBoxChecked});
	            setWaiverBoxChecked(!waiverBoxChecked);
	          }}
	        />

	        <TextInput
	          label={<><Text style={{color: '#717171'}}>Owner's email</Text><Text style={{color: 'red'}}>*</Text></>}
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemDetails.ownersEmail ?? ""}
	          onChangeText={newEmail => setItemDetails({ ...itemDetails, ownersEmail: newEmail.trim()})}
	          // onBlur={() => validateEmail()}
	        />
	{/*        <HelperText type="error" visible={!emailValid}>
	          Please enter a valid email address.
	        </HelperText>*/}

	        <TextInput
	          label={<><Text style={{color: '#717171'}}>Owner's first name</Text><Text style={{color: 'red'}}>*</Text></>}
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemDetails.ownersFirstName ?? ""}
	          onChangeText={newFirstName => setItemDetails({...itemDetails, ownersFirstName: newFirstName.trim()})}
	          // onBlur={() => validateFirstName()}
	        />
	{/*        <HelperText type="error" visible={!firstNameValid}>
	          Please enter a valid first name.
	        </HelperText>*/}

	        <TextInput
	          label={<><Text style={{color: '#717171'}}>Owner's last name</Text><Text style={{color: 'red'}}>*</Text></>}
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemDetails.ownersLastName ?? ""}
	          onChangeText={newLastName => setItemDetails({...itemDetails, ownersLastName: newLastName})}
	          // onBlur={() => validateLastName()}
	        />
	{/*        <HelperText type="error" visible={!lastNameValid}>
	          Please enter a valid last name or initial.
	        </HelperText>*/}

	      	<View style={styles.dropdownContainer}>
		      	<View style={[styles.label]}>
	            <Text style={{color: '#717171'}}>Product Category<Text style={{color: 'red'}}>*</Text></Text>
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
	          label={<><Text style={{color: '#717171'}}>Symptoms</Text><Text style={{color: 'red'}}>*</Text></>}
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemDetails.symptoms ?? ""}
	          onChangeText={newSymptoms => setItemDetails({...itemDetails, symptoms: newSymptoms})}
	        />

	        <TextInput
	          label="Brand"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemDetails.brand ?? ""}
	          onChangeText={newBrand => setItemDetails({...itemDetails, brand: newBrand})}
	          // onBlur={() => validateItemBrand()}
	        />

	        <TextInput
	          label="Model"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemDetails.model ?? ""}
	          onChangeText={newModel => setItemDetails({...itemDetails, model: newModel})}
	        />

	        {authenticated && (
        		<>
			        <TextInput
			          label="Repair Notes"
			          mode="outlined"
			          autoCorrect={false}
			          style={styles.short_text_input}
			          value={itemDetails.notes ?? ""}
			          onChangeText={newNotes => setItemDetails({...itemDetails, notes: newNotes})}
			        />

			        {
			        	repairerList.length > 0 && <>
			        	<View
				      		style={{marginTop: 15, width: '90%', maxWidth: 500}}
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
					        />
				        </View>
				        </>
			      	}

			      	<View
			      		style={{marginTop: 15, width: '90%', maxWidth: 500}}
			      	>
			        <DropDown
			          label={"Repair Status"}
			          mode="outlined"
			          visible={showStatusDropdown}
			          showDropDown={() => setShowStatusDropdown(true)}
			          onDismiss={() => setShowStatusDropdown(false)}
			          value={statusIdx}
			          setValue={setStatusIdx}
			          list={statusesList}
			        />
			        </View>
						</>
					)}

	        <View
	        	style={{
	        		flexDirection: 'row',
	        		justifyContent: "space-evenly",
	        		alignItems: "center",
	        		marginBottom: 15
	        	}}
        	>

		        { authenticated && !!itemDetails._id &&
		        	<SubmitButton
                buttonColor='red'
                textColor="white"
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
		          disabled={!okayToSave()}
		          onPress={() => {
		          	saveItem(itemDetails)
		          }}
		        />
	        </View>

        <Portal>
          <Modal style={styles.modalStyle} visible={termsModalVisible} onDismiss={() => {setTermsModalVisible(false)}}>
            <HTMLView value={terms}/>
          </Modal>
        </Portal>

	      <Portal>
	        <Snackbar
	          visible={showSnackbar}
	          onDismiss={() => {
	            setShowSnackbar(false);
	            setSnackbarMsg("");
	          }}
	          action={{
	            label: "close"
	          }}
	        >{snackbarMsg}
	        </Snackbar>
	      </Portal>

	      <Portal>
	      	<Dialog
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
	      			}}>Delete</Button>
	      		</Dialog.Actions>
	      	</Dialog>
	      </Portal>
      </View>

    </KeyboardAvoidingView>
  );

};

export default AddEditRepair;
