import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== PUBLIC ENDPOINTS ====================

/**
 * Fetch all services with optional filters
 * @param {Object} params - Query parameters (category, search, status)
 * @returns {Promise<Array>} Array of services
 */
export const fetchServices = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/services${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url);
    return response.data.services || response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Fetch a single service by ID
 * @param {String} serviceId - Service ID
 * @returns {Promise<Object>} Service object
 */
export const fetchServiceById = async (serviceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/services/${serviceId}`);
    return response.data.service || response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

/**
 * Fetch service categories with counts
 * @returns {Promise<Array>} Array of categories
 */
export const fetchServiceCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/services/categories/list`);
    return response.data.categories || response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// ==================== CLIENT ENDPOINTS (Protected) ====================

/**
 * Submit a service application
 * @param {Object} applicationData - Application details
 * @returns {Promise<Object>} Created application
 */
export const submitServiceApplication = async (applicationData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/services/applications`,
      applicationData,
      { headers: getAuthHeader() }
    );
    return response.data.application || response.data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

/**
 * Fetch current user's service applications
 * @returns {Promise<Array>} Array of applications
 */
export const fetchMyApplications = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/services/applications/my-applications`,
      { headers: getAuthHeader() }
    );
    return response.data.applications || response.data;
  } catch (error) {
    console.error('Error fetching my applications:', error);
    throw error;
  }
};

// ==================== ADMIN ENDPOINTS (Protected + Admin Only) ====================

/**
 * Create a new service (Admin only)
 * @param {Object} serviceData - Service details
 * @returns {Promise<Object>} Created service
 */
export const createService = async (serviceData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/services`,
      serviceData,
      { headers: getAuthHeader() }
    );
    return response.data.service || response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

/**
 * Update an existing service (Admin only)
 * @param {String} serviceId - Service ID
 * @param {Object} serviceData - Updated service details
 * @returns {Promise<Object>} Updated service
 */
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/services/${serviceId}`,
      serviceData,
      { headers: getAuthHeader() }
    );
    return response.data.service || response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

/**
 * Delete a service (Admin only)
 * @param {String} serviceId - Service ID
 * @returns {Promise<Object>} Success message
 */
export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/services/${serviceId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

/**
 * Fetch all service applications (Admin only)
 * @param {Object} params - Query parameters (status, serviceId)
 * @returns {Promise<Array>} Array of applications
 */
export const fetchAllApplications = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/services/applications/all${queryString ? `?${queryString}` : ''}`;
    const response = await axios.get(url, { headers: getAuthHeader() });
    return response.data.applications || response.data;
  } catch (error) {
    console.error('Error fetching all applications:', error);
    throw error;
  }
};

/**
 * Update application status (Admin only)
 * @param {String} applicationId - Application ID
 * @param {Object} updateData - Status and admin notes
 * @returns {Promise<Object>} Updated application
 */
export const updateApplicationStatus = async (applicationId, updateData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/services/applications/${applicationId}/status`,
      updateData,
      { headers: getAuthHeader() }
    );
    return response.data.application || response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

export default {
  fetchServices,
  fetchServiceById,
  fetchServiceCategories,
  submitServiceApplication,
  fetchMyApplications,
  createService,
  updateService,
  deleteService,
  fetchAllApplications,
  updateApplicationStatus
};