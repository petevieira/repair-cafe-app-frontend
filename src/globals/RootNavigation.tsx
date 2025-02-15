import { useEffect, useState, useRef } from 'react';
import { navigationRef } from './navigation-ref';
import { ScrollView, View } from 'react-native';
import { useAuth } from 'contexts/auth-context';
import { Portal, Snackbar} from 'react-native-paper';

// import { AuthProvider } from '../contexts/auth-context';
import ScreensNav from 'globals/ScreensNav';
import BottomTabs from 'globals/BottomTabs';
import Loader from 'globals/Loader';
import styles from 'globals/Styles';
import Nav from 'globals/Nav';

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
        duration={2000}
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
