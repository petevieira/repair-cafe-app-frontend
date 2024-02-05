import { API_URL } from '@env';

const USERS_PREFIX      = `${API_URL}/users`;
const ITEMS_PREFIX      = `${API_URL}/items`;
const VOLUNTEERS_PREFIX = `${API_URL}/volunteers`;
const TEXT_PREFIX       = `${API_URL}/text`;

const Users = {
  USER_IS_ADMIN:           `${USERS_PREFIX}/user-is-admin`,
  SIGN_IN_ADMIN:           `${USERS_PREFIX}/sign-in-admin`,
};

const Items = {
  ADD_BASIC_ITEM:          `${ITEMS_PREFIX}/add-basic-item`,
  ADD_FULL_ITEM:           `${ITEMS_PREFIX}/add-full-item`,
  DELETE_ITEM:             `${ITEMS_PREFIX}/delete-item`,
  UPDATE_ITEM:             `${ITEMS_PREFIX}/update-item`,
  GET_ITEM:                `${ITEMS_PREFIX}/get-item`,
  GET_ITEMS_BASIC:         `${ITEMS_PREFIX}/get-items-basic`,
  FIND_OWNER_BY_EMAIL:     `${ITEMS_PREFIX}/find-owner-by-email`,
};

const Volunteers = {
  ADD_VOLUNTEER:           `${VOLUNTEERS_PREFIX}/add-volunteer`,
  GET_VOLUNTEER:           `${VOLUNTEERS_PREFIX}/get-volunteer`,
  DELETE_VOLUNTEER:        `${VOLUNTEERS_PREFIX}/delete-volunteer`,
  UPDATE_VOLUNTEER:        `${VOLUNTEERS_PREFIX}/update-volunteer`,
  GET_DAYS_VOLUNTEERS:     `${VOLUNTEERS_PREFIX}/get-days-volunteers`,
  GET_PAST_VOLUNTEERS:     `${VOLUNTEERS_PREFIX}/get-past-volunteers`,
  FIND_VOLUNTEER_BY_EMAIL: `${VOLUNTEERS_PREFIX}/find-volunteer-by-email`,
};

const Text = {
  GET_TEXT:                `${TEXT_PREFIX}/get-text`,
};

export default { Users, Items, Volunteers, Text };
