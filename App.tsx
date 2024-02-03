import { Provider, configureFonts, MD3LightTheme } from 'react-native-paper';
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

// Custom Components
import appFontConfig from './src/globals/fonts';
import appColors from './src/globals/colors';
import RootNavigation from './src/globals/RootNavigation';

/**
 * Main application
 */
const App = () => {
  console.debug("Loading App...");
  return (
    <PaperProvider theme ={{
      ...MD3LightTheme,
      mode: 'adaptive',
      colors: appColors,
      fonts: configureFonts({config: appFontConfig})
    }}>
      <RootNavigation/>
    </PaperProvider>
  );
};

export default App;
