import { API_URL } from '@env';

const USERS_PREFIX      = `${API_URL}/users`;
const ITEMS_PREFIX      = `${API_URL}/items`;
const VOLUNTEERS_PREFIX = `${API_URL}/volunteers`;
const TEXT_PREFIX       = `${API_URL}/text`;

const Users = {
    EMAIL_IS_REGISTERED:           `${USERS_PREFIX}/email-is-registered`,
    SIGN_IN:                       `${USERS_PREFIX}/sign-in`,
    USER_IS_ADMIN:                 `${USERS_PREFIX}/user-is-admin`,
};

const Items = {
    ADD_BASIC_ITEM:                `${ITEMS_PREFIX}/add-basic-item`,
    ADD_FULL_ITEM:                 `${ITEMS_PREFIX}/add-full-item`,
    DELETE_ITEM:                   `${ITEMS_PREFIX}/delete-item`,
    UPDATE_ITEM:                   `${ITEMS_PREFIX}/update-item`,
    GET_ITEM:                      `${ITEMS_PREFIX}/get-item`,
    GET_ITEMS_BASIC:               `${ITEMS_PREFIX}/get-items-basic`,
    FIND_OWNER_BY_EMAIL:           `${ITEMS_PREFIX}/find-owner-by-email`,
    FIND_INCOMPLETE_ITEMS_BY_OWNER:`${ITEMS_PREFIX}/find-incomplete-items-by-owner`,
    FIND_PREVIOUS_EVENT_DATE:      `${ITEMS_PREFIX}/find-previous-event-date`,
    FIND_NEXT_EVENT_DATE:          `${ITEMS_PREFIX}/find-next-event-date`,
};

const Volunteers = {
    ADD_VOLUNTEER:                 `${VOLUNTEERS_PREFIX}/add-volunteer`,
    GET_VOLUNTEER:                 `${VOLUNTEERS_PREFIX}/get-volunteer`,
    DELETE_VOLUNTEER:              `${VOLUNTEERS_PREFIX}/delete-volunteer`,
    UPDATE_VOLUNTEER:              `${VOLUNTEERS_PREFIX}/update-volunteer`,
    GET_DAYS_VOLUNTEERS:           `${VOLUNTEERS_PREFIX}/get-days-volunteers`,
    GET_PAST_VOLUNTEERS:           `${VOLUNTEERS_PREFIX}/get-past-volunteers`,
    FIND_VOLUNTEER_BY_EMAIL:       `${VOLUNTEERS_PREFIX}/find-volunteer-by-email`,
};

const Events = {
    CREATE_EVENT:                  `${API_URL}/events/create-event`,
    DELETE_EVENT_BY_ID:            `${API_URL}/events/delete-event-by-id`,
    UPDATE_EVENT:                  `${API_URL}/events/update-event`,
    GET_EVENT_BY_ID:               `${API_URL}/events/get-event-by-id`,
    GET_EVENTS:                    `${API_URL}/events/get-events`,
    GET_MOST_RECENT_EVENT:         `${API_URL}/events/get-most-recent-event`,
};

const Text = {
    GET_TEXT:                      `${TEXT_PREFIX}/get-text`,
};

const Subscribers = {
    SUBSCRIBE_EMAIL_TO_NEWSLETTER: `${API_URL}/subscribers/add-subscriber`,
    UNSUBSCRIBE_EMAIL_FROM_NEWSLETTER: `${API_URL}/subscribers/delete-subscriber`,
};

export default { Users, Items, Volunteers, Events, Text, Subscribers };
