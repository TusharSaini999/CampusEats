import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";

// Global Axios Interceptor for injecting JWT Token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global Axios Response Interceptor for handling invalid tokens
axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("id");
    // Only redirect if we are not already on the login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

// Global Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  
  const token = localStorage.getItem("token");
  if (token) {
    const urlStr = typeof resource === 'string' ? resource : (resource instanceof Request ? resource.url : '');
    // Only attach to API requests (optional strictness, but good to add if not external)
    if (urlStr.includes(import.meta.env.VITE_API_URL || 'localhost:4000')) {
      config = config || {};
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
      
      if (resource instanceof Request) {
        // If it's a request object, we recreate it with new headers
        const newHeaders = new Headers(resource.headers);
        newHeaders.set('Authorization', `Bearer ${token}`);
        resource = new Request(resource, { headers: newHeaders });
      }
    }
  }
  const response = await originalFetch(resource, config);
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("id");
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  
  return response;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
