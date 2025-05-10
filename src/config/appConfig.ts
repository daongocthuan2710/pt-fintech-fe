const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const APP_CONFIG = {
  API_DOMAIN,
  API_URL,
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
};
