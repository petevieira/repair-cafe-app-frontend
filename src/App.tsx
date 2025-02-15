import { configureFonts, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { View, Platform, StatusBar, SafeAreaView } from 'react-native';
import { AuthProvider } from 'contexts/auth-context';
import { navigationRef } from 'globals/navigation-ref';

// Custom Components
import appFontConfig from 'globals/fonts';
import appColors from 'globals/colors';
import RootNavigation from 'globals/RootNavigation';
import { NavigationContainer } from '@react-navigation/native';

/**
 * Main application
 */
const App = () => {
    return (
        <PaperProvider
        theme ={{
            ...MD3LightTheme,
            mode: 'adaptive',
            colors: appColors,
            fonts: configureFonts({config: appFontConfig}),
        }}
        >
        <StatusBar hidden/>
        <AuthProvider>
        <NavigationContainer ref={navigationRef}>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}}/>
        <SafeAreaView style={{flex: 1, backgroundColor: '#96db73'}}>
        <RootNavigation/>
        </SafeAreaView>
        </NavigationContainer>
        </AuthProvider>
        </PaperProvider>
    );
};

export default App;
