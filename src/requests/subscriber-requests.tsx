/**
 * @description Logic for requests that go to <api>/subscribers/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';

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
        throw new Error(res.data.message);
    }
}

export const unsubscribeEmailFromNewsletter = async (email: string) => {
    if (!email) {
        console.error("Can't unsubscribe email from newsletter. 'email' not defined");
        throw new Error("Email not defined");
    }

    const res = await axios.delete(Api.Subscribers.UNSUBSCRIBE_EMAIL_FROM_NEWSLETTER + `/${email}`);
    if (!res.status) {
        throw new Error(res.data.message);
    }
}
