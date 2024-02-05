/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from './request-consts';
// import axiosInterceptor from './axios-interceptor';
import AsyncStorageHelpers from '../globals/async-storage-helpers';
import Item from '../models/Item';
import { WEIGHT_UNITS, COST_UNITS } from '@env';

export const getItem = async (id: string, signal) => {
  if (!id) {
    console.error("Can't get item. 'id' not defined");
    return null;
  }
  try {
    const response = await axios.get(
      Api.Items.GET_ITEM + `/${id}`,
      { signal }
    );
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
export const getTodaysItems = async (signal) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();
  try {
    const response = await axios.get(
      Api.Items.GET_ITEMS_BASIC + `/${todayIso}`,
      { signal }
    );
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
      createItem(item),
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
      createItem(item),
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
    console.debug("[updateItem: ", item);
    const response = await axios.put(
      Api.Items.UPDATE_ITEM,
      createItem(item),
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

export const deleteItem = async (id: string) => {
  if (!id) {
    console.error("Can't delete item. 'id' not defined");
    return { status: null };
  }
  try {
    const authToken = await AsyncStorageHelpers.getAuth(authToken);
    if (!authToken) {
      throw new Error("[getVolunteer] failed to get auth token");
    }
    const response = await axios.delete(
      Api.Items.DELETE_ITEM + `/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken.token}`
        }
      }
    );
    if (!response) {
      throw new Error("Error deleting item");
    }
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const createItem = (item: Item) => {
  return {
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
    status: item.status ?? "",
    weight: item.weight ?? WEIGHT_UNITS,
    cost: item.cost ?? COST_UNITS
  };
};