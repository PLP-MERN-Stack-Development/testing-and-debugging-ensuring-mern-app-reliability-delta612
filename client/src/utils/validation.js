/**
 * Validation utilities for form and data validation
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is at least 8 characters
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 8;
};

/**
 * Validates a username
 * @param {string} username - Username to validate
 * @returns {boolean} True if username is 3-20 characters
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  return username.length >= 3 && username.length <= 20;
};

/**
 * Formats a date to readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!(date instanceof Date)) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Truncates text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Converts bytes to readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (!Number.isInteger(bytes) || bytes < 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Checks if a value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if value is empty
 */
export const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};
