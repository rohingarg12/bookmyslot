import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000',
});

// 🔐 Automatically attach token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🚫 Handle auth errors globally
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ API endpoints
export const signup = (user) => client.post('/signup', user);
export const login = (user) => client.post('/login', user);
export const fetchEvents = () => client.get('/events');
export const fetchEvent = (id) => client.get(`/events/${id}`);
export const createEvent = (formData) =>
  client.post('/events', formData, {
    headers: {
      // Let axios/browser set boundary; just specify multipart
      'Content-Type': 'multipart/form-data'
    }
  });
export const bookSlot = (eventId, booking) => client.post(`/events/${eventId}/bookings`, booking);
export const fetchUserBookings = (email) => client.get(`/users/${encodeURIComponent(email)}/bookings`);
