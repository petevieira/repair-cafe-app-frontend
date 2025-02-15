/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import AsyncStorageHelpers from 'globals/async-storage-helpers';
import Item from 'models/Item';
import { WEIGHT_UNITS, COST_UNITS } from '@env';

export const getItem = async (id: string, signal) => {
  if (!id) {
    console.error("Can't get item. 'id' not defined");
    return null;
  }
  const authToken = await AsyncStorageHelpers.getAuth();
  if (!authToken) {
    throw new Error("[getItem] failed to get auth token");
  }
  return await axios.get(
    Api.Items.GET_ITEM + `/${id}`,
    {
      headers: {'Authorization': `Bearer ${authToken.token}`}
    }
  );
};

/**
 * Checks if the passed in email is registered in the database
 * @param {string} date - Date to get repairs from
 * @returns Promise which resolves to the array of items, or rejects
 */
export const getTodaysItems = async () => {
  const authToken = await AsyncStorageHelpers.getAuth();
  if (!authToken) {
    throw new Error("[getTodaysItems] failed to get auth token");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();
  return await axios.get(
    Api.Items.GET_ITEMS_BASIC + `/${todayIso}`
  );
}

export const addFullItem = async (item: Item) => {
  const authToken = await AsyncStorageHelpers.getAuth();
  if (!authToken) {
    throw new Error("[addFullItem] failed to get auth token");
  }
  return await axios.post(
    Api.Items.ADD_FULL_ITEM,
    createItem(item),
    {
      headers: {'Authorization': `Bearer ${authToken.token}`}
    }
  );
}

export const updateItem = async (item: Item) => {
  const authToken = await AsyncStorageHelpers.getAuth();
  if (!authToken) {
    throw new Error("[updateItem] failed to get auth token");
  }
  return await axios.put(
    Api.Items.UPDATE_ITEM,
    createItem(item),
    {
      headers: {'Authorization': `Bearer ${authToken.token}`}
    }
  );
}

export const deleteItem = async (id: string) => {
  if (!id) {
    console.error("Can't delete item. 'id' not defined");
    return { status: null };
  }
  const authToken = await AsyncStorageHelpers.getAuth();
  if (!authToken) {
    throw new Error("[deleteItem] failed to get auth token");
  }
  return await axios.delete(
    Api.Items.DELETE_ITEM + `/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken.token}`
      }
    }
  );
};

export const findOwnerByEmail = async (email: string) => {
  if (!email) {
    console.error("Can't find owner by email. 'email' not defined");
    return { status: false };
  }
  const authToken = await AsyncStorageHelpers.getAuth();
  if (!authToken) {
    throw new Error("[findOwnerByEmail] failed to get auth token");
  }
  return await axios.get(
    Api.Items.FIND_OWNER_BY_EMAIL + `/${email}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken.token}`
      }
    }
  );
};

const createItem = (item: Item) => {
  return {
    _id: item._id,
    acceptsWaiver: item.acceptsWaiver ?? true,
    ownersEmail: item.ownersEmail ?? "",
    ownersFirstName: item.ownersFirstName ?? "",
    ownersLastName: item.ownersLastName ?? "",
    product: item.product ?? "",
    type: item.type ?? "",
    brand: item.brand ?? "",
    model: item.model ?? "",
    symptoms: item.symptoms ?? "",
    repairNotes: item.repairNotes ?? "",
    repairerFirstName: item.repairerFirstName ?? "",
    repairerLastName: item.repairerLastName ?? "",
    repairStatus: item.repairStatus ?? "",
    repairBarrier: item.repairBarrier ?? "",
    weight: item.weight ?? WEIGHT_UNITS,
    cost: item.cost ?? COST_UNITS
  };
};