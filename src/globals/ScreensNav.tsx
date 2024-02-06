import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from '../contexts/auth-context';
import AddEditRepair from '../components/repairs/AddEditRepair';
import Repairs from '../components/repairs/Repairs';
import AddEditVolunteer from '../components/volunteers/AddEditVolunteer';
import Volunteers from '../components/volunteers/Volunteers';
import Login from '../components/login/Login';
import About from '../components/About';
import Nav from '../globals/Nav';

// Instantiate a stack navigator
const Stack = createNativeStackNavigator();

/**
 * ScreensNav component that provides authenticated and unauthenticated
 * screens that the user can navigate between.
 * @returns a stack navigator with screens that are only accessible
 * if the user is authenticated.
 */
const ScreensNav = (props) => {
  // Add state from AuthContext
  const [state, setState] = React.useContext(AuthContext);

  // Set whether the user is authenticated from the AuthContext state
  let authenticated = !!state && state.token !== '' && state.user !== null;

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        header: (props) => <Nav {...props} />,
      }}
    >
      {authenticated ? (
        </* Screens that require authentication */>
          <Stack.Screen
            style={{marginBottom: 20}}
            name="Repairs"
            component={Repairs}
          />
          <Stack.Screen
            name="Volunteers"
            component={Volunteers}
          />
          <Stack.Screen
            style={{marginBottom: 20}}
            name="Add/Edit Repair"
            component={AddEditRepair}
          />
          <Stack.Screen
            name="Add/Edit Volunteer"
            component={AddEditVolunteer}
          />
          <Stack.Screen
            name="About"
            component={About}
          />
          <Stack.Screen
            name="Volunteer Login"
            component={Login}
          />
        </>
      ) : (
        </* Screens that don't require authentication */>
          <Stack.Screen
            name="Volunteer Login"
            component={Login}
          />
          <Stack.Screen
            name="Repairs"
            component={Repairs}
          />
          <Stack.Screen
            name="Volunteers"
            component={Volunteers}
          />
          <Stack.Screen
            name="About"
            component={About}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default ScreensNav;