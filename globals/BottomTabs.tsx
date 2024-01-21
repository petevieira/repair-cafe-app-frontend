
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { Divider } from "react-native-elements";
import { AuthContext } from '../contexts/auth-context';

export const Tab = ({ name, text, handlePress, screenName, routeName }) => {
  const activeScreenColor = screenName === routeName && "orange";

  return (
    <TouchableOpacity onPress={handlePress}>
      <FontAwesome5
        name={name}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",
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
  const authenticated = !!state && state.token !== '' && state.user !== null;
  const navigation = useNavigation();
  // const route = useRoute();
  let authTab;

  if (authenticated) {
  }

  return (
    <>
      {/*<Divider width={1} />*/}
      <View
        style={{
          flexDirection: "row",
          margin: 10,
          marginHorizontal: 300,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Tab
          text="Repairs"
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