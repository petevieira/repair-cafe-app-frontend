import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from "date-fns";

import styles from 'globals/Styles'
import { getItemsByDate, findPreviousEventDate, findNextEventDate } from 'requests/item-requests';
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
        snackbarMsg, setSnackbarMsg,
        eventDate, setEventDate,
        timeZone, setTimeZone,
    } = useAuth();
    const [repairsRetrieved, setRepairsRetrieved] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    // Today's date
    const todaysDate = format(new Date(), "MMMM do, yyyy");

    const getItems = async (isoDate: string) => {
        console.debug("date: ", isoDate);
        // Convert date string to Date object
        try {
            setShowLoader(true);
            const items = await getItemsByDate(isoDate);
            setItems(items);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
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

    const goToPreviousEvent = async () => {
        let date = new Date(eventDate);
        date = new Date(date.setUTCDate(date.getUTCDate() - 1));
        date.setUTCHours(23, 59, 59, 999);
        const previousDate = await findPreviousEventDate(date.toISOString());
        if (!previousDate) {
            setSnackbarMsg("No previous events");
            return;
        }
        console.debug("Previous event date: ", previousDate);
        setEventDate(format(previousDate, "MMMM do, yyyy"));
        getItems(previousDate.toISOString());
    }

    const goToNextEvent = async () => {
        if (new Date(eventDate).toISOString().slice(0, 10)
            === new Date().toISOString().slice(0, 10)
        ) {
            setSnackbarMsg("Can't go to future events");
            return;
        }

        let date = new Date(eventDate);
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        const nextDate = await findNextEventDate(date.toISOString());
        if (!nextDate) {
            setSnackbarMsg("No future events");
            return;
        }
        console.debug("Next event date: ", nextDate);
        setEventDate(format(nextDate, "MMMM do, yyyy"));
        getItems(nextDate.toISOString());
    }

    useFocusEffect(
        useCallback(() => {
            getItems(todaysDate);
        },[])
    );

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.topScrollView}
                style={{backgroundColor: appColors.bgGray}}
            >
                <View style={styles.content}>
                    {/* Left and right arrows on either side of the date */}
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text
                            style={{}}
                            onPress={() => goToPreviousEvent()}
                        >{"◄"}</Text>
                        <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text style={{textAlign: "center"}}>🗓️ ({eventDate})</Text>
                            <Text style={{textAlign: "center"}}>🌐 ({timeZone})</Text>
                        </View>
                    { (new Date(eventDate).toISOString().slice(0, 10))
                        < (new Date().toISOString().slice(0, 10)) ?
                        <Text
                            style={{ opacity: eventDate === todaysDate ? 0 : 100, height: 0}}
                            onPress={() => goToNextEvent()}
                        >{"►"}</Text>
                        : <Text style={{height: 0}}>{""}</Text>
                    }
                    </View>

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
