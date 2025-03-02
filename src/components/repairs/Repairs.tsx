import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format } from "date-fns";

import styles from 'globals/Styles'
import { getRepairsByDate } from 'requests/repair-requests';
import { getMostRecentEvent } from 'requests/repair-event-requests';
import Repair from 'models/Repair';
import { useAuth } from 'contexts/auth-context';
import { NavigationProp } from 'globals/RootNavigation';
import appColors from 'globals/colors';

const Repairs = () => {
    const [repairs, setRepairs] = useState([]);
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg,
        appEvent, setAppEvent,
        timeZone, setTimeZone,
    } = useAuth();
    const [repairsRetrieved, setRepairsRetrieved] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    // Today's date
    const todaysDate = new Date().toISOString().split('T')[0];

    const getRepairs = async (isoDate: string) => {
        console.debug("date: ", isoDate);
        // Convert date string to Date object
        try {
            setShowLoader(true);
            const tempRepairs = await getRepairsByDate(isoDate);
            setRepairs(tempRepairs);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
        setRepairsRetrieved(true);
    }

    const addRepairPressed = () => {
        navigation.navigate('Add/Edit Repair', {
            repair: new Repair()
        });
    }

    const repairPressed = (repair: Repair) => {
        if (!isLoggedIn) {
            return;
        }
        navigation.navigate('Add/Edit Repair', {
            repair: repair
        });
    }

    const goToPreviousEvent = async () => {
        let date = new Date(appEvent.date);
        date = new Date(date.setUTCDate(date.getUTCDate() - 1));
        date.setUTCHours(23, 59, 59, 999);
        const previousDate = await findPreviousEventDate(date.toISOString());
        if (!previousDate) {
            setSnackbarMsg("No previous events");
            return;
        }
        console.debug("Previous event date: ", previousDate);
        setAppEvent({ ...appEvent, date: format(previousDate, "MMMM do, yyyy") });
        getRepairs(previousDate.toISOString());
    }

    const goToNextEvent = async () => {
        if (new Date(appEvent.date).toISOString().slice(0, 10)
            === new Date().toISOString().slice(0, 10)
        ) {
            setSnackbarMsg("Can't go to future events");
            return;
        }

        let date = new Date(appEvent.date);
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        const nextDate = await findNextEventDate(date.toISOString());
        if (!nextDate) {
            setSnackbarMsg("No future events");
            return;
        }
        console.debug("Next event date: ", nextDate);
        setAppEvent({ ...appEvent, date: format(nextDate, "MMMM do, yyyy") });
        getRepairs(nextDate.toISOString());
    }

    useFocusEffect(
        useCallback(() => {
            getRepairs(appEvent.date);
        },[appEvent])
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
                            { appEvent?.date &&
                                <Text style={{textAlign: "center"}}>🗓️ ({(new Date(appEvent.date)).toISOString().split('T')[0]})</Text>
                            }
                            <Text style={{textAlign: "center"}}>🌐 ({timeZone})</Text>
                        </View>
                    { appEvent?.date && (new Date(appEvent.date).toISOString().slice(0, 10))
                        < (new Date().toISOString().slice(0, 10)) ?
                        <Text
                            style={{ opacity: (new Date(appEvent.date)).toISOString().split('T')[0] === todaysDate ? 0 : 100, height: 0}}
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

                    {repairs.map((repair, idx) => (
                        <DataTable.Row
                            key={repair._id}
                            onPress={isLoggedIn ? (() => repairPressed(repair)) : undefined}
                            style={{backgroundColor: ["In Queue", "In Progress"].indexOf(repair.repairStatus) >= 0 ? appColors.bgGray : appColors.bgGreen}}
                        >
                            <DataTable.Cell style={{flex: 1}}>{repair.isFollowUpRepair ? "\u270E" : ""}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 1}}>{idx+1}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 3}}>{repair.product}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>{repair.ownersFirstName} {repair.ownersLastName}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 3}}>{repair.repairerFirstName} {repair.repairerLastName}</DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>{repair.repairStatus}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                    </DataTable>
                { repairsRetrieved && repairs.length <= 0 &&
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
                onPress={addRepairPressed}
                />
            }
        </>
    )
};

export default Repairs;
