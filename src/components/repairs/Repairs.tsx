import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from "date-fns";

import styles from 'globals/Styles'
import { getTodaysItems } from 'requests/item-requests';
import Item from 'models/Item';
import { useAuth } from 'contexts/auth-context';
import { NavigationProp } from 'globals/RootNavigation';
import appColors from 'globals/colors';

const Repairs = () => {
    const [items, setItems] = useState([]);
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg
    } = useAuth();
    const [repairsRetrieved, setRepairsRetrieved] = useState(false);
    const navigation = useNavigation<NavigationProp>();

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
                style={{backgroundColor: appColors.bgGray}}
            >
                <View style={styles.content}>
                    <Text style={{textAlign: "center"}}>({todaysDate})</Text>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title style={{flex: 1}}>{"\u21BA"}</DataTable.Title>
                            <DataTable.Title style={{flex: 1}}>#</DataTable.Title>
                            <DataTable.Title style={{flex: 3}}>Item</DataTable.Title>
                            <DataTable.Title style={{flex: 4}}>Owner</DataTable.Title>
                            <DataTable.Title style={{flex: 3}}>Repairer</DataTable.Title>
                            <DataTable.Title style={{flex: 4}}>Status</DataTable.Title>
                        </DataTable.Header>

                    {items.map((item, idx) => (
                        <DataTable.Row
                            key={item._id}
                            onPress={isLoggedIn ? (() => itemPressed(item)) : undefined}
                            style={{backgroundColor: ["In Queue", "In Progress"].indexOf(item.repairStatus) >= 0 ? appColors.bgGray : appColors.bgGreen}}
                        >
                            <DataTable.Cell style={{flex: 1}}>{item.isFollowUpRepair ? "\u270E" : ""}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 1}}>{idx+1}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 3}}>{item.product}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>{item.ownersFirstName} {item.ownersLastName}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 3}}>{item.repairerFirstName} {item.repairerLastName}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>{item.repairStatus}</DataTable.Cell>
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
                <FAB
                icon="plus"
                style={styles.fab}
                animated={false}
                onPress={addItemPressed}
                />
            }
        </>
    )
};

export default Repairs;
