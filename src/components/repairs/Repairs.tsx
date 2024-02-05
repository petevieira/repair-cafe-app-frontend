import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import { Button, Portal, TextInput, Text, DataTable, Snackbar, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
  const [items, setItems] = React.useState([]);
  const [snackbarMsg, setSnackbarMsg] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [state, setState] = React.useContext(AuthContext);
  const [repairsRetrieved, setRepairsRetrieved] = React.useState(false);

  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;
  const navigation = useNavigation();

  // Today's date
  const todaysDate = format(new Date(), "MMMM do, yyyy");

  // const getItems = async (signal) => {
  const getItems = async (signal) => {
    console.debug("[getItems]");
    setState({...state, showLoader: true});
    // if (Config.OFFLINE) {
    //   setItems(fakeItems);
    //   return;
    // }

    try {
      const response = await getTodaysItems();
      if (!response.status) {
        throw new Error(response.msg);
      }
      console.debug("setting items");
      setItems(response.data.items);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error);
      setShowSnackbar(true);
    }
    setState({...state, showLoader: false});
    setRepairsRetrieved(true);
  }

  const addItem = () => {
    navigation.navigate('Add/Edit Repair', {
      item: new Item()
    });
  }

  const itemTapped = (item) => {
    console.debug("[Repairs::itemTapped]");
    if (!authenticated) {
      return;
    }
    navigation.navigate('Add/Edit Repair', {
      item: item
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      // const abortController = new AbortController();
      // const signal = abortController.signal;
      // getItems(signal);

      getItems();
      return () => {
        console.debug("Repairs unmounted");
        // abortController.abort();
        // setItems(new Item());
      }
    },[])
  );

  return (
    <View style={styles.container}>
      { authenticated ?
        <FAB
          icon="plus"
          style={styles.fab}
          animated={false}
          onPress={addItem}
        />
        : <></>}
      <View style={styles.content}>
        <Text style={{textAlign: "center"}}>({todaysDate})</Text>
        <DataTable>
          <DataTable.Header style={{minWidth: 500}}>
            <DataTable.Title>#</DataTable.Title>
            <DataTable.Title>Item</DataTable.Title>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>

          {items.map((item, idx) => (
            <DataTable.Row
              key={item._id}
              onPress={authenticated ? (() => itemTapped(item)) : undefined}
            >
              <DataTable.Cell>{idx+1}</DataTable.Cell>
              <DataTable.Cell>{item.type}</DataTable.Cell>
              <DataTable.Cell>{item.ownersFirstName} {item.ownersLastName}</DataTable.Cell>
              <DataTable.Cell>{item.status}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        { repairsRetrieved && items.length <= 0 ?
          <Text
            style={{
              padding: 10,
              alignSelf: 'center'
            }}>No repairs yet today</Text>
          : <></>
        }
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
    </View>
  )
};

export default Repairs;
