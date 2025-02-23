import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import AsyncStorage from "globals/async-storage-helpers";
import { jwtDecode } from "jwt-decode";
import UserRequests from "requests/user-requests";

// Track the Axios Interceptor ID globally
let globalInterceptor: any;
const tokenCheckIntervalMs = 1000 * 5; // 5 seconds

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
    setSnackbarMsg: (msg: string) => { snackbarMsg: msg },
    isAdmin: false,
    setIsAdmin: (isAdmin: boolean) => { isAdmin: isAdmin },
    // Event-related state
    eventDate: "",
    setEventDate: (date: string) => { eventDate: date },
    timeZone: "",
    setTimeZone: (zone: string) => { timeZone: zone },
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
    const [isAdmin, setIsAdmin] = useState(false);

    const [eventDate, setEventDate] = useState("");
    const [timeZone, setTimeZone] = useState("");

    const value = {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg,
        isAdmin, setIsAdmin,
        eventDate, setEventDate,
        timeZone, setTimeZone,
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const data = await AsyncStorage.getAuth();
            if (!data || !data.token || tokenIsExpired(data.token)) {
                if (isLoggedIn) {
                    console.log("Token expired or missing - logging out");
                    logOut();
                }
            }
        }, tokenCheckIntervalMs);

        return () => clearInterval(interval);
    }, [authToken])

    const configureAxios = (token: string) => {
        axios.defaults.baseURL = "";

        // Remove any existing interceptors before adding a new one
        if (globalInterceptor !== null) {
            axios.interceptors.response.eject(globalInterceptor);
        }

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            axios.defaults.headers.common['Authorization'] = '';
        }

        // Handle expired token or 401 Unauthorized error
        globalInterceptor = axios.interceptors.response.use(
            async function (response) {
                // Response is valid. Return it to final destination.
                return response.data;
            },
            async function (error) {
                if (typeof error.response === 'undefined') {
                    return Promise.reject(error);
                }

                // If there's an error, remove the auth if unauthorized
                // and return to the sign-in page.
                let res = error.response;
                if (res.status === 401 && res.config && !res.config?.__isRetryRequest) {
                    console.warn("401 Unauthorized - Logging out user.");
                    // 401 Unauthorized - Log user out.
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
        try {
            let data = await AsyncStorage.getAuth();
            if (!data || !data.token || tokenIsExpired(data.token)) {
                console.log("Token expired or missing - logging out");
                await logOut();
                return;
            }
            setAuthToken(data.token);
            setIsLoggedIn(true);
            const isAdmin = await UserRequests.userIsAdmin();
            setIsAdmin(isAdmin);
        } catch (error) {
            console.error("Error loading auth token from AsyncStorage. ", error);
            await logOut();
        }
    };

    const logOut = async () => {
        console.log("Logging out user...");
        await AsyncStorage.storeAuth({ user: null, token: null });
        setAuthToken(null);
        setIsLoggedIn(false);
        // navigate("Volunteer Login");
    }

    const loadEventDate = async () => {
        const now = new Date();
        const eventDate = now.toISOString().split('T')[0]; // Extracts YYYY-MM-DD

        // Get the device's time zone
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        setEventDate(eventDate);
        setTimeZone(timeZone);
    };

    // Call `configurationAxios(authToken)` whenever `authToken` changes
    useEffect(() => {
        configureAxios(authToken);
    }, [authToken]);

    // Load auth token on app start
    useEffect(() => {
        loadFromAsyncStorage();
        loadEventDate();
    }, []);

    // Return the auth context provider
    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };