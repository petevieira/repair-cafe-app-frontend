/**
 * @description Logic for requests that go to <api>/users/* routes
 */

import axios from 'axios';
import Api from './request-consts';
import axiosInterceptor from './axios-interceptor';

const userIsAdmin = async (email) => {
  try {
    const response = await axios.get(Api.Users.USER_IS_ADMIN + `/${email}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

const signInAdmin = async (email, password) => {
  try {
    const response = await axios.post(
      Api.Users.SIGN_IN_ADMIN,
      { email, password }
    );
    return response.data;
  } catch (error) {
    return error;
  }
}

export default { userIsAdmin, signInAdmin };
