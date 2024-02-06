import { configureFonts, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { View } from 'react-native';
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
    <PaperProvider theme ={{
      ...MD3LightTheme,
      mode: 'adaptive',
      colors: appColors,
      fonts: configureFonts({config: appFontConfig})
    }}>
      <AuthProvider>
        <RootNavigation/>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
