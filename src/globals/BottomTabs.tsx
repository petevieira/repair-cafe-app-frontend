import { useState, useEffect, useContext } from 'react';
import { View, Pressable, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/auth-context';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import ScreensNav from './ScreensNav';
import { NavigationState } from 'react-navigation';
import styles from './Styles';

export const Tab = ({ name, text, handlePress, screenName, routeName }) => {
  let isActiveScreen = screenName === routeName;
  return (
    <Pressable
      onPress={handlePress}
      style={{alignText: 'center'}}
    >
      <FontAwesome5
        name={name}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",
          color: 'black',
          backgroundColor: isActiveScreen ? '#80b963' : 'rgba(0,0,0,0)',
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderRadius: 20
        }}
      />
      <Text
        style={{
          fontWeight: isActiveScreen ? 'bold' : 'normal',
          alignSelf: 'center'
        }}
      >{text}</Text>
    </Pressable>
  );
};

export default function BottomTabs(props) {
  // Add state from AuthContext
  const [state, setState] = useContext(AuthContext);
  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;
  const navigation = useNavigation();
  let authTab;
  let routeName = props.routeName;

  const logOut = async () => {
    try {
      const result = await AsyncStorageHelpers.removeAuth();
      if (!result) {
        console.info("Failed to remove auth token");
        return false;
      }
      setState({
        ...state, user: undefined, token: undefined
      });
      authenticated = false;
      return true;
    } catch (error) {
      console.info(error);
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
        alignItems: "center",
      }}
    >
      { !authenticated ?
        <Tab
          text={"Login"}
          name={"sign-in-alt"}
          style={styles.bottomTab}
          handlePress={async () => {
            navigation.navigate("Volunteer Login")}
          }
          routeName={routeName}
          screenName={"Volunteer Login"}
        />
        : <></>
      }
      <Tab
        text="Queue"
        name="tools"
        style={styles.bottomTab}
        handlePress={() => navigation.navigate("Repairs")}
        screenName="Repairs"
        routeName={routeName}
      />
      <Tab
        text="Volunteers"
        name="users"
        style={styles.bottomTab}
        handlePress={() => navigation.navigate("Volunteers")}
        screenName="Volunteers"
        routeName={routeName}
      />
    </View>
    </SafeAreaView>
  );
}