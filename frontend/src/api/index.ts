import axios from 'axios';
import { CollegeQuery, AuthResponse, CollegesResponse, College, FiltersData, PredictorResult, ThreadsResponse, ThreadDetail, ThreadQuery } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  },
);

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string }): Promise<AuthResponse> =>
    api.post('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }): Promise<AuthResponse> =>
    api.post('/auth/login', data).then((r) => r.data),
};

// Colleges
export const collegesApi = {
  getAll: (query: CollegeQuery = {}): Promise<CollegesResponse> => {
    const params = Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ''));
    return api.get('/colleges', { params }).then((r) => r.data);
  },
  getBySlug: (slug: string): Promise<College> => api.get(`/colleges/${slug}`).then((r) => r.data),
  getFeatured: (): Promise<College[]> => api.get('/colleges/featured').then((r) => r.data),
  getFilters: (): Promise<FiltersData> => api.get('/colleges/filters').then((r) => r.data),
};

// Compare
export const compareApi = {
  compare: (ids: string[]): Promise<College[]> =>
    api.get('/compare', { params: { ids: ids.join(',') } }).then((r) => r.data),
};

// Saved
export const savedApi = {
  getAll: (): Promise<College[]> => api.get('/saved').then((r) => r.data),
  getIds: (): Promise<string[]> => api.get('/saved/ids').then((r) => r.data),
  save: (collegeId: string) => api.post(`/saved/${collegeId}`).then((r) => r.data),
  unsave: (collegeId: string) => api.delete(`/saved/${collegeId}`).then((r) => r.data),
};

// Predictor
export const predictorApi = {
  predict: (params: { exam: string; rank: number; category: string }): Promise<PredictorResult[]> =>
    api.get('/predict', { params }).then((r) => r.data),
};

// Discussions
export const discussionsApi = {
  getAll: (query: ThreadQuery = {}): Promise<ThreadsResponse> => {
    const params = Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== ''));
    return api.get('/discussions', { params }).then((r) => r.data);
  },
  getById: (id: string): Promise<ThreadDetail> => api.get(`/discussions/${id}`).then((r) => r.data),
  create: (data: { title: string; body: string; category: string; collegeId?: string }) =>
    api.post('/discussions', data).then((r) => r.data),
  addAnswer: (threadId: string, body: string) =>
    api.post(`/discussions/${threadId}/answers`, { body }).then((r) => r.data),
  voteThread: (id: string) => api.post(`/discussions/${id}/vote`).then((r) => r.data),
  voteAnswer: (id: string) => api.post(`/discussions/answers/${id}/vote`).then((r) => r.data),
  acceptAnswer: (id: string) => api.patch(`/discussions/answers/${id}/accept`).then((r) => r.data),
};

