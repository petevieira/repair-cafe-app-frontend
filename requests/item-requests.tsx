/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from './request-consts';
import axiosInterceptor from './axios-interceptor';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import Item from '../models/Item';

export const getItem = async (id: string) => {
  if (!id) {
    console.error("Can't get item. 'id' not defined");
    return null;
  }
  try {
    const response = await axios.get(Api.Items.GET_ITEM + `/${id}`);
    if (!response) {
      throw new Error("Error fetching item");
    }
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

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
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export const addBasicItem = async (item: Item) => {
  try {
    const response = await axios.post(
      Api.Items.ADD_BASIC_ITEM,
      {
        acceptsWaiver: item.acceptsWaiver ?? true,
        ownersEmail: item.ownersEmail ?? "",
        ownersFirstName: item.ownersFirstName ?? "",
        ownersLastName: item.ownersLastName ?? "",
        type: item.type ?? "",
        brand: item.brand ?? "",
        model: item.model ?? "",
        symptoms: item.symptoms ?? ""
      }
    );
    if (!response) {
      throw new Error("Error saving item");
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const addFullItem = async (item: Item) => {
  try {
    const authToken = await AsyncStorageHelpers.getAuth(authToken);
    if (!authToken) {
      throw new Error("[updateItem] failed to get auth token");
    }
    const response = await axios.post(
      Api.Items.ADD_FULL_ITEM,
      {
        _id: item._id,
        acceptsWaiver: item.acceptsWaiver ?? true,
        ownersEmail: item.ownersEmail ?? "",
        ownersFirstName: item.ownersFirstName ?? "",
        ownersLastName: item.ownersLastName ?? "",
        type: item.type ?? "",
        brand: item.brand ?? "",
        model: item.model ?? "",
        symptoms: item.symptoms ?? "",
        notes: item.notes ?? "",
        repairerFirstName: item.repairerFirstName ?? "",
        repairerLastName: item.repairerLastName ?? "",
        status: item.status ?? ""
      },
      {
        headers: {'Authorization': `Bearer ${authToken.token}`}
      }
    );
    if (!response) {
      throw new Error("Error saving item");
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const updateItem = async (item: Item) => {
  try {
    const authToken = await AsyncStorageHelpers.getAuth(authToken);
    if (!authToken) {
      throw new Error("[updateItem] failed to get auth token");
    }

    const response = await axios.put(
      Api.Items.UPDATE_ITEM,
      {
        _id: item._id,
        acceptsWaiver: item.acceptsWaiver ?? true,
        ownersEmail: item.ownersEmail ?? "",
        ownersFirstName: item.ownersFirstName ?? "",
        ownersLastName: item.ownersLastName ?? "",
        type: item.type ?? "",
        brand: item.brand ?? "",
        model: item.model ?? "",
        symptoms: item.symptoms ?? "",
        notes: item.notes ?? "",
        repairerFirstName: item.repairerFirstName ?? "",
        repairerLastName: item.repairerLastName ?? "",
        status: item.status ?? ""
      },
      {
        headers: {'Authorization': `Bearer ${authToken.token}`}
      }
    );
    console.debug("update item response: ", response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}