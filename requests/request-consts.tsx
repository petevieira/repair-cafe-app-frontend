
// import { API_URL } from '@env';
const API_URL = 'http://localhost:3000';

const USERS_PREFIX      = `${API_URL}/users`;
const EVENTS_PREFIX     = `${API_URL}/events`;
const ITEMS_PREFIX      = `${API_URL}/items`;
const ITEM_TYPES_PREFIX = `${API_URL}/items-types`;
const VOLUNTEERS_PREFIX = `${API_URL}/volunteers`;

const Users = {
  EMAIL_IS_REGISTERED: `${USERS_PREFIX}/email-is-registered`,
  EMAIL_IS_REGISTERED_AS_ADMIN: `${USERS_PREFIX}/email-is-registered-as-admin`,
  SIGN_UP:             `${USERS_PREFIX}/sign-up`,
  SIGN_IN:             `${USERS_PREFIX}/sign-in`,
  SIGN_IN_ADMIN:       `${USERS_PREFIX}/sign-in-admin`,
  FORGOT_PASSWORD:     `${USERS_PREFIX}/forgot-password`,
  RESET_PASSWORD:      `${USERS_PREFIX}/reset-password`
};

const Events = {
  ADD_EVENT:           `${EVENTS_PREFIX}/add-event`,
  DELETE_EVENT:        `${EVENTS_PREFIX}/delete-event`,
  UPDATE_EVENT:        `${EVENTS_PREFIX}/update-event`,
  GET_EVENTS:          `${EVENTS_PREFIX}/get-events`,
};

const Items = {
  ADD_ITEM:            `${ITEMS_PREFIX}/add-item`,
  DELETE_ITEM:         `${ITEMS_PREFIX}/delete-item`,
  UPDATE_ITEM:         `${ITEMS_PREFIX}/update-item`,
  GET_ITEM:            `${ITEMS_PREFIX}/get-item`,
  GET_ITEMS:           `${ITEMS_PREFIX}/get-items`,
};

const ItemTypes = {
  ADD_ITEM_TYPE:       `${ITEM_TYPES_PREFIX}/add-item-type`,
  DELETE_ITEM_TYPE:    `${ITEM_TYPES_PREFIX}/delete-item-type`,
  UPDATE_ITEM_TYPE:    `${ITEM_TYPES_PREFIX}/update-item-type`,
  GET_ITEM_TYPE:       `${ITEM_TYPES_PREFIX}/get-item-type`,
  GET_ITEM_TYPES:      `${ITEM_TYPES_PREFIX}/get-item-types`,
  ADD_ITEM_TYPES:      `${ITEM_TYPES_PREFIX}/add-item-types`,
};

const Volunteers = {
  ADD_VOLUNTEER:       `${VOLUNTEERS_PREFIX}/add-volunteer`,
  GET_DAYS_VOLUNTEERS: `${VOLUNTEERS_PREFIX}/get-days-volunteers`,
};

export default { Users, Events, Items, ItemTypes, Volunteers };
