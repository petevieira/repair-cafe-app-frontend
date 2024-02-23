import { configureFonts, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { View, Platform, StatusBar, SafeAreaView } from 'react-native';
import { AuthProvider } from './src/contexts/auth-context';

// Custom Components
import appFontConfig from './src/globals/fonts';
import appColors from './src/globals/colors';
import RootNavigation from './src/globals/RootNavigation';

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
        fonts: configureFonts({config: appFontConfig})
      }}
    >
      <StatusBar hidden/>
      <AuthProvider>
        <SafeAreaView style={{flex: 0, backgroundColor: 'white'}}/>
        <SafeAreaView style={{flex: 1, backgroundColor: '#96db73'}}>
          <RootNavigation/>
        </SafeAreaView>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
