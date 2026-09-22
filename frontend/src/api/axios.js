import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'

const isLocal = typeof window !== 'undefined'
  ? ['localhost', '127.0.0.1'].includes(window.location.hostname)
  : (process.env.NODE_ENV !== 'production')

const BASE_URL = isLocal
  ? 'http://127.0.0.1:8000/api/v1'
  : 'https://sizning-prod-domeningiz.com/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Har bir so'rovga token qo'shish ────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = Cookies.get('booklab_token') || Cookies.get('token') || (typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token')) : null)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Xatolarni markazlashgan boshqarish ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const detail = error.response?.data?.detail || error.response?.data?.error

    if (status === 401) {
      if (typeof window !== 'undefined') {
        Cookies.remove('booklab_token')
        Cookies.remove('booklab_userId')
        Cookies.remove('token')
        toast.error("Sessiya tugadi, iltimos qayta kiring")
        window.location.href = '/login'
      }
    } else if (status === 404) {
      toast.error(detail || "Ma'lumot topilmadi")
    } else if (status === 403) {
      toast.error("Sizda ruxsat yo'q")
    } else if (status >= 500 || !error.response) {
      toast.error("Server xatosi yuz berdi")
    } else if (detail) {
      toast.error(detail)
    }

    return Promise.reject(error)
  }
)

export default api