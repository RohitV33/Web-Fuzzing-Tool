import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vs_token')
  console.log("TOKEN:", token)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vs_token')
      localStorage.removeItem('vs_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──
export const authAPI = {
  register: (data)  => api.post('/auth/register', data),
  login:    (data)  => api.post('/auth/login', data),
  getMe:    ()      => api.get('/auth/me'),
  updateMe: (data)  => api.put('/auth/me', data),
}

// ── Scans ──
export const scansAPI = {
  start:     (config)     => api.post('/scans', config),
  list:      (params)     => api.get('/scans', { params }),
  get:       (id)         => api.get(`/scans/${id}`),
  getStatus: (id)         => api.get(`/scans/${id}/status`),
  stop:      (id)         => api.post(`/scans/${id}/stop`),
  delete:    (id)         => api.delete(`/scans/${id}`),
}

// ── Reports ──
export const reportsAPI = {
  list:        (params)      => api.get('/reports', { params }),
  get:         (id)          => api.get(`/reports/${id}`),
  getByScanId: (scanId)      => api.get(`/reports/scan/${scanId}`),
  export:      (id, fmt)     => api.get(`/reports/${id}/export?format=${fmt}`, { responseType: fmt === 'csv' ? 'blob' : 'json' }),
  delete:      (id)          => api.delete(`/reports/${id}`),
}

// ── Wordlists ──
export const wordlistsAPI = {
  list: () => api.get('/wordlists'),
  get:  (key) => api.get(`/wordlists/${key}`),
}

// ── Stats ──
export const statsAPI = {
  dashboard: () => api.get('/stats/dashboard'),
}

// ── Health ──
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api
