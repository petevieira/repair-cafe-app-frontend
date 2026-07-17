import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, DataTable, FAB, Tooltip } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import styles from 'globals/Styles'
import { getRepairsByEvent } from 'requests/repair-requests';
import Repair from 'models/Repair';
import { useAuth } from 'contexts/auth-context';
import { NavigationProp } from 'globals/RootNavigation';
import appColors from 'globals/colors';
import EventHeader from 'globals/EventHeader';
import { Response, RepairsData } from 'types/Response';

const getStatusRank = (status: string): number => {
    if (status === "In Queue") {
        return 0;
    }
    if (status === "In Progress") {
        return 1;
    }
    return 2;
};

const compareRepairsForQueue = (a: Repair, b: Repair): number => {
    const rankDiff = getStatusRank(a.repairStatus) - getStatusRank(b.repairStatus);
    if (rankDiff !== 0) {
        return rankDiff;
    }

    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (aCreated !== bCreated) {
        return aCreated - bCreated;
    }

    return (a._id || "").localeCompare(b._id || "");
};

const compareByIntakeOrder = (a: Repair, b: Repair): number => {
    const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (aCreated !== bCreated) {
        return aCreated - bCreated;
    }
    return (a._id || "").localeCompare(b._id || "");
};

const buildIntakeOrderById = (repairs: Repair[]): Record<string, number> => {
    const byIntake = [...repairs].sort(compareByIntakeOrder);
    return Object.fromEntries(byIntake.map((repair, idx) => [repair._id, idx + 1]));
};

const getRepairRowColor = (status: string): string => {
    if (status === "In Progress") {
        return appColors.bgAmber;
    }
    if (status === "In Queue") {
        return appColors.bgGray;
    }
    return appColors.bgGreen;
};

/**
 * Repairs component
 * Displays a table of the repairs for the current event.
 * @returns The component view
 */
const Repairs = () => {
    const [repairs, setRepairs] = useState([]);
    const [intakeOrderById, setIntakeOrderById] = useState<Record<string, number>>({});
    const {
        isLoggedIn,
        setShowLoader,
        setSnackbarMsg,
        appEvent,
    } = useAuth();
    const [repairsRetrieved, setRepairsRetrieved] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    /**
     * Get the repairs for the current event and set the state
     * @returns Promise<void>
     */
    const getRepairs = async (): Promise<void> => {
        if (!appEvent) {
            return;
        }
        try {
            setShowLoader(true);
            const res: Response<RepairsData> = await getRepairsByEvent(appEvent._id);
            const resRepairs = res.data.repairs;
            if (resRepairs.length <= 0) {
                setRepairs([]);
                setIntakeOrderById({});
                return;
            }
            setIntakeOrderById(buildIntakeOrderById(resRepairs));
            // In Queue, then In Progress, then finished — FIFO by createdAt within each group.
            resRepairs.sort(compareRepairsForQueue);
            setRepairs(resRepairs);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        } finally {
            setShowLoader(false);
        }
        setRepairsRetrieved(true);
    }

    /**
     * Navigate to the Add/Edit Repair screen
     */
    const addRepairPressed = (): void => {
        navigation.navigate('Add/Edit Repair', {
            repair: new Repair()
        });
    }

    /**
     * Navigate to the Add/Edit Repair screen
     * @param {Repair} repair - the repair to edit
     */
    const repairPressed = (repair: Repair): void => {
        if (!isLoggedIn) {
            return;
        }
        navigation.navigate('Add/Edit Repair', {
            repair: repair
        });
    }

    /**
     * Get the repairs for the current event when the screen is focused
     * and when the appEvent changes.
     */
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
                            <DataTable.Title style={{flex: 1}}>
                                <Tooltip title="Follow-up repair">
                                    <Text>{"\u21A9"}</Text>
                                </Tooltip>
                            </DataTable.Title>
                            <DataTable.Title style={{flex: 1}}>#</DataTable.Title>
                            <DataTable.Title style={{flex: 3}}>Item</DataTable.Title>
                            <DataTable.Title style={{flex: 4}}>Owner</DataTable.Title>
                            <DataTable.Title style={{flex: 3}}>Repairer</DataTable.Title>
                            <DataTable.Title style={{flex: 4}}>Status</DataTable.Title>
                        </DataTable.Header>

                    {repairs.map((repair) => (
                        <DataTable.Row
                            key={repair._id}
                            onPress={isLoggedIn ? (() => repairPressed(repair)) : undefined}
                            style={{backgroundColor: getRepairRowColor(repair.repairStatus)}}
                        >
                            <DataTable.Cell style={{flex: 1}}>
                                {repair.isFollowUpRepair ? (
                                    <Tooltip title="Follow-up repair">
                                        <Text>{"\u21A9"}</Text>
                                    </Tooltip>
                                ) : (""
                                )}
                            </DataTable.Cell>
                            <DataTable.Cell style={{flex: 1}}>
                                {intakeOrderById[repair._id] ?? ""}
                            </DataTable.Cell>
                            <DataTable.Cell style={{flex: 3}}>
                                <Text style={{flex: 1, flexWrap: 'wrap'}} numberOfLines={0}>
                                    {repair.product}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>
                                <Text>
                                    {repair.ownersFirstName} {repair.ownersLastName
                                        ? repair.ownersLastName.charAt(0).toUpperCase() + "." : ""}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={{flex: 3}}>
                                <Text>
                                    {repair.repairerFirstName} {repair.repairerLastName
                                        ? repair.repairerLastName.charAt(0).toUpperCase() + "." : ""}
                                </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={{flex: 4}}>
                                {repair.repairStatus}
                            </DataTable.Cell>
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
