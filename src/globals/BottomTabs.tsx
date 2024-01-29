import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Divider } from "react-native-elements";
import { AuthContext } from '../contexts/auth-context';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import ScreensNav from './ScreensNav';

export const Tab = ({ name, text, handlePress, screenName, routeName }) => {
  const activeScreenColor = screenName === routeName && "black";

  return (
    <TouchableOpacity onPress={handlePress}>
      <FontAwesome5
        name={name}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",
          color: 'black'
        }}
        color={activeScreenColor}
      />
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export default function BottomTabs() {
  // Add state from AuthContext
  const [state, setState] = React.useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;
  const navigation = useNavigation();
  // const route = useRoute();
  let authTab;

  const logOut = async () => {
    try {
      const result = await AsyncStorageHelpers.removeAuth();
      if (!result) {
        console.error("Failed to remove auth token");
        return false;
      }
      setState({
        ...state, user: undefined, token: undefined
      });
      authenticated = false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <>
      {/*<Divider width={1} />*/}
      <View
        style={{
          backgroundColor: "#96db73",
          flexDirection: "row",
          paddingTop: 10,
          paddingBottom: 10,
          justifyContent: "space-evenly",
          alignItems: "center"
        }}
      >

          <Tab
            text={authenticated ? "Log Out" : "Home" }
            name={authenticated ? "sign-out-alt" : "home" }
            style={{color: "black"}}
            handlePress={async () => {
              if (authenticated) {
                const success = await logOut();
                if (success) {
                  navigation.navigate("Home");
                }
              } else {
                navigation.navigate("Home")}
              }
            }
            screenName={authenticated ? undefined : "Home" }
            // routeName={route.name}
          />

        <Tab
          text="Queue"
          name="tools"
          handlePress={() => navigation.navigate("Repairs")}
          screenName="Repairs"
          // routeName={route.name}
        />
        <Tab
          text="Volunteers"
          name="users"
          handlePress={() => navigation.navigate("Volunteers")}
          screenName="Volunteers"
          // routeName={route.name}
        />
      </View>
    </>
  );
}