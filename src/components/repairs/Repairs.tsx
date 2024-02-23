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
import { useAuth } from '../../contexts/auth-context';
import { Config } from '../../consts/app.consts';

const Repairs = () => {
  const [items, setItems] = useState([]);
  const {
    authToken, setAuthToken,
    isLoggedIn, setIsLoggedIn,
    showLoader, setShowLoader,
    snackbarMsg, setSnackbarMsg
  } = useAuth();
  const [repairsRetrieved, setRepairsRetrieved] = useState(false);
  const navigation = useNavigation();

  // Today's date
  const todaysDate = format(new Date(), "MMMM do, yyyy");

  const getItems = async () => {
    setShowLoader(true);
    try {
      const response = await getTodaysItems();
      setItems(response.data.items);
      setShowLoader(false);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
      setShowLoader(false);
    }
    setRepairsRetrieved(true);
  }

  const addItemPressed = () => {
    navigation.navigate('Add/Edit Repair', {
      item: new Item()
    });
  }

  const itemPressed = (item) => {
    if (!isLoggedIn) {
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
      <ScrollView
        contentContainerStyle={styles.topScrollView}
        style={{backgroundColor: '#f2f2f2'}}
      >
      <View style={styles.content}>
        <Text style={{textAlign: "center"}}>({todaysDate})</Text>
        <DataTable>
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
              onPress={isLoggedIn ? (() => itemPressed(item)) : undefined}
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
      </ScrollView>
      { isLoggedIn &&
        // <SafeAreaView>
          // <View>
          <FAB
            icon="plus"
            style={styles.fab}
            animated={false}
            onPress={addItemPressed}
          />
          // </View>
        // </SafeAreaView>
      }
    </>
  )
};

export default Repairs;
