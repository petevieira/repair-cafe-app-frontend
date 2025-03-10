/**
 * @description Logic for requests that go to <api>/users/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import { Response, IsRegisteredData, IsAdminData, SignInData } from 'types/Response';

/**
 * Checks if the passed in email is registered in the database
 * @param {string} email - The email to check
 * @returns Promise which resolves to true if the email is registered, or rejects
 */
const emailIsRegistered = async (email: string): Promise<Response<IsRegisteredData>> => {
    const res: Response<IsRegisteredData> = await axios.post(Api.Users.EMAIL_IS_REGISTERED, { email });

    if (res.data?.isRegistered === undefined) {
        throw new Error("User not found");
    }

    return res;
}

/**
 * Sign in with the given email and password
 * @param {string} email - The email to sign in with
 * @param {string} password - The password to sign in with
 * @returns Promise which resolves to the response with data.user and data.token inside
 */
const signIn = async (email: string, password: string): Promise<Response<SignInData>> => {
    const res: Response<SignInData> = await axios.post(
        Api.Users.SIGN_IN,
        { email, password }
    );

    if (!res.data?.user) {
        throw new Error("User not found");
    }

    if (!res.data?.token) {
        throw new Error("Token not found");
    }

    return res;
}

/**
 * Check if the user is an admin
 * @returns Promise which resolves to true if the user is an admin, or rejects
 */
const userIsAdmin = async (): Promise<Response<IsAdminData>> => {
    const res: Response<IsAdminData> = await axios.post(Api.Users.USER_IS_ADMIN);

    if (res.data?.isAdmin === undefined) {
        throw new Error("User not found");
    }

    return res;
}

export default {
    emailIsRegistered,
    signIn,
    userIsAdmin,
};
