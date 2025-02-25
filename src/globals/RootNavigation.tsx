import { useEffect, useState, useRef } from 'react';
import { navigationRef } from './navigation-ref';
import { useAuth } from 'contexts/auth-context';
import { Portal, Snackbar} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import ScreensNav from 'globals/ScreensNav';
import BottomTabs from 'globals/BottomTabs';
import Loader from 'globals/Loader';
import styles from 'globals/Styles';
import Nav from 'globals/Nav';
import Item from 'models/Item';
import Volunteer from 'models/Volunteer';
import { Event as RepairEvent } from 'models/Event';

// Define the type for your app's screen names and params
export type RootStackParamList = {
    "Home": undefined;
    "Repairs": undefined;
    "Add/Edit Repair": { item: Item };
    "Volunteer Login": undefined;
    "Add/Edit Volunteer": { volunteer: Volunteer };
    "About": undefined;
    "Events": undefined;
    "Add/Edit Event": { event: Omit<RepairEvent, 'date'> & { date: string | null } };
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
    const { snackbarMsg, setSnackbarMsg } = useAuth();
    const [routeName, setRouteName] = useState('');

    useEffect(() => {
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
    }, []);

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
