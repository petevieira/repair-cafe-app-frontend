import { useContext, useEffect, useState, useRef } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { AuthContext } from '../contexts/auth-context';
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
  const [state, setState] = useContext(AuthContext);
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
      <ScrollView
        contentContainerStyle={styles.topScrollView}
        style={{backgroundColor: '#f2f2f2'}}
      >
        <ScreensNav/>
      </ScrollView>
      <BottomTabs routeName={routeName}/>
      <Loader/>
      <Portal>
        <Snackbar
          duration={2000}
          style={styles.snackbar}
          visible={!!state.snackbarMsg}
          onDismiss={() => {
            setState({...state, snackbarMsg: ''});
          }}
          action={{
            label: "Close"
          }}
        >{state.snackbarMsg}
        </Snackbar>
      </Portal>
    </NavigationContainer>
  );
}

export default RootNavigation;
