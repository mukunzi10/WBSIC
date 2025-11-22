import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const handleLogin = async (credentials) => {
  const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
  const token = res.data.token;
  localStorage.setItem('token', token); // MUST store token
};



/**
 * Get axios config with Authorization header.
 * Returns null if token is missing instead of throwing.
 */
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null; // Return null instead of throwing
  }
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

/**
 * Fetch complaints for the logged-in user
 */
export const fetchMyComplaints = async () => {
  try {
    const config = getAuthConfig();
    if (!config) {
      throw new Error('No auth token found. User must be logged in.');
    }
    const res = await axios.get(`${API_BASE}/complaints/my-complaints`, config);
    return Array.isArray(res.data.complaints) ? res.data.complaints : [];
  } catch (error) {
    console.error('Failed to fetch complaints:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Submit a new complaint
 * @param {Object} complaintData - { subject, category, policyNumber, description, priority }
 */
export const submitComplaint = async (complaintData) => {
  try {
    const res = await axios.post(`${API_BASE}/complaints/addComplaints`, complaintData, getAuthConfig());
    return res.data.complaint;
  } catch (error) {
    console.error('Failed to submit complaint:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Optional: Fetch all complaints (for admin)
 */
export const fetchAllComplaints = async () => {
  try {
    const res = await axios.get(`${API_BASE}/complaints`, getAuthConfig());
    return Array.isArray(res.data.complaints) ? res.data.complaints : [];
  } catch (error) {
    console.error('Failed to fetch all complaints:', error.response?.data || error.message);
    throw error;
  }
};
