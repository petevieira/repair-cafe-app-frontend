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

    useEffect(() => {
        const warmUpServer = async (): Promise<void> => {
            setIsSlow(false);

            // After 3 seconds, show a message that the server is slow
            const timeout = setTimeout(() => setIsSlow(true), 3000);
            const failSafeTimeout = setTimeout(() => {
                console.warn("Server warm-up is taking too long.");
                setIsLoading(false);
                setSnackbarMsg("Server warm-up will take a minute. Please try again in a bit.");
            }, 10000);

            try {
                await RootRequests.checkServerHealth();
            } catch (error) {
                console.error(error);
                setSnackbarMsg(error.message);
            } finally {
                clearTimeout(timeout);
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
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                        }}
                    >
                        {"Waking up the server..."}
                    </Text>}
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
