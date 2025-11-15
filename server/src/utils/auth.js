/**
 * Server-side utility functions
 */

/**
 * Generates a JWT token
 * @param {Object} payload - Data to encode in token
 * @param {string} secret - JWT secret key
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '24h') => {
  // This is a simplified mock - in real app use jsonwebtoken package
  return Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64');
};

/**
 * Verifies a JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - JWT secret key
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Hashes a password (simplified for testing)
 * @param {string} password - Password to hash
 * @returns {string} Hashed password
 */
export const hashPassword = (password) => {
  // In real app use bcrypt
  return Buffer.from(password).toString('base64');
};

/**
 * Compares password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} Passwords match
 */
export const comparePassword = (password, hash) => {
  return Buffer.from(password).toString('base64') === hash;
};

/**
 * Generates a slug from text
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const generateSlug = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Validates an email format
 * @param {string} email - Email to validate
 * @returns {boolean} Valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

/**
 * Generates a random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Paginates data
 * @param {Array} data - Data to paginate
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Paginated data with metadata
 */
export const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      pages: Math.ceil(data.length / limit),
    },
  };
};

/**
 * Filters data based on query
 * @param {Array} data - Data to filter
 * @param {Object} query - Filter criteria
 * @returns {Array} Filtered data
 */
export const filterData = (data, query) => {
  return data.filter(item => {
    return Object.entries(query).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      return item[key] == value;
    });
  });
};
