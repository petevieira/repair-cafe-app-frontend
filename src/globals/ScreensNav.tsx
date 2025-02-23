import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from 'contexts/auth-context';

import Login from 'components/login/Login';
import Repairs from 'components/repairs/Repairs';
import AddEditRepair from 'components/repairs/AddEditRepair';
import Volunteers from 'components/volunteers/Volunteers';
import AddEditVolunteer from 'components/volunteers/AddEditVolunteer';
import About from 'components/About';
import Events from 'components/events/Events';
import AddEditEvent from 'components/events/AddEditEvent';

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
    const { isLoggedIn } = useAuth();

    return (
        <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
            headerShown: false
        }}
        >
            {isLoggedIn ? (
                </* Screens that require authentication */>
                    <Stack.Screen
                        name="Repairs"
                        component={Repairs}
                    />
                    <Stack.Screen
                        name="Volunteers"
                        component={Volunteers}
                    />
                    <Stack.Screen
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
                    <Stack.Screen
                        name="Events"
                        component={Events}
                    />
                    <Stack.Screen
                        name="Add/Edit Event"
                        component={AddEditEvent}
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