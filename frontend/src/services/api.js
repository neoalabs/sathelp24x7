import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API service modules
export const authService = {
  login: (formData) => api.post('/auth/login', formData),
  signup: (data) => api.post('/auth/register', data),
};

export const chatService = {
  sendMessage: (message) => api.post('/chat', { message }),
  getHistory: () => api.get('/chat/history'),
};

export const quizService = {
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id) => api.get(`/quiz/${id}`),
  submitQuiz: (data) => api.post('/quiz/submit', data),
};

export const essayService = {
  submitEssay: (content) => api.post('/essay', { content }),
};

export const collegeService = {
  searchColleges: (params) => api.get('/colleges', { params }),
  getScholarships: (params) => api.get('/scholarships', { params }),
};