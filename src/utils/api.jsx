// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL;

console.log("[API Service] Using API URL:", API_URL); // Debugging

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    
    return response;
  } catch (error) {
    console.error("[API Error]", error);
    throw error;
  }
};

export const API_ENDPOINTS = {
  LOGIN: "/api/login/",
  REGISTER: "/api/register/",
  USER: "/api/user/",
  LOGOUT: "/api/logout/",
  PASSWORD_RESET_REQUEST: "/api/password/reset/request/",
  PASSWORD_RESET_VERIFY: "/api/password/reset/verify-otp/",
  PASSWORD_RESET_CONFIRM: "/api/password/reset/confirm/",
  GOOGLE_LOGIN: "/api/google/login/",
  GOOGLE_LOGOUT: "/api/google/logout/",
};