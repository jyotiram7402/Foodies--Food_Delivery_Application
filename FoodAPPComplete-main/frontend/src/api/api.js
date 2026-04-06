import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const credentials = localStorage.getItem('authCredentials')
  if (credentials) {
    config.headers.Authorization = `Basic ${credentials}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authCredentials')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const registerUser = (userType, data) =>
  api.post(`/api/userOnboarding/${userType}`, data)

export const getMe = () =>
  api.get('/api/me')

export const getRestaurants = () =>
  api.get('/api/restaurants')

export const getRestaurantById = (id) =>
  api.get(`/api/restaurants/${id}`)

export const getRestaurantMenu = (id) =>
  api.get(`/api/restaurants/${id}/menu`)

export const placeOrder = (data) =>
  api.post('/api/order/', data)

export const getMyOrders = () =>
  api.get('/api/orders')

export const onboardRestaurant = (data) =>
  api.post('/api/restaurant/onBoarding', data)

export const addMenuItem = (data) =>
  api.post('/api/restaurant/menu', data)

export const getMyRestaurant = () =>
  api.get('/api/restaurant/my')

export const getMyMenuItems = () =>
  api.get('/api/restaurant/my/menu')

export const onboardDriver = (data) =>
  api.post('/api/driver/onBoarding', data)

export default api
