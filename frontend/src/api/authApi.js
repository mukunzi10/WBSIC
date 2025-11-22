import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
    const token = res.data.token;
    localStorage.setItem('token', token); // Store the token
    return { success: true, token }; // Return success
  } catch (error) {
    console.error('Login failed:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};

export const verifyToken = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};