// src/utils/validation.js

export const validateLoginForm = (username, password) => {
  if (!username.trim()) {
    return 'Username or email is required';
  }
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};
