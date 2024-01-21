import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Divider, Paragraph, Dialog, Portal, Provider, TextInput, HelperText, Text, Modal, BottomNavigation } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { format } from "date-fns";
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
// Fake data
import fakeUserEventsItems from '../../images/example_user_events.json';
import { useNavigation } from '@react-navigation/native';
import Item from '../../models/Item';
import CheckBox from "../../globals/CheckBox"
import HTMLView from 'react-native-htmlview';

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

const repairStatusOptions = [
	{ label: 'In Queue', value: 'inQueue' },
	{ label: 'In Progress', value: 'inProgress' },
	{ label: 'Repaired', value: 'repaired' },
	{ label: 'Undiagnosed', value: 'undiagnosed' },
	{ label: 'Needs parts', value: 'needsParts' },
];

const repairerOptions = [
	{ label: 'John S.', value: 'johnS' },
	{ label: 'Steve Johnson', value: 'steveJohnson' },
	{ label: 'Lauren Dahlin', value: 'laurenDahlin' },
];

const AddEditRepair = ({route, navigation}) => {
  // const navigation = useNavigation();
  const item = route.params.item;
  console.debug("item: ", item);
  // State variables
  const [acceptsWaiver, setAcceptsWaiver] = React.useState(item.ownerAcceptsWaiver)
  const [firstName, setFirstName] = React.useState(item.ownerFirstName);
  const [lastName, setLastName] = React.useState(item.ownerLastName);
  const [email, setEmail] = React.useState(item.ownerEmail);
  const [itemType, setItemType] = React.useState(item.type);
  const [itemBrand, setItemBrand] = React.useState(item.brand);
  const [itemModel, setItemModel] = React.useState(item.model);
  const [itemSymptoms, setItemSymptoms] = React.useState(item.symptoms);
  const [itemRepairer, setItemRepairer] = React.useState(item.repairer);
  const [itemRepairStatus, setItemRepairStatus] = React.useState(item.repairStatus);
	const [showRepairerDropDown, setShowRepairerDropDown] = React.useState(false);
	const [showStatusDropDown, setShowStatusDropDown] = React.useState(false);
  const [termsModalVisible, setTermsModalVisible] = React.useState(false);

  // const [firstNameValid, setFirstNameValid] = React.useState(true);
  // const [lastNameValid, setLastNameValid] = React.useState(true);
  // const [emailValid, setEmailValid] = React.useState(false);

	const scrollRef = React.useRef();

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

  const saveItem = (item: Item) => {
  	// if (!validateFirstName() || !validateLastName() || !validateEmail()) {
  		// return;
  	// }
  	console.debug("item: ", item);
  	// navigation.navigate('Repairs');
  }

  const getTitle = (item: Item) => {
  	if (!!item.ownerFirstName) {
  		return `${item.ownerFirstName}'s ${item.type}`;
  	} else {
	  	return "New Item"
	  }
  }


  // Today's date
  const today = format(new Date(), "MMMM do, yyyy");
  // Component's view
  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>

      <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
	      <ScrollView ref={scrollRef}>
	      	<Text variant="titleMedium">{getTitle(item)}</Text>

	        <CheckBox
	          label={<Text>I agree to the <Text style={{color: "blue"}} onPress={() => {
	            setTermsModalVisible(true);
	          }}>terms and conditions</Text></Text>}
	          status={acceptsWaiver ? 'checked' : 'unchecked'}
	          onPress={() => {
	            setAcceptsWaiver(!acceptsWaiver);
	          }}
	        />

	        <TextInput
	          label="Owner's first name"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={firstName}
	          onChangeText={firstName => setFirstName(firstName)}
	          // onBlur={() => validateFirstName()}
	        />
	{/*        <HelperText type="error" visible={!firstNameValid}>
	          Please enter a valid first name.
	        </HelperText>*/}

	        <TextInput
	          label="Owner's last name"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={lastName}
	          onChangeText={lastName => setLastName(lastName)}
	          // onBlur={() => validateLastName()}
	        />
	{/*        <HelperText type="error" visible={!lastNameValid}>
	          Please enter a valid last name or initial.
	        </HelperText>*/}

	        <TextInput
	          label="Owner's email"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={email}
	          onChangeText={email => setEmail(email.trim())}
	          // onBlur={() => validateEmail()}
	        />
	{/*        <HelperText type="error" visible={!emailValid}>
	          Please enter a valid email address.
	        </HelperText>*/}

	        <TextInput
	          label="Item type"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemType}
	          onChangeText={itemType => setItemType(itemType)}
	          // onBlur={() => validateItemType()}
	        />

	        <TextInput
	          label="Item Brand"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemBrand}
	          onChangeText={itemBrand => setItemBrand(itemBrand)}
	          // onBlur={() => validateItemBrand()}
	        />

	        <TextInput
	          label="Item Model"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemModel}
	          onChangeText={itemModel => setItemModel(itemModel)}
	          // onBlur={() => validateItemModel()}
	        />

	        <TextInput
	          label="Item Symptoms"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={itemSymptoms}
	          onChangeText={itemSymptoms => setItemSymptoms(itemSymptoms)}
	          // onBlur={() => validateItemSymptoms()}
	        />

	        <DropDown
	          label={"Repairer"}
	          mode="outlined"
	          visible={showRepairerDropDown}
	          showDropDown={() => setShowRepairerDropDown(true)}
	          onDismiss={() => setShowRepairerDropDown(false)}
	          value={itemRepairer}
	          setValue={setItemRepairer}
	          list={repairerOptions}
	        />

	        <DropDown
	          label={"Repair Status"}
	          mode="outlined"
	          visible={showStatusDropDown}
	          showDropDown={() => setShowStatusDropDown(true)}
	          onDismiss={() => setShowStatusDropDown(false)}
	          value={itemRepairStatus}
	          setValue={setItemRepairStatus}
	          list={repairStatusOptions}
	        />

	        <SubmitButton
	          text="Save"
	          // disabled={!validateForm()}
	          onPress={() => {
	          	const itemToSave: Item = {
	          		firstName,
	          		lastName,
	          		email,
	          		itemType,
	          		itemBrand,
	          		itemModel,
	          		itemSymptoms,
	          		itemRepairer,
	          		itemRepairStatus
	          	};
	          	saveItem(itemToSave)
	          }}
	        />

	        <SubmitButton
	          text="Add Item"
	          // disabled={!validateForm()}
	          onPress={() => {
	          	setItemType("");
	          	setItemBrand("");
	          	setItemModel("");
	          	setItemSymptoms("");
	          	setItemRepairer("");
	          	setItemRepairStatus("");
	          	// const newItem: Item = {
	          	// 	id: -1,
	          	// 	firstName,
	          	// 	lastName,
	          	// 	email,
	          	// 	itemType: "",
	          	// 	itemBrand: "",
	          	// 	itemModel: "",
	          	// 	itemSymptoms: "",
	          	// 	itemRepairer: "",
	          	// 	itemRepairStatus: ""
	          	// };
	          	// navigation.navigate('AddEditRepair', {
	          		// item: newItem
	          	// });
	          	scrollRef.current?.scrollTo({
						    y: 0,
						    animated: true,
						  });
	          }}
	        />

        </ScrollView>
        <Portal>
          <Modal style={styles.modalStyle} visible={termsModalVisible} onDismiss={() => {setTermsModalVisible(false)}}>
            <HTMLView value={terms}/>
          </Modal>
        </Portal>
      </View>

    </KeyboardAvoidingView>
  );

};

export default AddEditRepair;
