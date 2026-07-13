import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jithender-eventsphere.onrender.com',
})

export default api

