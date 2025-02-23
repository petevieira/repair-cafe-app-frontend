/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import Item from 'models/Item';
import { WEIGHT_UNITS, COST_UNITS } from '@env';

export const getItem = async (id: string): Promise<any> => {
    if (!id) {
        console.error("Can't get item. 'id' not defined");
        return null;
    }

    return await axios.get(Api.Items.GET_ITEM + `/${id}`);
};

/**
 * Checks if the passed in email is registered in the database
 * @param {string} isoDate - Date to get repairs from (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns Promise which resolves to the array of items, or rejects
 */
export const getItemsByDate = async (isoDate: string): Promise<any> => {
    const res = await axios.get(Api.Items.GET_ITEMS_BASIC + `/${isoDate}`);
    if (!res.status) {
        throw new Error(res.data.message);
    }
    if (!res.data.items) {
        throw new Error("Items not found");
    }
    return res.data.items;
}

export const findPreviousEventDate = async (isoDate: string): Promise<any> => {
    if (!isoDate) {
        console.error("Can't find previous event date. 'date' not defined");
        return null;
    }

    const res = await axios.post(Api.Items.FIND_PREVIOUS_EVENT_DATE, { date: isoDate });
    if (!res.status) {
        throw new Error(res.data.message);
    }

    if (!res.data.date) {
        return "";
    }

    return res.data.date;
}

export const findNextEventDate = async (isoDate: string): Promise<any> => {
    if (!isoDate) {
        console.error("Can't find next event date. 'date' not defined");
        return null;
    }

    const res = await axios.post(Api.Items.FIND_NEXT_EVENT_DATE, { date: isoDate });
    if (!res.status) {
        throw new Error(res.data.message);
    }

    if (!res.data.date) {
        return "";
    }

    return res.data.date;
}

export const addFullItem = async (item: Item): Promise<any> => {
    const res = await axios.post(Api.Items.ADD_FULL_ITEM, createItem(item));
    if (!res.status) {
        throw new Error(res.data.message);
    }
    if (!res.data.item) {
        throw new Error("Item not found");
    }
}

export const updateItem = async (item: Item): Promise<any> => {
  const res = await axios.put(Api.Items.UPDATE_ITEM, createItem(item));
  if (!res.status) {
    throw new Error(res.data.message);
  }
  if (!res.data.item) {
    throw new Error("Item not found");
  }
  return res.data.item;
}

export const deleteItem = async (id: string): Promise<any> => {
    if (!id) {
        console.error("Can't delete item. 'id' not defined");
        return { status: null };
    }

    return await axios.delete(Api.Items.DELETE_ITEM + `/${id}`);
};

export const findOwnerByEmail = async (email: string): Promise<any> => {
    if (!email) {
        console.error("Can't find owner by email. 'email' not defined");
        return { status: false };
    }

    const res = await axios.get(Api.Items.FIND_OWNER_BY_EMAIL + `/${email}`);
    if (!res.status) {
        throw new Error(res.data.message);
    }
    return res.data.owner;
};

export const findIncompleteItemsByOwner = async (email: string): Promise<any> => {
    if (!email) {
        console.error("Can't find incomplete items by owner. 'email' not defined");
        throw new Error("Can't find incomplete items by owner. 'email' not defined");
    }

    const res = await axios.get(Api.Items.FIND_INCOMPLETE_ITEMS_BY_OWNER + `/${email}`);
    console.debug("res: ", res);
    if (!res.status) {
        throw new Error(res.data.message);
    }

    return res.data.items;
}

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
        cost: item.cost ?? COST_UNITS,
        isFollowUpRepair: item.isFollowUpRepair ?? false
    };
};
