import React from 'react';
import { View, Pressable, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/auth-context';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import ScreensNav from './ScreensNav';
import { NavigationState } from 'react-navigation';


export const Tab = ({ name, text, handlePress, screenName, routeName }) => {
  const activeScreenColor = screenName === routeName && "black";

  return (
    <Pressable onPress={handlePress}>
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
    </Pressable>
  );
};

export default function BottomTabs() {
  // Add state from AuthContext
  const [state, setState] = React.useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;
  const navigation = useNavigation();
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
    <SafeAreaView
      style={{backgroundColor: "#96db73"}}>
    <View
      style={{
        backgroundColor: "#96db73",
        flexDirection: "row",
        justifyContent: "space-evenly",
        height: 70,
        alignItems: "center"
      }}
    >
      { !authenticated ?
        <Tab
          text={"Login"}
          name={"sign-in-alt"}
          style={{color: "black"}}
          handlePress={async () => {
            navigation.navigate("Volunteer Login")}
          }
          screenName={"Volunteer Login"}
        />
        : <></>
      }

      <Tab
        text="Queue"
        name="tools"
        handlePress={() => navigation.navigate("Repairs")}
        screenName="Repairs"
      />
      <Tab
        text="Volunteers"
        name="users"
        handlePress={() => navigation.navigate("Volunteers")}
        screenName="Volunteers"
      />
    </View>
    </SafeAreaView>
  );
}