import { Provider, configureFonts, MD2LightTheme, Text, ActivityIndicator, Portal } from 'react-native-paper';
import { View } from 'react-native';

// Custom Components
import appFontConfig from './globals/fonts';
import appColors from './globals/colors';
import RootNavigation from './globals/RootNavigation';

/**
 * Main application
 */
const App = () => {
  console.debug("Loading App");
  return (
    <Provider theme ={{
      ...MD2LightTheme,
      colors: appColors,
      fonts: configureFonts({config: appFontConfig, isV3: false})
    }}>
      <RootNavigation/>
    </Provider>
  );
};

export default App;
