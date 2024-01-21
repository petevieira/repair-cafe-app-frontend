import { Provider, configureFonts, MD2LightTheme } from 'react-native-paper';
// Custom Components
import appFontConfig from './globals/fonts';
import appColors from './globals/colors';
import RootNavigation from './globals/RootNavigation';

/**
 * Main application
 */
const App = () => {
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


