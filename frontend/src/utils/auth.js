/**
 * Authentication utility functions for user authentication and token management.
 */

import { jwtDecode } from 'jwt-decode';

/**
 * Get the stored authentication token
 * @returns {string|null} The auth token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set the authentication token in local storage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove the authentication token from storage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Decode token to check if it's expired
    const decoded = jwtDecode(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    // If token is invalid, consider user not authenticated
    console.error('Error decoding token:', error);
    removeToken();
    return false;
  }
};

/**
 * Get the user information from the token
 * @returns {object|null} User information
 */
export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    removeToken();
    return null;
  }
};