// API URL configuration
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://gazelle-back.onrender.com/api'
  : 'http://localhost:3000/api';