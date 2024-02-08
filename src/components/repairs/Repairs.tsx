import { useState, useContext, useCallback } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Button, TextInput, Text, DataTable, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from "date-fns";

import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
import styles from '../../globals/Styles'
import { getTodaysItems } from '../../requests/item-requests';
import Item from '../../models/Item';
import { AuthContext } from '../../contexts/auth-context';
import { Config } from '../../consts/app.consts';

const Repairs = () => {
  const [items, setItems] = useState([]);
  const [state, setState] = useContext(AuthContext);
  const [repairsRetrieved, setRepairsRetrieved] = useState(false);

  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;
  const navigation = useNavigation();

  // Today's date
  const todaysDate = format(new Date(), "MMMM do, yyyy");

  const getItems = async () => {
    setState({...state, showLoader: true});
    try {
      const response = await getTodaysItems();
      setItems(response.data.items);
      setState({...state, showLoader: false});
    } catch (error) {
      console.error(error);
      setState({...state, snackbarMsg: error.message, showLoader: false});
    }
    setRepairsRetrieved(true);
  }

  const addItemPressed = () => {
    navigation.navigate('Add/Edit Repair', {
      item: new Item()
    });
  }

  const itemPressed = (item) => {
    if (!authenticated) {
      return;
    }
    navigation.navigate('Add/Edit Repair', {
      item: item
    });
  }

  useFocusEffect(
    useCallback(() => {
      getItems();
    },[])
  );

  return (
    <>
      <View style={styles.content}>
        <Text style={{textAlign: "center"}}>({todaysDate})</Text>
        <DataTable style={{flex: 6}}>
          <DataTable.Header>
            <DataTable.Title>#</DataTable.Title>
            <DataTable.Title>Item</DataTable.Title>
            <DataTable.Title>Owner</DataTable.Title>
            <DataTable.Title>Repairer</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>

          {items.map((item, idx) => (
            <DataTable.Row
              key={item._id}
              onPress={authenticated ? (() => itemPressed(item)) : undefined}
            >
              <DataTable.Cell>{idx+1}</DataTable.Cell>
              <DataTable.Cell>{item.type}</DataTable.Cell>
              <DataTable.Cell>{item.ownersFirstName} {item.ownersLastName}</DataTable.Cell>
              <DataTable.Cell>{item.repairerFirstName} {item.repairerLastName}</DataTable.Cell>
              <DataTable.Cell>{item.repairStatus}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
        { repairsRetrieved && items.length <= 0 &&
          <Text
            style={{
              padding: 10,
              alignSelf: 'center'
            }}>{"No repairs yet today"}
          </Text>
        }
      </View>
      { authenticated &&
        <SafeAreaView>
          <View>
          <FAB
            icon="plus"
            style={styles.fab}
            animated={false}
            onPress={addItemPressed}
          />
          </View>
        </SafeAreaView>
      }
    </>
  )
};

export default Repairs;
