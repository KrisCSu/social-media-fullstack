import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const register = (userData) => axios.post(`${API_BASE_URL}/register`, userData);

export const login = (userData) => axios.post(`${API_BASE_URL}/login`, userData);

export const fetchMessages = () => axios.get(`${API_BASE_URL}/messages`);

export const postMessage = (message) => axios.post(`${API_BASE_URL}/messages`, message);

export const fetchComments = (messageId) =>
  axios.get(`${API_BASE_URL}/messages/${messageId}/comments`);

export const postComment = (comment) => axios.post(`${API_BASE_URL}/comments`, comment);