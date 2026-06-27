import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ─── Token helpers ───────────────────────────────────────────────────────────
const getAccessToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

const getRefreshToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth-store');
};

// ─── Request interceptor — inject Bearer token ────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — refresh on 401 ───────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        setTokens(data.accessToken, data.refreshToken);
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── Typed API helpers ────────────────────────────────────────────────────────
export const apiHelpers = {
  auth: {
    login: (data: { email: string; password: string }) =>
      api.post('/auth/login', data).then((r) => r.data),
    register: (data: any) => api.post('/auth/register', data).then((r) => r.data),
    forgotPassword: (email: string) =>
      api.post('/auth/forgot-password', { email }).then((r) => r.data),
    resetPassword: (data: { token: string; password: string; confirmPassword: string }) =>
      api.post('/auth/reset-password', data).then((r) => r.data),
    logout: (refreshToken: string) =>
      api.post('/auth/logout', { refreshToken }).then((r) => r.data),
    me: () => api.get('/auth/me').then((r) => r.data),
  },

  leads: {
    list: (params?: any) => api.get('/leads', { params }).then((r) => r.data),
    get: (id: string) => api.get(`/leads/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/leads', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/leads/${id}`, data).then((r) => r.data),
    archive: (id: string) => api.delete(`/leads/${id}`).then((r) => r.data),
    assign: (id: string, assigneeId: string) =>
      api.put(`/leads/${id}/assign`, { assigneeId }).then((r) => r.data),
    addNote: (id: string, content: string) =>
      api.post(`/leads/${id}/notes`, { content }).then((r) => r.data),
    getTimeline: (id: string) => api.get(`/leads/${id}/timeline`).then((r) => r.data),
  },

  customers: {
    list: (params?: any) => api.get('/customers', { params }).then((r) => r.data),
    get: (id: string) => api.get(`/customers/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/customers', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/customers/${id}`, data).then((r) => r.data),
    addNote: (id: string, content: string) =>
      api.post(`/customers/${id}/notes`, { content }).then((r) => r.data),
  },

  properties: {
    list: (params?: any) => api.get('/properties', { params }).then((r) => r.data),
    get: (id: string) => api.get(`/properties/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/properties', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/properties/${id}`, data).then((r) => r.data),
  },

  deals: {
    list: (params?: any) => api.get('/deals', { params }).then((r) => r.data),
    get: (id: string) => api.get(`/deals/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/deals', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/deals/${id}`, data).then((r) => r.data),
    updateStage: (id: string, stage: string) =>
      api.put(`/deals/${id}/stage`, { stage }).then((r) => r.data),
    addNote: (id: string, content: string) =>
      api.post(`/deals/${id}/notes`, { content }).then((r) => r.data),
  },

  appointments: {
    list: (params?: any) => api.get('/appointments', { params }).then((r) => r.data),
    get: (id: string) => api.get(`/appointments/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/appointments', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/appointments/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/appointments/${id}`).then((r) => r.data),
  },

  tasks: {
    list: (params?: any) => api.get('/tasks', { params }).then((r) => r.data),
    get: (id: string) => api.get(`/tasks/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/tasks', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/tasks/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/tasks/${id}`).then((r) => r.data),
    addComment: (id: string, content: string) =>
      api.post(`/tasks/${id}/comments`, { content }).then((r) => r.data),
  },

  notifications: {
    list: (params?: any) => api.get('/notifications', { params }).then((r) => r.data),
    markAsRead: (id: string) => api.put(`/notifications/${id}/read`).then((r) => r.data),
    markAllAsRead: () => api.post('/notifications/read-all').then((r) => r.data),
  },

  dashboard: {
    getMetrics: () => api.get('/dashboard').then((r) => r.data),
    getActivities: (limit?: number) =>
      api.get('/dashboard/activities', { params: { limit } }).then((r) => r.data),
  },

  reports: {
    leads: (params?: any) => api.get('/reports/leads', { params }).then((r) => r.data),
    deals: (params?: any) => api.get('/reports/deals', { params }).then((r) => r.data),
    properties: (params?: any) => api.get('/reports/properties', { params }).then((r) => r.data),
    agents: (params?: any) => api.get('/reports/agents', { params }).then((r) => r.data),
    appointments: (params?: any) =>
      api.get('/reports/appointments', { params }).then((r) => r.data),
    exportLeadsCsv: (params?: any) =>
      api.get('/reports/export/leads', { params, responseType: 'blob' }).then((r) => r.data),
    exportDealsCsv: (params?: any) =>
      api.get('/reports/export/deals', { params, responseType: 'blob' }).then((r) => r.data),
  },

  users: {
    list: (params?: any) => api.get('/users', { params }).then((r) => r.data),
    get: (id: string) => api.get(`/users/${id}`).then((r) => r.data),
    create: (data: any) => api.post('/users', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/users/${id}`, data).then((r) => r.data),
  },

  branches: {
    list: (params?: any) => api.get('/branches', { params }).then((r) => r.data),
    create: (data: any) => api.post('/branches', data).then((r) => r.data),
    update: (id: string, data: any) => api.put(`/branches/${id}`, data).then((r) => r.data),
  },

  roles: {
    list: () => api.get('/roles').then((r) => r.data),
    create: (data: any) => api.post('/roles', data).then((r) => r.data),
    addPermission: (roleId: string, permissionId: string) =>
      api.post(`/roles/${roleId}/permissions`, { permissionId }).then((r) => r.data),
  },

  auditLogs: {
    list: (params?: any) => api.get('/audit-logs', { params }).then((r) => r.data),
  },

  files: {
    getUploadUrl: (data: any) => api.post('/files/upload-url', data).then((r) => r.data),
  },

  tenant: {
    me: () => api.get('/tenants/me').then((r) => r.data),
    update: (data: any) => api.put('/tenants/me', data).then((r) => r.data),
  },
};
