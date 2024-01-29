import { API_URL } from '@env';

const USERS_PREFIX      = `${API_URL}/users`;
const ITEMS_PREFIX      = `${API_URL}/items`;
const VOLUNTEERS_PREFIX = `${API_URL}/volunteers`;

const Users = {
  USER_IS_ADMIN:       `${USERS_PREFIX}/user-is-admin`,
  SIGN_IN_ADMIN:       `${USERS_PREFIX}/sign-in-admin`,
};

const Items = {
  ADD_BASIC_ITEM:      `${ITEMS_PREFIX}/add-basic-item`,
  ADD_FULL_ITEM:       `${ITEMS_PREFIX}/add-full-item`,
  DELETE_ITEM:         `${ITEMS_PREFIX}/delete-item`,
  UPDATE_ITEM:         `${ITEMS_PREFIX}/update-item`,
  GET_ITEM:            `${ITEMS_PREFIX}/get-item`,
  GET_ITEMS_BASIC:     `${ITEMS_PREFIX}/get-items-basic`,
};

const Volunteers = {
  ADD_VOLUNTEER:       `${VOLUNTEERS_PREFIX}/add-volunteer`,
  GET_VOLUNTEER:       `${VOLUNTEERS_PREFIX}/get-volunteer`,
  DELETE_VOLUNTEER:    `${VOLUNTEERS_PREFIX}/delete-volunteer`,
  UPDATE_VOLUNTEER:    `${VOLUNTEERS_PREFIX}/update-volunteer`,
  GET_DAYS_VOLUNTEERS: `${VOLUNTEERS_PREFIX}/get-days-volunteers`,
};

export default { Users, Items, Volunteers };
