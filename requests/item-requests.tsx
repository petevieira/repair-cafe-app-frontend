/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from './requests/request-consts';
import axiosInterceptor from './requests/axios-interceptor';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import Item from '../models/Item';

/**
 * Checks if the passed in email is registered in the database
 * @param {string} date - Date to get repairs from
 * @returns Promise which resolves to the array of items, or rejects
 */
const getTodaysItems = async () => {
  const now = new Date();
  try {
    let options = {};
    const authToken = await AsyncStorageHelpers.getAuthToken(authToken);
    if (authToken) {
      options = {
        headers: {'Authorization': `Bearer ${authToken}`}
      };
    }
    response = await axios.post(
      Api.Repairs.GET_REPAIRS,
      { date: date },
      options
    );
    console.debug("[getRepairs] response: ", response);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

const createItem = async (item: Item) => {
  try {
    let options = {};
    const authToken = await AsyncStorageHelpers.getAuthToken(authToken);
    if (authToken) {
      options = {
        headers: {'Authorization': `Bearer ${authToken}`}
      };
    }
    response = await axios.post(
      Api.Repairs.GET_REPAIRS,
      { date: date },
      options
    );
    console.debug("[getRepairs] response: ", response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const updateItem = async (item: Item) => {

}