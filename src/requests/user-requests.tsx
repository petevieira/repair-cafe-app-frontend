/**
 * @description Logic for requests that go to <api>/users/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';

const emailIsRegistered = async (email: string) => {
    const res = await axios.get(Api.Users.EMAIL_IS_REGISTERED + `/${email}`);
    if (!res.status) {
        throw new Error(res.data.message);
    }
    if (res.data?.isRegistered === undefined) {
        throw new Error("User not found");
    }
    return res.data.isRegistered;
}

const signIn = async (email: string, password: string) => {
    const res = await axios.post(
        Api.Users.SIGN_IN,
        { email, password }
    );

    if (!res.status) {
        throw new Error(res.data.message);
    }

    if (!res.data.user) {
        throw new Error("User not found");
    }

    if (!res.data.token) {
        throw new Error("Token not found");
    }

    return { token: res.data.token, user: res.data.user };
}

const userIsAdmin = async (): Promise<boolean> => {
    const res: any = await axios.post(Api.Users.USER_IS_ADMIN);
    if (!res.status) {
        throw new Error(res.data.message);
    }
    if (res.data?.isAdmin === undefined) {
        throw new Error("User not found");
    }
    return res.data.isAdmin;
}

export default {
    emailIsRegistered,
    signIn,
    userIsAdmin,
};
