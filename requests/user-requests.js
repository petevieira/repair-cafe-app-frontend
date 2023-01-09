/**
 * @description Logic for requests that go to <api>/users/* routes
 */

import axios from 'axios';
import Api from './request-consts';
import axiosInterceptor from './axios-interceptor';

/**
 * Checks if the passed in email is registered in the database
 * @param {string} email - email to check the registration status of
 * @returns Promise which resolves to the boolean emailIsRegistered or rejects
 */
const emailIsRegistered = async (email) => {
  try {
    const response = await axios.post(
      Api.Users.EMAIL_IS_REGISTERED,
      { email: email }
    );
    if (response?.data?.data?.emailIsRegistered === undefined) {
      throw new Error('emailIsRegistered is undefined');
    }
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Signs user up
 */
const signUp = async (email, first, last, password) => {
  try {
    const response = await axios.post(
      Api.Users.SIGN_UP,
      { email, first, last, password }
    );
    return response.data;
  } catch (error) {
    return error;
  }
}

/**
 * Sign user in
 */
const signIn = async (email, password) => {
  try {
    const response = await axios.post(
      Api.Users.SIGN_IN,
      { email, password }
    );
    console.log("success data: ", response.data);
    return response.data;
  } catch (error) {
    return error;
  }
}

export default { emailIsRegistered, signUp, signIn };
