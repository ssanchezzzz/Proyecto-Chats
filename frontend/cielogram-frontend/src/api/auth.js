import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const login = (data) =>
  axios.post(`${API}/api/token/`, data);

export const register = (data) =>
  axios.post(`${API}/users/register/`, data);

export const getProfile = (token) =>
  axios.get(`${API}/users/profiles/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateProfile = (id, data, token) =>
  axios.patch(`${API}/users/profiles/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
