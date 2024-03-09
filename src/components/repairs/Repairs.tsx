import { useState, useContext, useCallback } from 'react';
import { View, ScrollView, SafeAreaView, SectionList } from 'react-native';
import { Button, TextInput, Text, DataTable, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from "date-fns";
import { RepairStatusValues } from '../../globals/ords';
import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist"
import DraggableFlatList from 'react-native-draggable-flatlist'

import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
import styles from '../../globals/Styles'
import { getTodaysItems } from '../../requests/item-requests';
import Item from '../../models/Item';
import { useAuth } from '../../contexts/auth-context';
import { Config } from '../../consts/app.consts';

/**
 * {
 *   'In Queue': 0,
 *   'In Progress': 1,
 *   ...
 * }
 */
const orderedRepairStatuses = {}
RepairStatusValues.forEach((el, idx) => {
  orderedRepairStatuses[el] = idx;
});

const Repairs = () => {
  const [items, setItems] = useState([]);
  const [sectionData, setSectionData] = useState([]);
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

  const sortItems = (items) => {
    let listSections = [
      // { title: string, data: [object] },
      // ...
    ];

    const sortedItems = items.sort((a, b) => {
      if (orderedRepairStatuses[a.repairStatus] < orderedRepairStatuses[b.repairStatus]) {
        return -1;
      } else if (orderedRepairStatuses[a.repairStatus] > orderedRepairStatuses[b.repairStatus]) {
        return 1;
      } else {
        // Same status. Check order number
        if (a.orderNumber < b.orderNumber) {
          return -1;
        } else if (a.orderNumber > b.orderNumber) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    sortedItems.forEach((el, idx) => {
      let foundSection = false
      for (let i=0; i < listSections.length; i++) {
        if (listSections[i].title === el.repairStatus) {
          foundSection;
          break;
        }
      }
      if (!foundSection) {
        // Add section with empty data array
        listSections.push({ title: el.repairStatus, data: []});
      }
      listSections[orderedRepairStatuses[el.repairStatus]].data.push(el);
    });

    setSectionData(listSections);
  }

  const getItems = async () => {
    setShowLoader(true);
    try {
      const response = await getTodaysItems();
      setItems(response.data.items);
      console.debug("items: ", response.data.items);
      if (response.data.items.length) {
        sortItems(response.data.items);
      }
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

  type DraggableItem = {
    key: string;
    label: string;
    height: number;
    width: number;
    backgroundColor: string;
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.topScrollView}
        style={{backgroundColor: '#f2f2f2'}}
      >
      <View style={styles.content}>
        <Text style={{textAlign: "center"}}>({todaysDate})</Text>
            {/*onPress={isLoggedIn ? (() => itemPressed(item)) : undefined}
              <DataTable.Cell>{idx+1}</DataTable.Cell>
              <DataTable.Cell>{item.type}</DataTable.Cell>
              <DataTable.Cell>{item.ownersFirstName} {item.ownersLastName}</DataTable.Cell>
              <DataTable.Cell>{item.repairerFirstName} {item.repairerLastName}</DataTable.Cell>
              <DataTable.Cell>{item.repairStatus}</DataTable.Cell>*/}
        <View style={{flexDirection: 'row', marginBottom: 10}} onPress={isLoggedIn ? (() => itemPressed(item)) : undefined}>
          <Text style={{flex: 1, fontSize: 18, fontWeight: 'bold'}}>#</Text>
          <Text style={{flex: 4, fontSize: 18, fontWeight: 'bold'}}>Type</Text>
          <Text style={{flex: 4, fontSize: 18, fontWeight: 'bold'}}>Owner</Text>
          <Text style={{flex: 4, fontSize: 18, fontWeight: 'bold'}}>Repairer</Text>
        </View>

        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={(item) => item.key}
          renderItem={({ item, drag, isActive }): RenderItemParams<DraggableItem> => {
            return (
              <TouchableOpacity>
                <Text style={{flex: 1, fontSize: 16}}>{index}</Text>
                <Text style={{flex: 4, fontSize: 16}}>{item.type}</Text>
                <Text style={{flex: 4, fontSize: 16}}>{item.ownersFirstName} {item.ownersLastName}</Text>
                <Text style={{flex: 4, fontSize: 16}}>{item.repairerFirstName} { item.repairerLastName}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <SectionList
          sections={sectionData}
          stickySectionHeadersEnabled={true}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            return (
              <View
                style={{flex: 1, flexDirection: 'row', marginVertical: 5}}
                onPress={() => {itemPressed(item)}}
              >
                <Text style={{flex: 1, fontSize: 16}}>{index}</Text>
                <Text style={{flex: 4, fontSize: 16}}>{item.type}</Text>
                <Text style={{flex: 4, fontSize: 16}}>{item.ownersFirstName} {item.ownersLastName}</Text>
                <Text style={{flex: 4, fontSize: 16}}>{item.repairerFirstName} { item.repairerLastName}</Text>
              </View>
            )
          }}
          renderSectionHeader={({section}) => {
            return (
              <> { section.data.length &&
                <Text style={{backgroundColor: '#cacaca', paddingVertical: 4, fontWeight: '500', textAlign: 'center', width: '100%', fontSize: 20}}>{section.title}</Text>
              }
              </>
            )
          }}
        />
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
