/**
 * @description Logic for requests that go to <api>/repairs/* routes
 */

import axios from 'axios';
import Api from 'requests/request-consts';

export const getText = async (field: string) => {
  if (!field) {
    console.error("Can't get text. 'field' not defined");
    return null;
  }
  return await axios.get(
    Api.Text.GET_TEXT + `/${field}`,
  );
};