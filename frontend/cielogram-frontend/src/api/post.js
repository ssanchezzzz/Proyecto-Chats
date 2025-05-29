import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

// Interceptor para manejar token expirado
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Posts
export const getPosts = () =>
  axios.get(`${API}/posts/posts/`);

export const getPost = (id) =>
  axios.get(`${API}/posts/posts/${id}/`);

export const createPost = (data, token) =>
  axios.post(`${API}/posts/posts/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

export const updatePost = (id, data, token) =>
  axios.patch(`${API}/posts/posts/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

export const deletePost = (id, token) =>
  axios.delete(`${API}/posts/posts/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Comments
export const getComments = (postId) =>
  axios.get(`${API}/posts/comments/?post=${postId}`);

export const createComment = (data, token) =>
  axios.post(`${API}/posts/comments/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Likes
export const likePost = (postId, token) =>
  axios.post(`${API}/posts/posts/${postId}/like/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
