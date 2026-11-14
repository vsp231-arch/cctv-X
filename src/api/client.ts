/**
 * CCTV-X API Client
 * Centralised axios instance with base URL from env vars.
 */

import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor – attach auth token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cctvx_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor – normalise errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  },
)

// ── Type Definitions ────────────────────────────────────────────────────────

export interface HealthComponents {
  api: 'ok' | 'degraded'
  database: 'ok' | 'degraded'
  database_error?: string
}

export interface HealthResponse {
  status: 'healthy' | 'degraded'
  version: string
  environment: string
  timestamp: string
  uptime_seconds: number
  components: HealthComponents
}

// ── Health API ───────────────────────────────────────────────────────────────

export const healthApi = {
  check: (): Promise<HealthResponse> =>
    apiClient.get<HealthResponse>('/api/v1/health').then((r) => r.data),
}

// ── Camera Types ─────────────────────────────────────────────────────────────

export type CameraProtocol = 'rtsp' | 'rtmp' | 'http' | 'https' | 'file'
export type CameraStatus   = 'active' | 'inactive' | 'error'

export interface Camera {
  id: number
  name: string
  description: string | null
  location: string | null
  stream_url: string
  protocol: CameraProtocol
  status: CameraStatus
  is_active: boolean
  resolution_width: number | null
  resolution_height: number | null
  fps: number | null
  created_at: string
  updated_at: string
}

export interface CameraCreate {
  name: string
  stream_url: string
  protocol?: CameraProtocol
  description?: string | null
  location?: string | null
  is_active?: boolean
  resolution_width?: number | null
  resolution_height?: number | null
  fps?: number | null
}

export interface CameraUpdate {
  name?: string
  description?: string | null
  location?: string | null
  stream_url?: string
  protocol?: CameraProtocol
  status?: CameraStatus
  is_active?: boolean
  resolution_width?: number | null
  resolution_height?: number | null
  fps?: number | null
}

export interface CameraListResponse {
  total: number
  page: number
  page_size: number
  items: Camera[]
}

// ── Cameras API ───────────────────────────────────────────────────────────────

export const camerasApi = {
  list: (params?: {
    page?: number
    page_size?: number
    status?: CameraStatus
    is_active?: boolean
  }): Promise<CameraListResponse> =>
    apiClient.get<CameraListResponse>('/api/v1/cameras', { params }).then((r) => r.data),

  get: (id: number): Promise<Camera> =>
    apiClient.get<Camera>(`/api/v1/cameras/${id}`).then((r) => r.data),

  create: (payload: CameraCreate): Promise<Camera> =>
    apiClient.post<Camera>('/api/v1/cameras', payload).then((r) => r.data),

  update: (id: number, payload: CameraUpdate): Promise<Camera> =>
    apiClient.patch<Camera>(`/api/v1/cameras/${id}`, payload).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/api/v1/cameras/${id}`).then(() => undefined),

  toggle: (id: number): Promise<Camera> =>
    apiClient.patch<Camera>(`/api/v1/cameras/${id}/toggle`).then((r) => r.data),
}
