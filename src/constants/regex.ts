export const REGEX = {
  VALID_PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g,
  PHONE: /^[0-9]{10}$/,
  POSITIVE_NUMBER: /^[0-9.]*$/,
  INTEGER: /^[0-9]*$/,
  LINK: /(https?:\/\/\S+)/,
};
