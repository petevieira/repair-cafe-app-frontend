import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

import AsyncStorage from "../globals/async-storage-helpers";

// Create a Context object.
// When React renders a component that subscribes to this Context object it
// will read the current context value from the closest matching Provider
// above it in the tree.
const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
}

// Provider that pairs with context, allowing consuming components to
// subscribe to context changes.
const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const value = {
    authToken, setAuthToken,
    isLoggedIn, setIsLoggedIn,
    showLoader, setShowLoader,
    snackbarMsg, setSnackbarMsg
  };

  const configureAxios = () => {
    // Configure axios
    const token = authToken ?? '';
    axios.defaults.baseURL = '';
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Handle expired token or 401 Unauthorized error
    axios.interceptors.response.use(
      async function (response) {
        // If response is valid, return it to final destination
        return response.data;
      },
      async function (error) {
        if (typeof error.response === 'undefined') {
          return Promise.reject(error);
        } else {
          // If there's an error, remove the auth if unauthorized
          // and return to the sign-in page.
          let res = error.response;
          if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
            await AsyncStorage.storeAuth('');
            setAuthToken(null);
            setIsLoggedIn(false);
            navigation.navigate('Volunteer Login');
          } else {
            if (error.response?.data?.msg) {
              return Promise.reject({
                code: error.code,
                name: error.name,
                message: error.response.data.msg,
              });
            } else {
              return Promise.reject(error);
            }
          }
        }
      }
    );
  }

  // Retrieve the auth token from AsyncStorage
  const loadFromAsyncStorage = async () => {
    try {
      let data = await AsyncStorage.getAuth();
      if (!data) {
        return;
      }
      setAuthToken(data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      setAuthToken(null);
      setIsLoggedIn(false);
    }
  };

  // Retrieve auth from storage on first render
  useEffect(() => {
    configureAxios();
    loadFromAsyncStorage();
  }, []);

  // Return the auth context provider
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, useAuth };