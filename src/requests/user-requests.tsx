/**
 * @description Logic for requests that go to <api>/users/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';

const userIsAdmin = async (email) => {
  return await axios.get(Api.Users.USER_IS_ADMIN + `/${email}`);
}

const signInAdmin = async (email, password) => {
  return await axios.post(
    Api.Users.SIGN_IN_ADMIN,
    { email, password }
  );
}

export default { userIsAdmin, signInAdmin };
