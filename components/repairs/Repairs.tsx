import * as React from 'react';
import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import {
  Button,
  Divider,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
  Text,
  BottomNavigation,
  DataTable
} from 'react-native-paper';
import { format } from "date-fns";
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles'
import UserRequests from '../../requests/repairs-requests';
import { useNavigation } from '@react-navigation/native';
import Item from '../../models/Item';

let fakeItems = [
  {id: 0, ownerAcceptsWaiver: true, ownerFirstName: "John1", ownerLastName: "Smith", ownerEmail: "john.smith1@gmail.com", type: "Toaster", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Joe", repairStatus: "In Progress"},
  {id: 1, ownerAcceptsWaiver: false, ownerFirstName: "John2", ownerLastName: "Smith", ownerEmail: "john.smith@gmail.com", type: "Microwave", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Scott", repairStatus: "Repaired"},
  {id: 2, ownerAcceptsWaiver: true, ownerFirstName: "John3", ownerLastName: "Smith", ownerEmail: "john.smith@gmail.com", type: "Hair Dryer", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Mark", repairStatus: "Not Repaired"},
  {id: 3, ownerAcceptsWaiver: true, ownerFirstName: "John4", ownerLastName: "Smith", ownerEmail: "john.smith@gmail.com", type: "Laptop", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Pete", repairStatus: ""},
  {id: 4, ownerAcceptsWaiver: false, ownerFirstName: "John5", ownerLastName: "Smith", ownerEmail: "john.smith@gmail.com", type: "Fan", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Mark", repairStatus: ""},
  {id: 5, ownerAcceptsWaiver: true, ownerFirstName: "John6", ownerLastName: "Smith", ownerEmail: "john.smith@gmail.com", type: "Teddy Bear", brand: "Sony", model: "Unknown", symptoms: "Doesn't turn on at all", solution: "", repairer: "Joe",  repairStatus: ""},
];

const Repairs = () => {
  const navigation = useNavigation();
  const [items] = React.useState(fakeItems);

  // Today's date
  const todaysDate = format(new Date(), "MMMM do, yyyy");

  const addItem = () => {
    const item: Item = {
      id: -1,
      ownerFirstName: "",
      ownerLastName: "",
      ownerEmail: "",
    };
    navigation.navigate('AddEditRepair', {
      item: item
    });
  }

  const itemTapped = (item) => {
    console.debug("item: ", item.type)
    navigation.navigate('AddEditRepair', {
      item: item
    });
  }

  return (
    <View style={styles.container}>

      <View style = {{alignSelf: 'center', alignItems: 'flex-start', margin: 20}}>
        <View style = {{marginBottom: 10}}>
          <Text style = {{ fontWeight: 'bold', fontSize: 16, marginLeft: 'auto', marginRight: 'auto'}}>{todaysDate}{"\n"}</Text>
          <Divider style={{ height: 1, backgroundColor: 'black', marginTop: 3}}/>
          <SubmitButton
            text="+ Add Item"
            onPress={() => {addItem()}}
          />
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>#</DataTable.Title>
                <DataTable.Title>Item</DataTable.Title>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
              </DataTable.Header>

              {items.map((item) => (
                <DataTable.Row key={item.id}
                  onPress={() => itemTapped(item)}
                >
                  <DataTable.Cell>{item.id}</DataTable.Cell>
                  <DataTable.Cell>{item.type}</DataTable.Cell>
                  <DataTable.Cell>{item.ownerFirstName} {item.ownerLastName}</DataTable.Cell>
                  <DataTable.Cell>{item.repairStatus}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </View>
      </View>
    </View>
  )
};

export default Repairs;
