/**
 * @description Logic for requests that go to <api>/users/* routes
 */

import axios from 'axios';
import Api from './request-consts';

/**
 * Checks if the passed in email is registered in the database
 * @param {object} data - data object to pass to the api in the request body
 * @param {string} data.email - email to check the registration status of
 */
function emailIsRegistered(email) {
  return axios.post(Api.Users.EMAIL_IS_REGISTERED, { email: email });
}

export default { emailIsRegistered };
