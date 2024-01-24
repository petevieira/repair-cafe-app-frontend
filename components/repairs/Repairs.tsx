import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Divider, Paragraph, Dialog, Portal, Provider, TextInput, Text, BottomNavigation, DataTable, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format } from "date-fns";

// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
import { getTodaysItems } from '../../requests/item-requests';
import Item from '../../models/Item';
import { AuthContext } from '../../contexts/auth-context';
import { Config } from '../../consts/app.consts';

let fakeItems: [Item] = [
  {id: 0, ownerAcceptsWaiver: true, ownersFirstName: "John1", ownersLastName: "Smith", ownersEmail: "john.smith1@gmail.com", type: "Toaster", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Joe", repairerLastName: "Smith", notes: "", status: "In Progress", repaired: false},
  {id: 1, ownerAcceptsWaiver: false, ownersFirstName: "John2", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Microwave", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Scott", repairerLastName: "Smith", notes: "", status: "Repaired", repaired: false},
  {id: 2, ownerAcceptsWaiver: true, ownersFirstName: "John3", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Hair Dryer", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Mark", repairerLastName: "Smith", notes: "", status: "Not Repaired", repaired: true},
  {id: 3, ownerAcceptsWaiver: true, ownersFirstName: "John4", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Laptop", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Pete", repairerLastName: "Smith", notes: "", status: "", repaired: false},
  {id: 4, ownerAcceptsWaiver: false, ownersFirstName: "John5", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Fan", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Mark", repairerLastName: "Smith", notes: "", status: "", repaired: false},
  {id: 5, ownerAcceptsWaiver: true, ownersFirstName: "John6", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Teddy Bear", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Joe", repairerLastName: "Smith", notes: "", status: "", repaired: true},
  {id: 6, ownerAcceptsWaiver: true, ownersFirstName: "John1", ownersLastName: "Smith", ownersEmail: "john.smith1@gmail.com", type: "Toaster", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Joe", repairerLastName: "Smith", notes: "", status: "In Progress", repaired: false},
  {id: 7, ownerAcceptsWaiver: false, ownersFirstName: "John2", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Microwave", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Scott", repairerLastName: "Smith", notes: "", status: "Repaired", repaired: false},
  {id: 8, ownerAcceptsWaiver: true, ownersFirstName: "John3", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Hair Dryer", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Mark", repairerLastName: "Smith", notes: "", status: "Not Repaired", repaired: true},
  {id: 9, ownerAcceptsWaiver: true, ownersFirstName: "John4", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Laptop", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Pete", repairerLastName: "Smith", notes: "", status: "", repaired: false},
  {id: 10, ownerAcceptsWaiver: false, ownersFirstName: "John5", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Fan", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Mark", repairerLastName: "Smith", notes: "", status: "", repaired: false},
  {id: 11, ownerAcceptsWaiver: true, ownersFirstName: "John6", ownersLastName: "Smith", ownersEmail: "john.smith@gmail.com", type: "Teddy Bear", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", repairerFirstName: "Joe", repairerLastName: "Smith", notes: "", status: "", repaired: true},
];

const Repairs = () => {
  console.debug("[Repairs]");
  const navigation = useNavigation();
  const [items, setItems] = React.useState([]);
  const [snackbarMsg, setSnackbarMsg] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [state, setState] = React.useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  const authenticated = !!state && state.token !== '' && state.user !== null;
  const [attemptedToGetItems, setAttemptedToGetItems] = React.useState(false);
  // Today's date
  const todaysDate = format(new Date(), "MMMM do, yyyy");

  const getItems = async (signal) => {
    setState({...state, showLoader: true});
    setAttemptedToGetItems(true);
    // if (Config.OFFLINE) {
    //   setItems(fakeItems);
    //   return;
    // }
    try {
      console.debug("sdfsdf");
      const response = await getTodaysItems(signal);
      console.debug("today's items: ", response.data.items);
      if (!response.status) {
        throw new Error(response.msg);
      }
      setItems(response.data.items);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error);
      setShowSnackbar(true);
    }
    setState({...state, showLoader: false});
  }

  const addItem = () => {
    console.debug("add Item pressed");
    navigation.navigate('AddEditRepair', {
      item: new Item()
    });
  }

  const itemTapped = (item) => {
    console.debug("[Repairs::itemTapped]");
    if (!authenticated) {
      return;
    }
    navigation.navigate('AddEditRepair', {
      item: item
    });
  }

  React.useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getItems(signal);
    return () => {
      abortController.abort();
      setItems(new Item());
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style = {{textAlign: "center", fontWeight: 'bold', fontSize: 16, marginLeft: 'auto', marginRight: 'auto'}}>Repair Queue{"\n"}({todaysDate})</Text>
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
            key={item._id}
            onPress={authenticated ? (() => itemTapped(item)) : undefined}
          >
            <DataTable.Cell>{item.id}</DataTable.Cell>
            <DataTable.Cell>{item.type}</DataTable.Cell>
            <DataTable.Cell>{item.ownersFirstName} {item.ownersLastName}</DataTable.Cell>
            <DataTable.Cell>{item.status}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
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
    </View>
  )
};

export default Repairs;
