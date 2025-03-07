import { useEffect, useState } from 'react';
import { navigationRef } from './navigation-ref';
import { useAuth } from 'contexts/auth-context';
import { View } from 'react-native';
import { ActivityIndicator, Portal, Snackbar, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import ScreensNav from 'globals/ScreensNav';
import BottomTabs from 'globals/BottomTabs';
import Loader from 'globals/Loader';
import styles from 'globals/Styles';
import Nav from 'globals/Nav';
import Repair from 'models/Repair';
import Volunteer from 'models/Volunteer';
import RepairEvent from 'models/RepairEvent';
import RootRequests from 'requests/root-requests';

// Define the type for your app's screen names and params
export type RootStackParamList = {
    "Home": undefined;
    "Volunteer Login": undefined;
    "Repairs": undefined;
    "Add/Edit Repair": { repair: Repair };
    "Volunteers": undefined;
    "Add/Edit Volunteer": { volunteer: Volunteer };
    "Events": undefined;
    "Add/Edit Event": { event: Omit<RepairEvent, 'date'> & { date: string | null } };
    "About": undefined;
};

// Type for navigation prop
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Type for route prop
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

const TIME_BEFORE_WARMING_UP_MSG_MS = 3000;
const TIME_BEFORE_SECOND_MSG_MS = 10000;
const TIME_BEFORE_THIRD_MSG_MS = 20000;
const TIME_BEFORE_FOURTH_MSG_MS = 30000;

/**
 * A component that wraps the ScreensNav stack navigator in an
 * Authentication provider (which gives the ScreensNav access to the
 * AuthProvider's context, which includes whether the user is authenticated)
 * which is wrapped in a NavigationContainer
 */
const RootNavigation = () => {
    const {
        snackbarMsg, setSnackbarMsg,
    } = useAuth();
    const [routeName, setRouteName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSlow, setIsSlow] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [loadingSubMsg, setLoadingSubMsg] = useState("");

    useEffect(() => {
        const warmUpServer = async (): Promise<void> => {
            setIsSlow(false);

            // After N seconds, show a message that the server is slow
            const firstTimeout = setTimeout(() => {
                setLoadingMsg("Waking up the server...");
                setIsSlow(true)
            }, TIME_BEFORE_WARMING_UP_MSG_MS);

            // After M seconds, show a message that the server is taking too long
            const secondTimeout = setTimeout(() => {
                setLoadingSubMsg("Checking for blown fuses...");
            }, TIME_BEFORE_SECOND_MSG_MS);

            const thirdTimeout = setTimeout(() => {
                setLoadingSubMsg("Verifying connections...");
            }, TIME_BEFORE_THIRD_MSG_MS);

            const fourthTimeout = setTimeout(() => {
                setLoadingSubMsg("Running final tests...");
            }, TIME_BEFORE_FOURTH_MSG_MS);

            try {
                await RootRequests.checkServerHealth();
            } catch (error) {
                console.error(error);
                setSnackbarMsg(error.message);
            } finally {
                clearTimeout(firstTimeout);
                clearTimeout(secondTimeout);
                clearTimeout(thirdTimeout);
                clearTimeout(fourthTimeout);
                setIsLoading(false);
            }
        }

        warmUpServer();
    }, []);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        const updateRouteName = () => {
            const currentRoute = navigationRef.getCurrentRoute();
            if (currentRoute) {
                setRouteName(currentRoute.name);
            }
        }

        const unsubscribe = navigationRef.addListener('state', updateRouteName);

        return () => {
            unsubscribe();
        };
    }, [isLoading]);

    // Show a loading spinner while the server is starting up
    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator
                    size="large"
                    animating={isLoading}
                />
                {isSlow &&
                <>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: 20
                        }}
                    >
                        {loadingMsg}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "normal",
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >
                        {loadingSubMsg}
                    </Text>
                </>
                }
            </View>
        );
    }

    // Normal app rendering
    return (
        <>
            <Nav routeName={routeName}/>
            <ScreensNav/>
            <BottomTabs routeName={routeName}/>
            <Loader/>
            <Portal>
                <Snackbar
                    duration={5000}
                    style={styles.snackbar}
                    visible={!!snackbarMsg}
                    onDismiss={() => {
                        setSnackbarMsg("");
                    }}
                    action={{
                        label: "Close"
                    }}
                    >{snackbarMsg}
                </Snackbar>
            </Portal>
        </>
    );
}

export default RootNavigation;
