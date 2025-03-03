import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styles from 'globals/Styles'
import { useAuth } from 'contexts/auth-context';

const EventHeader = ({}) => {
    const {
        appEvent, setAppEvent,
        snackbarMsg, setSnackbarMsg,
        timeZone, setTimeZone,
        showLoader, setShowLoader,
    } = useAuth();

    const todaysDate = new Date().toISOString().split('T')[0];

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
