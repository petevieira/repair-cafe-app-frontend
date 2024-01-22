import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Divider, Paragraph, Dialog, Portal, Provider, TextInput, HelperText, Text, Modal, BottomNavigation } from 'react-native-paper';
import DropDown from "react-native-paper-dropdown";
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';

// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
// Fake data
import Item from '../../models/Item';
import CheckBox from "../../globals/CheckBox"
import { AuthContext } from '../../contexts/auth-context';


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

const statusOptions = [
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
  const [newRepair, setNewRepair] = React.useState(!item.ownersEmail || !item.type)
  const [acceptsWaiver, setAcceptsWaiver] = React.useState(item.ownerAcceptsWaiver)
  const [firstName, setFirstName] = React.useState(item.ownersFirstName);
  const [lastName, setLastName] = React.useState(item.ownersLastName);
  const [email, setEmail] = React.useState(item.ownersEmail);
  const [type, setType] = React.useState(item.type);
  const [brand, setBrand] = React.useState(item.brand);
  const [model, setModel] = React.useState(item.model);
  const [symptoms, setSymptoms] = React.useState(item.symptoms);
  const [repairerFirstName, setRepairerFirstName] = React.useState(item.repairerFirstName);
  const [repairerLastName, setRepairerLastName] = React.useState(item.repairerLastName);
  const [repairerNotes, setItemRepairerNotes] = React.useState(item.repairerNotes);
  const [status, setStatus] = React.useState(item.status);
	const [repairerDropDown, setShowRepairerDropDown] = React.useState(false);
	const [showStatusDropDown, setShowStatusDropDown] = React.useState(false);
  const [termsModalVisible, setTermsModalVisible] = React.useState(false);
	const [showAddItemBtn, setShowAddItemBtn] = React.useState(false);

  const [state, setState] = React.useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  const authenticated = !!state && state.token !== '' && state.user !== null;

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
  	setShowAddItemBtn(true);
  }

  const getTitle = (item: Item) => {
  	if (!!item.ownersFirstName) {
  		return `${item.ownersFirstName}'s ${item.type}`;
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

      <View style = {{
      	alignItems: 'center',
      	justifyContent: 'center',
      }}>
	      	<Text style={{ fontWeight: 'bold', fontSize: 16 }}>{getTitle(item)}</Text>
          <Divider style={{ height: 1, backgroundColor: 'black', marginTop: 3}}/>

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
	          label="Type"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={type}
	          onChangeText={type => setType(type)}
	          // onBlur={() => validateItemType()}
	        />

	        <TextInput
	          label="Brand"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={brand}
	          onChangeText={brand => setBrand(brand)}
	          // onBlur={() => validateItemBrand()}
	        />

	        <TextInput
	          label="Model"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={model}
	          onChangeText={model => setModel(model)}
	        />

	        <TextInput
	          label="Symptoms"
	          mode="outlined"
	          autoCorrect={false}
	          style={styles.short_text_input}
	          value={symptoms}
	          onChangeText={symptoms => setSymptoms(symptoms)}
	        />

	        {authenticated && (
        		<>
			        <TextInput
			          label="Repairer Notes"
			          mode="outlined"
			          autoCorrect={false}
			          style={styles.short_text_input}
			          value={notes}
			          onChangeText={itemRepairerNotes => setItemRepairerNotes(itemRepairerNotes)}
			        />

			        <DropDown
			          label={"Repairer"}
			          mode="outlined"
			          visible={showRepairerDropDown}
			          showDropDown={() => setShowRepairerDropDown(true)}
			          onDismiss={() => setShowRepairerDropDown(false)}
			          value={`${repairerFirstName} ${repairerLastName}`}
			          setValue={setRepairer}
			          list={repairerOptions}
			        />

			        <DropDown
			          label={"Repair Status"}
			          mode="outlined"
			          visible={showStatusDropDown}
			          showDropDown={() => setShowStatusDropDown(true)}
			          onDismiss={() => setShowStatusDropDown(false)}
			          value={status}
			          setValue={setStatus}
			          list={statusOptions}
			        />
						</>
					)}

	        <View
	        	style={{
	        		flexDirection: 'row',
	        		justifyContent: "space-evenly",
	        		alignItems: "center"
	        	}}
        	>
		        <SubmitButton
		          text="Save"
		          style={{marginHorizontal: 10}}
		          // disabled={!validateForm()}
		          onPress={() => {
		          	const itemToSave: Item = {
		          		firstName,
		          		lastName,
		          		email,
		          		type,
		          		brand,
		          		model,
		          		symptoms,
		          		repairerFirstName,
		          		repairerLastName,
		          		status
		          	};
		          	saveItem(itemToSave)
		          }}
		        />

		        {showAddItemBtn && <SubmitButton
		          text="Add Item"
		          style={{marginHorizontal: 10}}
		          onPress={() => {
		          	setType("");
		          	setBrand("");
		          	setModel("");
		          	setSymptoms("");
		          	setRepairerFirstName("");
		          	setRepairerLastName("");
		          	setStatus("");
		          	setNewRepair(true);
		          }}
		        />}
	        </View>

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
