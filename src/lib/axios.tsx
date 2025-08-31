import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://zaraschool-05bf2031623e.herokuapp.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to include the auth token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    // If token exists, add it to the authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // If we get a 401 and we're not on the login page, we should redirect to login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/signin')) {
        // Clear any stored authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
