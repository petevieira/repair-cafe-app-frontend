
export const emailIsValid = (email: string): boolean => {
  // Email regular expression that must find a match
  const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
  return reg.test(email);
}

/**
 * checks to make sure `obj` has the required properties
 * @param {object} object - object with the params to check for
 * @param {array} requiredProps - array of required properties as strings
 * @param {string} objectName - name of object to use in error message
 * @returns {bool} - true if valid
 * @returns {string} - explanation string if params are missing
 */
function objectHasRequiredProperties(obj, requiredProps, propNames) {
  let errorMsg = '';

  requiredProps.forEach((prop, idx) => {
    console.debug(`obj[${prop}]: ${obj[prop]}`);
    if (obj[prop] === undefined || obj[prop] === '') {
      if (errorMsg !== '') {
        errorMsg += ', ';
      }
      errorMsg += `${propNames[idx]}`
    }
  });

  if (errorMsg !== '') {
    if ((errorMsg.split(',')).length > 1) {
      errorMsg += ' are required';
    } else {
      errorMsg += ' is required';
    }
  }

  return errorMsg === '' ? true : errorMsg;
}

/**
 * Verifies that the request object has the required parameters
 * @param {object} requestBody - request data
 * @param {array} requiredParams - array of params to check for in the request
 * @returns {bool} - true if valid
 * @returns {string} - error string if invalid
 */
export const objectIsValid = (obj, requiredProps, propNames): boolean|string => {
  return objectHasRequiredProperties(obj, requiredProps, propNames);
}
