import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from 'contexts/auth-context';
import { findPreviousEvent, findNextEvent } from "requests/repair-event-requests";
import AsyncStorageHelpers from 'globals/async-storage-helpers';
import { eventInThePast } from "lib/helpers";

const EventHeader = () => {
    const {
        appEvent, setAppEvent,
        setSnackbarMsg,
        timeZone,
        isAdmin,
        isLoggedIn,
    } = useAuth();
    const [canNavigateToPreviousEvent, setCanNavigateToPreviousEvent] = useState(false);
    const [canNavigateToNextEvent, setCanNavigateToNextEvent] = useState(false);

    const goToPreviousEvent = async () => {
        try {
            const previousEvent = await findPreviousEvent(appEvent);
            setAppEvent(previousEvent);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        }
    }

    const goToNextEvent = async () => {
        try {
            const nextEvent = await findNextEvent(appEvent);
            setAppEvent(nextEvent);
        } catch (error) {
            console.error(error);
            setSnackbarMsg(error.message);
        }
    }

    const checkIfPreviousEventsExist = async () => {
        try {
            const token = await AsyncStorageHelpers.getAuth();
            if (!token) {
                setCanNavigateToNextEvent(false);
                return;
            }
        } catch (error) {
            setCanNavigateToNextEvent(false);
            return;
        }

        if (!appEvent?.date || !isLoggedIn) {
            setCanNavigateToPreviousEvent(false);
            return;
        }

        try {
            const previousEvent = await findPreviousEvent(appEvent);
            setCanNavigateToPreviousEvent(previousEvent !== null);
        } catch (error) {
            setCanNavigateToPreviousEvent(false);
        }
    }

    const checkIfCanNavigateToNextEvent = async () => {
        try {
            const token = await AsyncStorageHelpers.getAuth();
            if (!token) {
                setCanNavigateToNextEvent(false);
                return;
            }
        } catch (error) {
            setCanNavigateToNextEvent(false);
            return;
        }

        if (!appEvent?.date || !isLoggedIn) {
            setCanNavigateToNextEvent(false);
            return false;
        }

        let nextEventExists = false;

        try {
            const nextEvent = await findNextEvent(appEvent);
            nextEventExists = nextEvent !== null;
        } catch (error) {
            nextEventExists = false;
        }

        if (!nextEventExists) {
            setCanNavigateToNextEvent(false);
            return;
        }

        setCanNavigateToNextEvent(eventInThePast(appEvent) || isAdmin);
    }

    useEffect(() => {
        checkIfPreviousEventsExist();
        checkIfCanNavigateToNextEvent();
    }, [appEvent, isLoggedIn]);

    return (
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            { canNavigateToPreviousEvent ? <Text
                selectable={false}
                style={{}}
                onPress={() => goToPreviousEvent()}
            >{"◄"}</Text>
            : <Text
                selectable={false}
                style={{height: 0}}>{""}</Text>
            }
            <View style={{flexDirection: "column", alignItems: "center"}}>
                { appEvent?.date &&
                    <Text
                        selectable={false}
                        style={{textAlign: "center"}}>Event Date: ({(new Date(appEvent.date)).toISOString().split('T')[0]})</Text>
                }
                <Text
                    selectable={false}
                    style={{textAlign: "center"}}>🌐 ({timeZone})</Text>
            </View>
        { canNavigateToNextEvent ?
            <Text
                selectable={false}
                onPress={() => goToNextEvent()}
            >{"►"}</Text>
            : <Text
                selectable={false}
                style={{height: 0}}>{""}</Text>
        }
        </View>
    )
};

export default EventHeader;
