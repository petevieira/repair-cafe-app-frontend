import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styles from 'globals/Styles'
import { useAuth } from 'contexts/auth-context';
import { findPreviousEvent, findNextEvent } from "requests/repair-event-requests";

const EventHeader = ({}) => {
    const {
        appEvent, setAppEvent,
        snackbarMsg, setSnackbarMsg,
        timeZone, setTimeZone,
        showLoader, setShowLoader,
    } = useAuth();

    const todaysDate = new Date().toISOString().split('T')[0];

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

    return (
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
    )
};

export default EventHeader;
