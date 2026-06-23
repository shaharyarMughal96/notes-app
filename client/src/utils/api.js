import axios from 'axios';

const api = axios.create({
  baseURL: 'https://notes-app-914r.onrender.com/api',
});

export const fetchNotes = (params = {}) => api.get('/notes', { params });
export const fetchNote = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const fetchTags = () => api.get('/notes/meta/tags');

export default api;