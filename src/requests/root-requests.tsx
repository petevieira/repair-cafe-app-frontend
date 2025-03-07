/**
 * @description Logic for requests that go to <api>/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';

const checkServerHealth = async () => {
    const res = await axios.get(Api.Root.CHECK_SERVER_HEALTH);
    if (!res.status) {
        throw new Error(res.data.message);
    }
    return true;
}

export default {
    checkServerHealth,
};
