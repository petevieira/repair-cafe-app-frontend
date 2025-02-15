/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import AsyncStorageHelpers from 'globals/async-storage-helpers';

/**
 * Checks if the passed in email is registered in the database
 * @param {string} date - Date to get repairs from
 * @returns Promise which resolves to the array of items, or rejects
 */
export const getTodaysVolunteers = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  return await axios.get(
    Api.Volunteers.GET_DAYS_VOLUNTEERS + `/${todayIso}`
  );
}

export const addVolunteer = async (volunteer) => {
  const authToken = await AsyncStorageHelpers.getAuth(authToken);
  if (!authToken) {
    throw new Error("[addVolunteer] failed to get auth token");
  }

  return await axios.post(
    Api.Volunteers.ADD_VOLUNTEER, volunteer,
    {
      headers: {'Authorization': `Bearer ${authToken.token}`}
    }
  );
}

export const updateVolunteer = async (volunteer) => {
  const authToken = await AsyncStorageHelpers.getAuth(authToken);
  if (!authToken) {
    throw new Error("[updateVolunteer] failed to get auth token");
  }

  return await axios.put(
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
}

export const getVolunteer = async (id: string) => {
  const authToken = await AsyncStorageHelpers.getAuth(authToken);
  if (!authToken) {
    throw new Error("[getVolunteer] failed to get auth token");
  }

  return await axios.get(Api.Volunteers.GET_VOLUNTEER + `/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken.token}`
      }
    }
  );
}

export const deleteVolunteer = async (id: string) => {
  if (!id) {
    throw new Error("Can't delete volunteer. 'id' not defined");
  }
  const authToken = await AsyncStorageHelpers.getAuth(authToken);
  if (!authToken) {
    throw new Error("[getVolunteer] failed to get auth token");
  }
  const response = await axios.delete(
    Api.Volunteers.DELETE_VOLUNTEER + `/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken.token}`
      }
    }
  );
};

export const getPastVolunteers = async () => {
  const authToken = await AsyncStorageHelpers.getAuth(authToken);
  if (!authToken) {
    throw new Error("[getPastVolunteer] failed to get auth token");
  }
  return await axios.get(
    Api.Volunteers.GET_PAST_VOLUNTEERS,
    {
      headers: {
        'Authorization': `Bearer ${authToken.token}`
      }
    }
  );
}

export const findVolunteerByEmail = async (email: string) => {
  const authToken = await AsyncStorageHelpers.getAuth(authToken);
  if (!authToken) {
    throw new Error("findVolunteersByEmail() failed to get auth token");
  }
  return await axios.get(
    Api.Volunteers.FIND_VOLUNTEER_BY_EMAIL + `/${email}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken.token}`
      }
    }
  );
}

