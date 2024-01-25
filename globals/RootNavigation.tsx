import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, ScrollView } from 'react-native';
import { Portal, ActivityIndicator } from 'react-native-paper';

import { AuthProvider } from '../contexts/auth-context';
import ScreensNav from './ScreensNav';
import BottomTabs from './BottomTabs';
import Loader from './Loader';
import Nav from "./Nav"
import styles from './Styles'


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
        <StatusBar style = "auto" />
        <Nav/>
        <ScrollView
          contentContainerStyle={styles.content}>
          <ScreensNav/>
        </ScrollView>
        <BottomTabs/>
        <Loader/>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default RootNavigation;
