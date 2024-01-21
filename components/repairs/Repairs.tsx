import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Divider, Paragraph, Dialog, Portal, Provider, TextInput, Text, BottomNavigation, DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format } from "date-fns";

// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
import UserRequests from '../../requests/repairs-requests';
import Item from '../../models/Item';
import { AuthContext } from '../../contexts/auth-context';

let fakeItems: [Item] = [
  {id: 0, ownerAcceptsWaiver: true, ownersFirstName: "John1", ownersLastName: "Smith", ownersEmail: "john.smith1@gmail.com", type: "Toaster", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Joe", repairerNotes: "", repairStatus: "In Progress"},
  {id: 1, ownerAcceptsWaiver: false, ownersFirstName: "John2", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Microwave", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Scott", repairerNotes: "", repairStatus: "Repaired"},
  {id: 2, ownerAcceptsWaiver: true, ownersFirstName: "John3", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Hair Dryer", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Mark", repairerNotes: "", repairStatus: "Not Repaired"},
  {id: 3, ownerAcceptsWaiver: true, ownersFirstName: "John4", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Laptop", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Pete", repairerNotes: "", repairStatus: ""},
  {id: 4, ownerAcceptsWaiver: false, ownersFirstName: "John5", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Fan", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Mark", repairerNotes: "", repairStatus: ""},
  {id: 5, ownerAcceptsWaiver: true, ownersFirstName: "John6", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Teddy Bear", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Joe", repairerNotes: "", repairStatus: ""},
  {id: 6, ownerAcceptsWaiver: true, ownersFirstName: "John1", ownersLastName: "Smith", ownersEmail: "john.smith1@gmail.com", type: "Toaster", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Joe", repairerNotes: "", repairStatus: "In Progress"},
  {id: 7, ownerAcceptsWaiver: false, ownersFirstName: "John2", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Microwave", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Scott", repairerNotes: "", repairStatus: "Repaired"},
  {id: 8, ownerAcceptsWaiver: true, ownersFirstName: "John3", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Hair Dryer", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Mark", repairerNotes: "", repairStatus: "Not Repaired"},
  {id: 9, ownerAcceptsWaiver: true, ownersFirstName: "John4", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Laptop", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Pete", repairerNotes: "", repairStatus: ""},
  {id: 10, ownerAcceptsWaiver: false, ownersFirstName: "John5", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Fan", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Mark", repairerNotes: "", repairStatus: ""},
  {id: 11, ownerAcceptsWaiver: true, ownersFirstName: "John6", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Teddy Bear", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Joe", repairerNotes: "", repairStatus: ""},
];

const Repairs = () => {
  const navigation = useNavigation();
  const [items] = React.useState(fakeItems);
  const [state, setState] = React.useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  const authenticated = !!state && state.token !== '' && state.user !== null;

  // Today's date
  const todaysDate = format(new Date(), "MMMM do, yyyy");

  const addItem = () => {
    navigation.navigate('AddEditRepair', {
      item: new Item()
    });
  }

  const itemTapped = (item) => {
    if (!authenticated) {
      return;
    }
    console.debug("item: ", item.type)
    navigation.navigate('AddEditRepair', {
      item: item
    });
  }

  return (
    <View style={styles.container}>
        <Text style = {{textAlign: "center", fontWeight: 'bold', fontSize: 16, marginLeft: 'auto', marginRight: 'auto'}}>Repair Queue{"\n"}({todaysDate})</Text>
        {/*<Divider style={{ height: 1, backgroundColor: 'black', marginTop: 3}}/>*/}
        {authenticated &&
          <View style={{marginHorizontal: 'auto'}}>
            <SubmitButton
              text="+ New Item"
              onPress={() => {addItem()}}
            />
          </View>
        }
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>#</DataTable.Title>
            <DataTable.Title>Item</DataTable.Title>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>

          {items.map((item) => (
            <DataTable.Row
              key={item.id}
              onPress={() => itemTapped(item)}
            >
              <DataTable.Cell>{item.id}</DataTable.Cell>
              <DataTable.Cell>{item.type}</DataTable.Cell>
              <DataTable.Cell>{item.ownersFirstName} {item.ownersLastName}</DataTable.Cell>
              <DataTable.Cell>{item.repairStatus}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      {/*</View>*/}
    </View>
  )
};

export default Repairs;
