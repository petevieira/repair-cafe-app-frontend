/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from './request-consts';
import axiosInterceptor from './axios-interceptor';
import AsyncStorageHelpers from '../globals/async-storage-helpers';

/**
 * Checks if the passed in email is registered in the database
 * @param {string} date - Date to get repairs from
 * @returns Promise which resolves to the array of items, or rejects
 */
export const getTodaysVolunteers = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();
  try {
    const response = await axios.get(Api.Volunteers.GET_DAYS_VOLUNTEERS + `/${todayIso}`);
    if (!response) {
      throw new Error("Error fetching volunteers");
    }
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
