/**
 * Express middleware functions
 */

/**
 * Authentication middleware
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    // Verify token (simplified for testing)
    if (!token) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request (simplified)
    req.user = { id: 'user-123', token };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Request validation middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const data = req.body;
      const errors = {};

      Object.entries(schema).forEach(([field, rules]) => {
        const value = data[field];

        if (rules.required && !value) {
          errors[field] = `${field} is required`;
        } else if (value && rules.type && typeof value !== rules.type) {
          errors[field] = `${field} must be a ${rules.type}`;
        } else if (value && rules.minLength && value.length < rules.minLength) {
          errors[field] = `${field} must be at least ${rules.minLength} characters`;
        }
      });

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      next();
    } catch (error) {
      res.status(400).json({ error: 'Validation error' });
    }
  };
};

/**
 * Rate limiting middleware
 */
export const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);

    next();
  };
};

/**
 * CORS middleware
 */
export const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

/**
 * Request logging middleware
 */
export const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};
