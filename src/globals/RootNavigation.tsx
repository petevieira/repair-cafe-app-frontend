import { useEffect, useState, useRef } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { useAuth } from '../contexts/auth-context';
import { Portal, Snackbar} from 'react-native-paper';

// import { AuthProvider } from '../contexts/auth-context';
import ScreensNav from './ScreensNav';
import BottomTabs from './BottomTabs';
import Loader from './Loader';
import styles from './Styles';
import Nav from './Nav';

/**
 * A component that wraps the ScreensNav stack navigator in an
 * Authentication provider (which gives the ScreensNav access to the
 * AuthProvider's context, which includes whether the user is authenticated)
 * which is wrapped in a NavigationContainer
 */
const RootNavigation = () => {
  const { snackbarMsg, setSnackbarMsg } = useAuth();
  const [routeName, setRouteName] = useState('');
  const navigationRef = createNavigationContainerRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setRouteName(navigationRef.getCurrentRoute().name);
      }}
      onStateChange={async () => {
        const currentRouteName = navigationRef.getCurrentRoute().name;
        setRouteName(currentRouteName);
      }}
    >
      <Nav routeName={routeName}/>
{/*      <ScrollView
        contentContainerStyle={styles.topScrollView}
        style={{backgroundColor: '#f2f2f2'}}
      >*/}
        <ScreensNav/>
      {/*</ScrollView>*/}
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
    </NavigationContainer>
  );
}

export default RootNavigation;
