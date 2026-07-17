/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from "axios";
import Api from "requests/request-consts";
import Repair from "models/Repair";
import { WEIGHT_UNITS, COST_UNITS } from "@env";
import { Response, RepairData, RepairsData, OwnerData } from "types/Response";

/**
 * Get single repair by id
 * @param {string} id - Repair id
 * @returns Promise which resolves to the array of repairs, or rejects
 */
export const getRepair = async (id: string): Promise<Response<RepairData>> => {
  if (!id) {
    console.error("Can't get repair. 'id' not defined");
    return null;
  }

  const res: Response<RepairData> = await axios.get(Api.Repairs.GET_REPAIR + `/${id}`);

  if (!res.status) {
    throw new Error(res.msg);
  }

  if (!res.data.repair) {
    throw new Error("Repair not found");
  }

  return res;
};

/**
 * Checks if the passed in email is registered in the database
 * @param {string} isoDate - Date to get repairs from (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns Promise which resolves to the array of repairs, or rejects
 */
export const getRepairsByEvent = async (eventId: string): Promise<Response<RepairsData>> => {
  if (!eventId) {
    return;
  }

  const res: Response<RepairsData> = await axios.get(Api.Repairs.GET_REPAIRS_BASIC + `/${eventId}`);

  if (!res.status) {
    throw new Error(res.msg);
  }

  if (!res.data.repairs) {
    throw new Error("Repairs not found");
  }

  return res;
};

/**
 * Add a new repair
 * @param {Repair} repair - Repair object to add
 * @returns Promise which resolves to the new repair, or rejects
 */
export const addFullRepair = async (repair: Repair): Promise<Response<RepairData>> => {
  const res: Response<RepairData> = await axios.post(Api.Repairs.ADD_FULL_REPAIR, createRepair(repair));

  if (!res.status) {
    throw new Error(res.msg);
  }

  if (!res.data.repair) {
    throw new Error("Repair not found");
  }

  return res;
};

/**
 * Update a repair
 * @param {Repair} repair - Repair object to update
 * @returns Promise which resolves to the updated repair, or rejects
 */
export const updateRepair = async (repair: Repair): Promise<Response<RepairData>> => {
  const res: Response<RepairData> = await axios.put(Api.Repairs.UPDATE_REPAIR, createRepair(repair));

  if (!res.status) {
    throw new Error(res.msg);
  }

  if (!res.data.repair) {
    throw new Error("Repair not found");
  }

  return res;
};

/**
 * Delete a repair
 * @param {string} id - Repair id. A MongoDB ObjectId
 * @returns Promise which resolves to the deleted repair, or rejects
 */
export const deleteRepair = async (id: string): Promise<Response<RepairData>> => {
  if (!id) {
    throw new Error("Can't delete repair. 'id' not defined");
  }

  const res: Response<RepairData> = await axios.delete(Api.Repairs.DELETE_REPAIR + `/${id}`);

  if (!res.status) {
    throw new Error(res.msg);
  }

  if (!res.data) {
    throw new Error(res.msg);
  }

  return res;
};

/**
 * Find item owner by email
 * @param {string} email - Email of the owner
 * @returns Promise which resolves to a response object with data.owner, or rejects
 */
export const findOwnerByEmail = async (email: string): Promise<Response<OwnerData>> => {
  if (!email) {
    throw new Error("Can't find owner by email. 'email' not defined");
  }

  const res: Response<OwnerData> = await axios.get(Api.Repairs.FIND_OWNER_BY_EMAIL + `/${email}`);

  if (!res.status) {
    throw new Error(res.msg);
  }

  return res;
};

/**
 * Find incomplete repairs by owner
 * @param {string} email - Email of the owner
 * @returns Promise which resolves a response object with data.repairs, or rejects
 */
export const findIncompleteRepairsByOwner = async (email: string): Promise<Response<RepairsData>> => {
  if (!email) {
    console.error("Can't find incomplete repairs by owner. 'email' not defined");
    throw new Error("Can't find incomplete repairs by owner. 'email' not defined");
  }

  const res: Response<RepairsData> = await axios.get(Api.Repairs.FIND_INCOMPLETE_REPAIRS_BY_OWNER + `/${email}`);

  if (!res.status) {
    throw new Error(res.msg);
  }

  if (!res.data.repairs) {
    throw new Error("No previous repairs found");
  }

  return res;
};

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
    previousRepairer: repair.previousRepairer ?? "",
    type: repair.type ?? "",
    symptoms: repair.symptoms ?? "",
    weight: repair.weight ?? WEIGHT_UNITS,
  };
};
