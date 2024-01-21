/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from './requests/request-consts';
import axiosInterceptor from './requests/axios-interceptor';
// import AsyncStorageHelpers from '../globals/async-storage-helpers';

/**
 * Checks if the passed in email is registered in the database
 * @param {string} userId - ID of user for whom to items
 * @returns Promise which resolves to the array of items, or rejects
 */
const getRepairs = async (date = null) => {
  try {
    // const authToken = await AsyncStorageHelpers.getAuthToken(authToken);
    const response = await axios.post(
      Api.Events.GET_REPAIRS,
      { date: date },
      // {
        // headers: {
          // 'Authorization': `Bearer ${authToken}`
        // }
      // }
    );
    console.log("got response: ", response);
    if (response?.data?.data?.repairs === undefined) {
      return Promise.reject('data.repairs is undefined');
    }
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}