/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';

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

export const getVolunteersByEvent = async (eventId: string) => {
    try {
        const res = await axios.get(Api.Volunteers.GET_VOLUNTEERS_BY_EVENT + `/${eventId}`);
        if (!res.status) {
            throw new Error(res.data.message);
        }
        if (res.data?.volunteers === undefined) {
            throw new Error("Error getting volunteers by event");
        }

        return res.data.volunteers;
    } catch (error) {
        console.error("Error getting volunteers by event: ", error);
        throw error;
    }

}

export const addVolunteer = async (volunteer) => {
    return await axios.post(
        Api.Volunteers.ADD_VOLUNTEER, volunteer,
    );
}

export const updateVolunteer = async (volunteer) => {
    return await axios.put(
        Api.Volunteers.UPDATE_VOLUNTEER,
        {
            id: volunteer._id,
            acceptsWaiver: volunteer.acceptsWaiver ?? false,
            firstName: volunteer.firstName ?? "",
            lastName: volunteer.lastName ?? "",
            email: volunteer.email ?? ""
        },
    );
}

export const getVolunteer = async (id: string) => {
    return await axios.get(Api.Volunteers.GET_VOLUNTEER + `/${id}`);
}

export const deleteVolunteer = async (id: string) => {
    if (!id) {
        throw new Error("Can't delete volunteer. 'id' not defined");
    }

    const response = await axios.delete(Api.Volunteers.DELETE_VOLUNTEER + `/${id}`);
};

export const getPastVolunteers = async () => {
    return await axios.get(Api.Volunteers.GET_PAST_VOLUNTEERS);
}

export const findVolunteerByEmail = async (email: string) => {
    return await axios.get(Api.Volunteers.FIND_VOLUNTEER_BY_EMAIL + `/${email}`);
}

