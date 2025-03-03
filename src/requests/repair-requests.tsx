/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import Repair from 'models/Repair';
import { WEIGHT_UNITS, COST_UNITS } from '@env';

export const getRepair = async (id: string): Promise<any> => {
    if (!id) {
        console.error("Can't get repair. 'id' not defined");
        return null;
    }

    return await axios.get(Api.Repairs.GET_REPAIR + `/${id}`);
};

/**
 * Checks if the passed in email is registered in the database
 * @param {string} isoDate - Date to get repairs from (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns Promise which resolves to the array of repairs, or rejects
 */
export const getRepairsByEvent = async (eventId: string): Promise<any> => {
    console.debug("Retrieving repairs for event ", eventId);
    if (!eventId) {
        throw new Error("Can't get repairs. 'eventId' not defined");
    }
    const res = await axios.get(Api.Repairs.GET_REPAIRS_BASIC + `/${eventId}`);
    if (!res.status) {
        throw new Error(res.data.message);
    }
    if (!res.data.repairs) {
        throw new Error("Repairs not found");
    }
    return res.data.repairs;
}

export const addFullRepair = async (repair: Repair): Promise<any> => {
    const res = await axios.post(Api.Repairs.ADD_FULL_REPAIR, createRepair(repair));
    if (!res.status) {
        throw new Error(res.data.message);
    }
    if (!res.data.repair) {
        throw new Error("Repair not found");
    }
}

export const updateRepair = async (repair: Repair): Promise<any> => {
  const res = await axios.put(Api.Repairs.UPDATE_REPAIR, createRepair(repair));
  if (!res.status) {
    throw new Error(res.data.message);
  }
  if (!res.data.repair) {
    throw new Error("Repair not found");
  }
  return res.data.repair;
}

export const deleteRepair = async (id: string): Promise<any> => {
    if (!id) {
        console.error("Can't delete repair. 'id' not defined");
        return { status: null };
    }

    return await axios.delete(Api.Repairs.DELETE_REPAIR + `/${id}`);
};

export const findOwnerByEmail = async (email: string): Promise<any> => {
    if (!email) {
        console.error("Can't find owner by email. 'email' not defined");
        return { status: false };
    }

    const res = await axios.get(Api.Repairs.FIND_OWNER_BY_EMAIL + `/${email}`);
    if (!res.status) {
        throw new Error(res.data.message);
    }
    return res.data.owner;
};

export const findIncompleteRepairsByOwner = async (email: string): Promise<any> => {
    if (!email) {
        console.error("Can't find incomplete repairs by owner. 'email' not defined");
        throw new Error("Can't find incomplete repairs by owner. 'email' not defined");
    }

    const res = await axios.get(Api.Repairs.FIND_INCOMPLETE_REPAIRS_BY_OWNER + `/${email}`);
    console.debug("res: ", res);
    if (!res.status) {
        throw new Error(res.data.message);
    }

    return res.data.repairs;
}

const createRepair = (repair: Repair) => {
    return {
        _id: repair._id,
        acceptsWaiver: repair.acceptsWaiver ?? true,
        brand: repair.brand ?? "",
        cost: repair.cost ?? COST_UNITS,
        eventId: repair.eventId ?? "",
        isFollowUpRepair: repair.isFollowUpRepair ?? false,
        model: repair.model ?? "",
        ownersEmail: repair.ownersEmail ?? "",
        ownersFirstName: repair.ownersFirstName ?? "",
        ownersLastName: repair.ownersLastName ?? "",
        product: repair.product ?? "",
        repairBarrier: repair.repairBarrier ?? "",
        repairNotes: repair.repairNotes ?? "",
        repairStatus: repair.repairStatus ?? "",
        repairerFirstName: repair.repairerFirstName ?? "",
        repairerLastName: repair.repairerLastName ?? "",
        type: repair.type ?? "",
        symptoms: repair.symptoms ?? "",
        weight: repair.weight ?? WEIGHT_UNITS,
    };
};
