import { useState, useContext } from "react";
import { View, Text, Image, Platform } from "react-native";
import { Appbar, Menu } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import styles from './Styles';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import { AuthContext } from '../contexts/auth-context';

const Nav = ({ navigation, route, options }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [state, setState] = useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;
  const title = getHeaderTitle(options, route.name);
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const aboutPressed = () => {
    closeMenu();
    navigation.navigate('About');
  }

  const logoutPressed = async () => {
    closeMenu();
    setState({...state, showLoader: true});
    try {
      const result = await AsyncStorageHelpers.removeAuth();
      if (!result) {
        console.error("Failed to remove auth token");
      } else {
        setState({...state, user: null, token: '', showLoader: false});
        authenticated = false;
        navigation.navigate('Volunteer Login');
      }
    } catch (error) {
      console.error(error);
      setState({...state, user: null, token: '', showLoader: false});
    }
  }

  return (
    <Appbar.Header
      style={styles.appBar}
      mode="center-aligned"
      elevated={true}
    >
      <Appbar.Action
        icon={"/trc-logo-transparent.png"}
        isLeading={true}
        size={60}
      />
      <Appbar.Content
        title={<Text style={styles.appBarTitle}>{title}</Text>}
        style={{fontSize: 30}}
      />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon={MORE_ICON}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item
          title="About"
          onPress={aboutPressed}
        />
        {authenticated ?
          <Menu.Item
            title="Log out"
            onPress={logoutPressed}
          />
          : <></>
        }
      </Menu>
    </Appbar.Header>
  );
};

export default Nav;
