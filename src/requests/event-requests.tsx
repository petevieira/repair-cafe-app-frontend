/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import { Event as RepairEvent } from 'models/Event';

/**
 * Get an event by its MongoDB document ID
 * @param {string} id - MongoDB document ID of the event
 * @returns Promise which resolves to the event, or rejects
 */
export const getEventById = async (id: string): Promise<RepairEvent> => {
    if (!id) {
        console.error("Can't get item. 'id' not defined");
        return null;
    }

    const res = await axios.post(Api.Events.GET_EVENT_BY_ID, { id: id });
    if (!res.status || !res.data?.event) {
        throw new Error(res.data?.message);
    }

    return res.data.event;
};

/**
 * Get all events
 * @returns Promise which resolves to the array of events, or rejects
 */
export const getEvents = async (): Promise<[RepairEvent]> => {
    const res = await axios.get(Api.Events.GET_EVENTS);
    if (!res.status || !res.data || res.data?.events === undefined) {
        throw new Error(res.data?.message);
    }
    return res.data.events;
}

/**
 * Create a new event
 * @param {string} date - Date of the event (YYYY-MM-DD)
 * @return Promise which resolves to the created event, or rejects
 */
export const createEvent = async (date: Date): Promise<RepairEvent> => {
    if (!date) {
        console.error("Can't find previous event date. 'date' not defined");
        return null;
    }

    // Check date format is correct
    const checkDate = new Date(date);
    if (isNaN(checkDate.getTime())) {
        throw new Error("Invalid date format");
    }

    const res = await axios.post(Api.Events.CREATE_EVENT, { date: date });
    if (!res.status) {
        throw new Error(res.data?.message);
    }

    if (!res.data?.event) {
        throw new Error("Event creation failed");
    }

    return res.data.createdEvent;
}

export const deleteEventById = async (id: string): Promise<RepairEvent> => {
    if (!id) {
        console.error("Can't delete event. 'id' not defined");
        return null;
    }

    const res = await axios.delete(Api.Events.DELETE_EVENT_BY_ID + `/${id}`);

    if (!res.status || !res.data?.deletedEvent) {
        throw new Error(res.data?.message);
    }

    return res.data.deletedEvent;
}

export const updateEvent = async (event: RepairEvent): Promise<RepairEvent> => {
    if (!event) {
        throw new Error("Can't update event. 'event' not defined");
    }
    if (!event._id) {
        throw new Error("Can't update event. 'event._id' not defined");
    }
    if (!event.date) {
        throw new Error("Can't update event. 'event.date' not defined");
    }

    const res = await axios.post(Api.Events.UPDATE_EVENT, { event });
    if (!res.status) {
        throw new Error(res.data?.message);
    }
    if (!res.data?.updatedEvent) {
        throw new Error("Event not found");
    }

    return res.data.updatedEvent;
}

export const getMostRecentEvent = async (): Promise<RepairEvent> => {
  const res = await axios.put(Api.Events.GET_MOST_RECENT_EVENT);
  if (!res.status) {
    throw new Error(res.data?.message);
  }
  if (!res.data?.item) {
    throw new Error("No event found");
  }
  return res.data.mostRecentEvent;
}

export const isoToYyyyMmDd = (isoDate: Date): string => {
    if (!isoDate) {
        return "";
    }
    return isoDate.toISOString().split('T')[0];
}

export const yyyyMmDdToIso = (date: string): Date => {
    if (!date) {
        return new Date();
    }
    return new Date(date);
}