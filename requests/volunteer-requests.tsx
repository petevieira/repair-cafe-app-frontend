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

export const addVolunteer = async (volunteer) => {
  console.debug("Adding volunteer: ", volunteer);
  try {
    const authToken = await AsyncStorageHelpers.getAuth(authToken);
    if (!authToken) {
      throw new Error("[addVolunteer] failed to get auth token");
    }

    const response = await axios.post(
      Api.Volunteers.ADD_VOLUNTEER, volunteer,
      {
        headers: {'Authorization': `Bearer ${authToken.token}`}
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const updateVolunteer = async (volunteer) => {
  console.debug("Updating volunteer: ", volunteer);
  try {
    const authToken = await AsyncStorageHelpers.getAuth(authToken);
    if (!authToken) {
      throw new Error("[updateVolunteer] failed to get auth token");
    }

    const response = await axios.put(
      Api.Volunteers.UPDATE_VOLUNTEER,
      {
        id: volunteer._id,
        acceptsWaiver: volunteer.acceptsWaiver ?? false,
        firstName: volunteer.firstName ?? "",
        lastName: volunteer.lastName ?? "",
        email: volunteer.email ?? ""
      },
      {
        headers: {'Authorization': `Bearer ${authToken.token}`}
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const getVolunteer = async (id: string) => {
  console.debug("Getting volunteer: ", id);
  try {
    const authToken = await AsyncStorageHelpers.getAuth(authToken);
    if (!authToken) {
      throw new Error("[getVolunteer] failed to get auth token");
    }

    const response = await axios.get(Api.Volunteers.GET_VOLUNTEER + `/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken.token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
