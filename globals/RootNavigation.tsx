import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../contexts/auth-context';
import { StatusBar } from 'react-native';
import ScreensNav from '../globals/ScreensNav';
import BottomTabs from '../globals/BottomTabs';
import Nav from "./Nav"

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
        <ScreensNav/>
        <BottomTabs/>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default RootNavigation;
