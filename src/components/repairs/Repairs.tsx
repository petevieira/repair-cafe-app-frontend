import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from 'globals/Styles'
import { getRepairsByEvent } from 'requests/repair-requests';
import Repair from 'models/Repair';
import { useAuth } from 'contexts/auth-context';
import { NavigationProp } from 'globals/RootNavigation';
import appColors from 'globals/colors';
import EventHeader from 'globals/EventHeader';

const Repairs = () => {
    const [repairs, setRepairs] = useState([]);
    const {
        isLoggedIn,
        setShowLoader,
        setSnackbarMsg,
        appEvent,
    } = useAuth();
    const [repairsRetrieved, setRepairsRetrieved] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const getRepairs = async () => {
        try {
            setShowLoader(true);
            const tempRepairs = await getRepairsByEvent(appEvent._id);
            // Sort with follow-up repairs first, the In Queue progress, then In Progress, then the rest.
            tempRepairs.sort((a: Repair, b: Repair) => {
                if (a.isFollowUpRepair && !b.isFollowUpRepair) {
                    return -1;
                }
                if (!a.isFollowUpRepair && b.isFollowUpRepair) {
                    return 1;
                }
                if (a.repairStatus === "In Queue" && b.repairStatus !== "In Queue") {
                    return -1;
                }
                if (a.repairStatus !== "In Queue" && b.repairStatus === "In Queue") {
                    return 1;
                }
                if (a.repairStatus === "In Progress" && b.repairStatus !== "In Progress") {
                    return -1;
                }
                if (a.repairStatus !== "In Progress" && b.repairStatus === "In Progress") {
                    return 1;
                }
                if (a.repairStatus === "Repairable" && b.repairStatus !== "Repairable") {
                    return -1;
                }
                if (a.repairStatus !== "Repairable" && b.repairStatus === "Repairable") {
                    return 1;
                }
                if (a.repairStatus === "End of life" && b.repairStatus !== "End of life") {
                    return -1;
                }
                if (a.repairStatus !== "End of life" && b.repairStatus === "End of life") {
                    return 1;
                }
                if (a.repairStatus === "Unknown" && b.repairStatus !== "Unknown") {
                    return -1;
                }
                if (a.repairStatus !== "Unknown" && b.repairStatus === "Unknown") {
                    return 1;
                }
                return 0;
            });
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

    useFocusEffect(
        useCallback(() => {
            getRepairs();
        },[appEvent])
    );

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.topScrollView}
                style={{backgroundColor: appColors.bgGray}}
            >
                <View style={styles.content}>
                    <EventHeader/>
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
                            <DataTable.Cell style={{flex: 4}}>{repair.ownersFirstName} {repair.ownersLastName ? repair.ownersLastName.charAt(0).toUpperCase() : ""}</DataTable.Cell>
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
