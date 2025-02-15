import { useState, useEffect } from 'react';
import { View, Pressable, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { NavigationState } from 'react-navigation';

import styles from 'globals/Styles';
import { useAuth } from 'contexts/auth-context';

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
          borderRadius: 20,
          marginBottom: 3,
          alignSelf: "center",
          color: 'black',
          backgroundColor: isActiveScreen ? '#80b963' : 'rgba(0,0,0,0)',
          paddingVertical: 5,
          paddingHorizontal: 15,
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
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigation = useNavigation();
  let routeName = props.routeName;

  useEffect(() => {
    console.debug("isLoggedIn: ", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <View
        style={{
          backgroundColor: "#96db73",
          flexDirection: "row",
          justifyContent: "space-evenly",
          height: 70,
          alignItems: "center",
        }}
      >
        { !isLoggedIn &&
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
        }
        { isLoggedIn &&
          <Tab
            text="Repairs"
            name="tools"
            style={styles.bottomTab}
            handlePress={() => navigation.navigate("Repairs")}
            screenName="Repairs"
            routeName={routeName}
          />
        }
        { isLoggedIn &&
          <Tab
            text="Volunteers"
            name="users"
            style={styles.bottomTab}
            handlePress={() => navigation.navigate("Volunteers")}
            screenName="Volunteers"
            routeName={routeName}
          />
        }
      </View>
    </>
  );
}