/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from './request-consts';
// import axiosInterceptor from './axios-interceptor';
import AsyncStorageHelpers from '../globals/async-storage-helpers';

export const getText = async (field: string) => {
  if (!field) {
    console.error("Can't get text. 'field' not defined");
    return null;
  }
  try {
    const response = await axios.get(
      Api.Text.GET_TEXT + `/${field}`,
    );
    if (!response) {
      throw new Error("Error fetching text");
    }
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};