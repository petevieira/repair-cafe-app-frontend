import * as React from 'react';
import { View, SafeAreaView, Platform, StatusBar, ScrollView } from 'react-native';
import {
  Button,
  Divider,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
  Text,
  BottomNavigation,
  configureFonts,
  MD2LightTheme
} from 'react-native-paper';
// Custom Components
import ResponsiveButton from "./globals/ResponsiveButton"
import Nav from "./globals/Nav"
// Styles
import styles from './globals/Styles'
// Screens
import Home from './components/Home'
import EmailEntry from './components/login/01_Email'
import CreatePassword from './components/login/02_CreatePassword'
import UserAgreement  from './components/login/03_UserAgreement'
import AccountSuccess from './components/login/04_AccountSuccess'
import EnterPassword from './components/login/05_EnterPassword'
import MyItems from './components/myItems/01_MyItems'

const HomeRoute2 = () => {
  return(
    <Home></Home>
  );
};

const HomeRoute = () => {
  return(
    <MyItems></MyItems>
  );
};


const _fontConfig = {
  regular: {
    fontFamily: 'Futura',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Futura',
    fontWeight: 'normal',
  },
  light: {
    fontFamily: 'Futura',
    fontWeight: 'normal',
  },
  thin: {
    fontFamily: 'Futura',
    fontWeight: 'normal',
  },
};

const fontConfig = {
    ios: _fontConfig,
    android: _fontConfig,
    web: _fontConfig,
};

const _colors = {
  ...MD2LightTheme.colors,
  primary: '#565656',
};

const MyItemsRoute = () => <Text>My Items</Text>;
const QueueRoute = () => <Text>Repair Queue</Text>;

const App = () => {

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home-variant', unfocusedIcon: 'home-variant-outline'},
    { key: 'myitems', title: 'My Items', focusedIcon: 'wrench', unfocusedIcon: 'wrench-outline' },
    { key: 'queue', title: 'Repair Queue', focusedIcon: 'view-dashboard-variant', unfocusedIcon: 'view-dashboard-variant-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    myitems: MyItemsRoute,
    queue: QueueRoute,
  });

  return (
    <Provider theme ={{...MD2LightTheme, colors:_colors, fonts: configureFonts({config: fontConfig, isV3: false})}}>
      <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
    </Provider>
  );
};

export default App;


