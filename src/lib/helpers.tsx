
export const emailIsValid = (email: string): boolean => {
  // Email regular expression that must find a match
  const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
  return reg.test(email);
}