import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import AsyncStorage from "globals/async-storage-helpers";
import jwt_decode, { jwtDecode } from "jwt-decode";
import { navigate } from "globals/navigation-ref";

// Track the Axios Interceptor ID globally
let globalInterceptor: number;

// Create a Context object.
// When React renders a component that subscribes to this Context object it
// will read the current context value from the closest matching Provider
// above it in the tree.
const AuthContext = createContext({
    authToken: null,
    setAuthToken: (token: string) => { authToken: token },
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => { isLoggedIn: isLoggedIn },
    showLoader: false,
    setShowLoader: (showLoader: boolean) => { showLoader: showLoader },
    snackbarMsg: '',
    setSnackbarMsg: (msg: string) => { snackbarMsg: msg }
});

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

    useEffect(() => {
        if (!authToken) {
            axios.defaults.headers.common['Authorization'] = '';
        } else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        }
    }, [authToken])

    const configureAxios = () => {
        axios.defaults.baseURL = "";

        // Remove any existing interceptors before adding a new one
        axios.interceptors.request.eject(globalInterceptor);

        // Handle expired token or 401 Unauthorized error
        globalInterceptor = axios.interceptors.response.use(
            async function (response) {
                // If response is valid, return it to final destination
                return response.data;
            },
            async function (error) {
                if (typeof error.response === 'undefined') {
                    return Promise.reject(error);
                }

                // If there's an error, remove the auth if unauthorized
                // and return to the sign-in page.
                let res = error.response;
                if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                    await logOut();
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
        );
        console.debug("Axios configured with ID ", globalInterceptor);
    }

    const tokenIsExpired = (token: string) => {
        if (!token) {
            return true;
        }

        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    }

    // Retrieve the auth token from AsyncStorage
    const loadFromAsyncStorage = async () => {
        console.debug("loadFromAsyncStorage");
        try {
            let data = await AsyncStorage.getAuth();
            if (!data) {
                await logOut();
                return;
            }

            if (tokenIsExpired(data.token)) {
                await logOut();
                return;
            }
            setAuthToken(data.token);
            setIsLoggedIn(true);
        } catch (error) {
            await logOut();
        }
    };

    const logOut = async () => {
        setAuthToken(null);
        setIsLoggedIn(false);
        await AsyncStorage.storeAuth('');
        navigate("Volunteer Login");
    }

    // Retrieve auth from storage on first render
    useEffect(() => {
        configureAxios();
        loadFromAsyncStorage();
    }, []);

    useEffect(() => {
        if (!authToken || (authToken && tokenIsExpired(authToken))) {
            logOut();
        }
    }, [authToken]);

    // Return the auth context provider
    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };