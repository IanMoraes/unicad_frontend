import axios from 'axios'

const api = axios.create({baseURL:'https://unicad-backend.onrender.com/api'})

export default api;