import { useState, useEffect, createContext, useContext } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import AsyncStorage from "globals/async-storage-helpers";
import { jwtDecode, JwtPayload } from "jwt-decode";
import UserRequests from "requests/user-requests";
import { navigate } from "globals/navigation-ref";
import RepairEvent from "models/RepairEvent";
import { getMostRecentEvent } from "requests/repair-event-requests";
import { Response, IsAdminData } from "types/Response";

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
    appEvent: new RepairEvent(),
    setAppEvent: (event: RepairEvent) => { appEvent: event },
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
    const [appEvent, setAppEvent] = useState(null);
    const [timeZone, setTimeZone] = useState("");

    const value = {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg,
        isAdmin, setIsAdmin,
        appEvent, setAppEvent,
        timeZone, setTimeZone,
    };

    /**
     * @description Check if the auth token is expired every 5 seconds.
     * If the token is expired, log the user out, so that they can log back in,
     * and avoid attempting operations that silently fail.
     */
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

    /**
     * @description Configure Axios with the auth token.
     * If the token is missing or expired, remove the auth token from Axios.
     * Return ok responses with just the data.
     * Handle 401 Unauthorized errors by logging the user out.
     * @param {string} token - The authentication bearer token to configure Axios with
     */
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
            function (response: AxiosResponse) {
                // Response is valid. Return it to final destination.
                return response.data;
            },
            function (error) {
                if (typeof error.response === 'undefined') {
                    return Promise.reject(error);
                }

                // If there's an error, remove the auth if unauthorized
                // and return to the sign-in page.
                let res = error.response;
                if (res.status === 401 && res.config) {
                    if (!res.config?.__isRetryRequest) {
                        res.config.__isRetryRequest = true;
                        console.warn("401 Unauthorized - Logging out user.");
                        logOut();
                    }
                    return Promise.reject(error);
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

    /**
     * @description Check if the token is expired.
     * @param {string} token - The authentication token to check
     * @returns {boolean} - True if the token is expired, false otherwise
     */
    const tokenIsExpired = (token: string): boolean => {
        if (!token) {
            return true;
        }

        try {
            const decoded: JwtPayload = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    }

    /**
     * Retrieve the auth token from AsyncStorage and set it in state.
     * If the token is missing or expired, log the user out.
     * @returns {Promise<void>}
     */
    const loadFromAsyncStorage = async (): Promise<void> => {
        try {
            let data = await AsyncStorage.getAuth();
            if (!data || !data.token || tokenIsExpired(data.token)) {
                console.log("Token expired or missing - logging out");
                await logOut();
                return;
            }
            setAuthToken(data.token);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Error loading auth token from AsyncStorage. ", error);
            await logOut();
        }
    };

    /**
     * @description Check if the user is an admin by making a request to the server.
     * @returns {Promise<void>}
     */
    const getSetIsAdmin = async (): Promise<void> => {
        if (!authToken) {
            setIsAdmin(false);
            return;
        }
        try {
            const res: Response<IsAdminData> = await UserRequests.userIsAdmin();
            setIsAdmin(res.data.isAdmin);
        } catch (error) {
            console.error("Error checking if user is admin: ", error);
            setIsAdmin(false);
        }
    }

    /**
     * @description Logs the user out by removing the auth token from AsyncStorage
     * and setting the auth token to null.
     * @returns {Promise<void>}
     */
    const logOut = async (): Promise<void> => {
        console.log("Logging out user...");
        await AsyncStorage.storeAuth({ user: null, token: null });
        setAuthToken(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('Volunteer Login');
    }

    const loadEventDate = async () => {
        try {
            const mostRecentEvent = await getMostRecentEvent();
            console.debug("Most recent event: ", mostRecentEvent);
            setAppEvent(mostRecentEvent);
        } catch (error) {
            console.error("Error fetching most recent event: ", error);
            setSnackbarMsg(error.message || "Error fetching most recent event.");
        }

        // Get the device's time zone
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(timeZone);
    };

    // Call `configurationAxios(authToken)` whenever `authToken` changes
    useEffect(() => {
        configureAxios(authToken);
        getSetIsAdmin();
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
