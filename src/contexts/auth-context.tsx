import React from "react";
// import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import AsyncStorage from "../globals/async-storage-helpers";
import { StorageConsts } from '../consts/app.consts';

// Create a Context object.
// When React renders a component that subscribes to this Context object it
// will read the current context value from the closest matching Provider
// above it in the tree.
const AuthContext = React.createContext();

// Provider that pairs with context, allowing consuming components to
// subscribe to context changes.
const AuthProvider = ({ children }) => {
  const [state, setState] = React.useState({
    user: null,
    token: '',
    showLoader: false
  });

  // Get the navigation property  of the screen this provider is inside,
  // so that the AuthProvider can navigate to other screens.
  // const navigation = useNavigation();

  // Configure axios
  const token = state?.token ? state.token : '';
  axios.defaults.baseURL = '';
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Handle expired token or 401 Unauthorized error
  axios.interceptors.response.use(
    async function (response) {
      // If response is valid, return it to final destination
      return response;
    },
    async function (error) {
      if (typeof error.response === 'undefined') {
        alert('A network error occurred. '
          + 'This could be a CORS issue or a dropped internet connection. '
          + 'It is not possible for us to know.')
      } else {
        // If there's an error, remove the auth if unauthorized
        // and return to the sign-in page.
        let res = error.response;
        if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
          await AsyncStorage.storeAuth('');
          setState({ ...state, user: null, token: '' });
          // navigation.navigate('Email');
        }
      }
    }
  );

  // Retrieve auth from storage on first render
  React.useEffect(() => {
    // Retrieve the auth token from AsyncStorage
    const loadFromAsyncStorage = async () => {
      try {
        let data = await AsyncStorage.getAuth();
        if (!data) {
          return;
        }
        setState({ ...state, user: data.user, token: data.token });
      } catch (err) {
        console.error(err);
      }
    };
    loadFromAsyncStorage();
  }, []);

  // Return the auth context provider
  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };