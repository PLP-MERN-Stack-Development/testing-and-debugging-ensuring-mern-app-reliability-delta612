/**
 * Server-side debugging and logging utilities
 */

export class Logger {
  static instance = null;
  logs = [];

  static getInstance() {
    if (!this.instance) {
      this.instance = new Logger();
    }
    return this.instance;
  }

  log(message, data = {}) {
    const logEntry = {
      level: 'INFO',
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(logEntry);
    console.log(`[INFO] ${message}`, data);
  }

  error(message, error = {}) {
    const logEntry = {
      level: 'ERROR',
      message,
      error: {
        message: error.message || error,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
    };
    this.logs.push(logEntry);
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message, data = {}) {
    const logEntry = {
      level: 'WARN',
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(logEntry);
    console.warn(`[WARN] ${message}`, data);
  }

  debug(message, data = {}) {
    const logEntry = {
      level: 'DEBUG',
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.logs.push(logEntry);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  getErrorLogs() {
    return this.logs.filter(log => log.level === 'ERROR');
  }
}

/**
 * Global error handler
 */
export class GlobalErrorHandler {
  static setupProcess() {
    const logger = Logger.getInstance();

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', {
        reason: reason?.message || String(reason),
        promise,
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', error);
      // In production, may want to exit process
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
  }
}

/**
 * Express error handling middleware
 */
export const createErrorHandler = () => {
  return (err, req, res, next) => {
    const logger = Logger.getInstance();
    logger.error('Request error', {
      method: req.method,
      path: req.path,
      error: err.message,
    });

    const statusCode = err.statusCode || err.status || 500;
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(statusCode).json({
      error: {
        message: err.message || 'Internal server error',
        status: statusCode,
        ...(isDevelopment && {
          stack: err.stack,
          details: err.details,
        }),
      },
    });
  };
};

/**
 * Request context middleware for tracking
 */
export const requestContext = (req, res, next) => {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.requestId = requestId;
  
  const logger = Logger.getInstance();
  logger.debug('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  next();
};

/**
 * Performance monitoring middleware
 */
export const performanceMonitoring = (req, res, next) => {
  const startTime = Date.now();
  const logger = Logger.getInstance();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const slow = duration > 1000; // Slow request threshold

    if (slow || res.statusCode >= 400) {
      logger.warn(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`, {
        requestId: req.requestId,
        slow,
      });
    } else {
      logger.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`, {
        requestId: req.requestId,
      });
    }
  });

  next();
};
