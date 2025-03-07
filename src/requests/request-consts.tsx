import { API_URL } from '@env';

const REPAIRS_PREFIX       = `${API_URL}/repairs`;
const REPAIR_EVENTS_PREFIX = `${API_URL}/repair-events`;
const SUBSCRIBERS_PREFIX   = `${API_URL}/subscribers`;
const TEXT_PREFIX          = `${API_URL}/text`;
const USERS_PREFIX         = `${API_URL}/users`;
const VOLUNTEERS_PREFIX    = `${API_URL}/volunteers`;

const Root = {
    CHECK_SERVER_HEALTH:             `${API_URL}/`,
}

const Repairs = {
    ADD_BASIC_REPAIR:                `${REPAIRS_PREFIX}/add-basic-repair`,
    ADD_FULL_REPAIR:                 `${REPAIRS_PREFIX}/add-full-repair`,
    DELETE_REPAIR:                   `${REPAIRS_PREFIX}/delete-repair`,
    UPDATE_REPAIR:                   `${REPAIRS_PREFIX}/update-repair`,
    GET_REPAIR:                      `${REPAIRS_PREFIX}/get-repair`,
    GET_REPAIRS_BASIC:               `${REPAIRS_PREFIX}/get-repairs-basic`,
    FIND_OWNER_BY_EMAIL:             `${REPAIRS_PREFIX}/find-owner-by-email`,
    FIND_INCOMPLETE_REPAIRS_BY_OWNER:`${REPAIRS_PREFIX}/find-incomplete-repairs-by-owner`,
};

const RepairEvents = {
    CREATE_EVENT:                  `${REPAIR_EVENTS_PREFIX}/create-event`,
    DELETE_EVENT_BY_ID:            `${REPAIR_EVENTS_PREFIX}/delete-event-by-id`,
    UPDATE_EVENT:                  `${REPAIR_EVENTS_PREFIX}/update-event`,
    GET_EVENT_BY_ID:               `${REPAIR_EVENTS_PREFIX}/get-event-by-id`,
    GET_EVENTS:                    `${REPAIR_EVENTS_PREFIX}/get-events`,
    GET_MOST_RECENT_EVENT:         `${REPAIR_EVENTS_PREFIX}/get-most-recent-event`,
    FIND_PREVIOUS_EVENT:           `${REPAIR_EVENTS_PREFIX}/find-previous-event`,
    FIND_NEXT_EVENT:               `${REPAIR_EVENTS_PREFIX}/find-next-event`,
};

const Subscribers = {
    SUBSCRIBE_EMAIL_TO_NEWSLETTER:     `${SUBSCRIBERS_PREFIX}/add-subscriber`,
    UNSUBSCRIBE_EMAIL_FROM_NEWSLETTER: `${SUBSCRIBERS_PREFIX}/delete-subscriber`,
    IS_EMAIL_SUBSCRIBED:               `${SUBSCRIBERS_PREFIX}/is-email-subscribed`,
};

const Text = {
    GET_TEXT:                      `${TEXT_PREFIX}/get-text`,
};

const Users = {
    EMAIL_IS_REGISTERED:           `${USERS_PREFIX}/email-is-registered`,
    SIGN_IN:                       `${USERS_PREFIX}/sign-in`,
    USER_IS_ADMIN:                 `${USERS_PREFIX}/signed-in-user-is-admin`,
};

const Volunteers = {
    ADD_VOLUNTEER:                 `${VOLUNTEERS_PREFIX}/add-volunteer`,
    GET_VOLUNTEER:                 `${VOLUNTEERS_PREFIX}/get-volunteer`,
    DELETE_VOLUNTEER:              `${VOLUNTEERS_PREFIX}/delete-volunteer`,
    UPDATE_VOLUNTEER:              `${VOLUNTEERS_PREFIX}/update-volunteer`,
    GET_DAYS_VOLUNTEERS:           `${VOLUNTEERS_PREFIX}/get-days-volunteers`,
    GET_PAST_VOLUNTEERS:           `${VOLUNTEERS_PREFIX}/get-past-volunteers`,
    GET_VOLUNTEERS_BY_EVENT:       `${VOLUNTEERS_PREFIX}/get-volunteers-by-event`,
    FIND_VOLUNTEER_BY_EMAIL:       `${VOLUNTEERS_PREFIX}/find-volunteer-by-email`,
};

export default {
    Root,
    Repairs,
    RepairEvents,
    Subscribers,
    Text,
    Users,
    Volunteers
};
