/**
 * Interceptors for Axios requests
 * These are used to prevent opaque errors from being unhandled,
 * like CORS issues, which don't return a status code.
 */

import axios from 'axios';

// If there's a response error that's undefined display this message
const axiosInterceptor = axios.interceptors.response.use(
  (response) => response, (error) => {

  if (typeof error.response === 'undefined') {
    console.error("cors error: ", error);
    console.error('A network error occurred. '
      + 'This could be a CORS issue or a dropped internet connection. '
      + 'It is not possible for us to know.');
    // alert('A network error occurred. '
    //   + 'This could be a CORS issue or a dropped internet connection. '
    //   + 'It is not possible for us to know.')
  }
  return Promise.reject(error)
})

export default axiosInterceptor;
