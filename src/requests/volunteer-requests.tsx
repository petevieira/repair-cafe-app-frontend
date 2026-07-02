/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import Volunteer from 'models/Volunteer';
import { Response, VolunteerData, VolunteersData, PastVolunteersData } from 'types/Response';

/**
 * Get all volunteers associated with the event
 * @param {string} eventId - The id of the event to get volunteers for
 * @returns Promise which resolves to a Response with data.volunteers array inside
 */
export const getVolunteersByEvent = async (eventId: string): Promise<Response<VolunteersData>> => {
    const res: Response<VolunteersData> = await axios.get(
        Api.Volunteers.GET_VOLUNTEERS_BY_EVENT + `/${eventId}`
    );

    if (!res.status) {
        throw new Error(res.msg);
    }

    if (res.data?.volunteers === undefined) {
        throw new Error("Error getting volunteers by event");
    }

    return res;
}

/**
 * Add a volunteer to the database for the current event
 * @param {Volunteer} volunteer - The volunteer to add
 * @returns Promise which resolves to the response with data.volunteer inside
 */
export const addVolunteer = async (volunteer: Volunteer): Promise<Response<VolunteerData>> => {
    const response: Response<VolunteerData> = await axios.post(
        Api.Volunteers.ADD_VOLUNTEER, volunteer,
    );

    if (!response.status) {
        throw new Error(response.msg);
    }

    if (!response.data.volunteer) {
        throw new Error("Volunteer not found");
    }

    return response;
}

/**
 * Update a volunteer in the database
 * @param {Volunteer} volunteer - The volunteer to update, with the new values
 * @returns Promise which resolves to the response with data.volunteer inside
 */
export const updateVolunteer = async (volunteer: Volunteer): Promise<Response<VolunteerData>> => {
    const response: Response<VolunteerData> = await axios.put(
        Api.Volunteers.UPDATE_VOLUNTEER,
        {
            id: volunteer._id,
            acceptsWaiver: volunteer.acceptsWaiver ?? false,
            firstName: volunteer.firstName ?? "",
            lastName: volunteer.lastName ?? "",
            email: volunteer.email ?? ""
        },
    );

    if (!response.status) {
        throw new Error(response.msg);
    }

    if (!response.data.volunteer) {
        throw new Error("Volunteer not found");
    }

    return response;
}

/**
 * Get a volunteer from the database by _id
 * @param {string} id - The id of the volunteer to get. Mongo ObjectId string.
 * @returns Promise which resolves to the response with data.volunteer inside
 */
export const getVolunteer = async (id: string): Promise<Response<VolunteerData>> => {
    const res: Response<VolunteerData> = await axios.get(Api.Volunteers.GET_VOLUNTEER + `/${id}`);

    if (!res.status) {
        throw new Error(res.msg);
    }

    if (!res.data.volunteer) {
        throw new Error("Volunteer not found");
    }

    return res;
}

/**
 * Delete a volunteer from the database by _id
 * @param {string} id - The id of the volunteer to delete. Mongo ObjectId string.
 * @returns Promise which resolves to the response with data.volunteer inside
 */
export const deleteVolunteer = async (id: string): Promise<Response<VolunteerData>> => {
    if (!id) {
        throw new Error("Can't delete volunteer. 'id' not defined");
    }

    const response: Response<VolunteerData> =
        await axios.delete(Api.Volunteers.DELETE_VOLUNTEER + `/${id}`);

    if (!response.status) {
        throw new Error(response.msg);
    }

    return response;
};

export const getPastVolunteers = async (): Promise<Response<PastVolunteersData>> => {
    const res: Response<PastVolunteersData> = await axios.get(Api.Volunteers.GET_PAST_VOLUNTEERS);

    if (!res.status) {
        throw new Error(res.msg);
    }

    if (res.data?.pastVolunteers === undefined) {
        throw new Error("Error getting past volunteers");
    }

    return res;
}

/**
 * Find a volunteer by email
 * @param {string} email - The email of the volunteer to find
 * @returns Promise which resolves to the response with data.volunteer inside
 */
export const findVolunteerByEmail = async (email: string): Promise<Response<VolunteerData>> => {
    const res: Response<VolunteerData>
        = await axios.get(Api.Volunteers.FIND_VOLUNTEER_BY_EMAIL + `/${email}`);

    if (!res.status) {
        throw new Error(res.msg);
    }

    return res;
}

