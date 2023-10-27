import axios from 'axios'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

const api = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL,
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookies.get('accessToken')}`,
  },
  timeout: 3000,
})
export default api
