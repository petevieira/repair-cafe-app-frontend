/**
 * @description Logic for requests that go to <api>/subscribers/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import { Response, SubscribedData } from 'types/Response';

export const subscribeEmailToNewsletter = async (email: string) => {
    if (!email) {
        console.error("Can't subscribe email to newsletter. 'email' not defined");
        throw new Error("Email not defined");
    }

    const res = await axios.post(
        Api.Subscribers.SUBSCRIBE_EMAIL_TO_NEWSLETTER,
        { email }
    );
    if (!res.status) {
        throw new Error(res.data.msg);
    }
}

export const unsubscribeEmailFromNewsletter = async (email: string) => {
    if (!email) {
        console.error("Can't unsubscribe email from newsletter. 'email' not defined");
        throw new Error("Email not defined");
    }

    const res = await axios.post(
        Api.Subscribers.UNSUBSCRIBE_EMAIL_FROM_NEWSLETTER,
        { email }
    );
    console.debug("res: ", res);

    if (!res.status) {
        throw new Error(res.data.msg);
    }

    return true;
}

/**
 * Check if the email is subscribed to the newsletter
 * @param {string} email - The email to check
 * @returns Promise which resolves to true if subscribed, or rejects
 */
export const getIsSubscribed = async (email: string): Promise<Response<SubscribedData>> => {
    if (!email) {
        console.error("Can't check if email is subscribed. 'email' not defined");
        throw new Error("Email not defined");
    }

    const res: Response<SubscribedData> = await axios.post(
        Api.Subscribers.IS_EMAIL_SUBSCRIBED,
        { email }
    );

    if (!res.status) {
        throw new Error(res.msg);
    }

    return res;
}