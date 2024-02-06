import { NavigationContainer } from '@react-navigation/native';
import { ScrollView } from 'react-native';

import { AuthProvider } from '../contexts/auth-context';
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
  return (
    <NavigationContainer>
      <AuthProvider>
        <ScreensNav/>
        <BottomTabs/>
        <Loader/>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default RootNavigation;
