/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from './request-consts';
import axiosInterceptor from './axios-interceptor';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import Item from '../models/Item';

/**
 * Checks if the passed in email is registered in the database
 * @param {string} date - Date to get repairs from
 * @returns Promise which resolves to the array of items, or rejects
 */
export const getTodaysItems = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();
  try {
    const response = await axios.get(Api.Items.GET_ITEMS_BASIC + `/${todayIso}`);
    if (!response) {
      throw new Error("Error fetching items");
    }
    console.debug("response: ", response);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export const addBasicItem = async (item: Item) => {
  try {
    const response = await axios.post(
      Api.Items.ADD_BASIC_ITEM, { item: item });
    if (!response) {
      throw new Error("Error saving item");
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const createItem = async (item: Item) => {
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

export const updateItem = async (item: Item) => {

}