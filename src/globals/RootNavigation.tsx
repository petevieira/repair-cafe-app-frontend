import { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { AuthContext } from '../contexts/auth-context';
import { Portal, Snackbar} from 'react-native-paper';

// import { AuthProvider } from '../contexts/auth-context';
import ScreensNav from './ScreensNav';
import BottomTabs from './BottomTabs';
import Loader from './Loader';
import styles from './Styles';

/**
 * A component that wraps the ScreensNav stack navigator in an
 * Authentication provider (which gives the ScreensNav access to the
 * AuthProvider's context, which includes whether the user is authenticated)
 * which is wrapped in a NavigationContainer
 */
const RootNavigation = () => {
  const [state, setState] = useContext(AuthContext);

  return (
    <NavigationContainer>
      <ScreensNav/>
      <BottomTabs/>
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
            label: "close"
          }}
        >{state.snackbarMsg}
        </Snackbar>
      </Portal>
    </NavigationContainer>
  );
}

export default RootNavigation;
