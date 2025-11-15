// middleware.test.js - Unit tests for middleware
import {
  authMiddleware,
  errorHandler,
  validateRequest,
  rateLimit,
  corsMiddleware,
  loggingMiddleware,
} from '../middleware';

describe('Middleware Functions', () => {
  describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should return 401 if no authorization header', () => {
      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should extract token from Bearer header', () => {
      req.headers.authorization = 'Bearer test-token-123';

      authMiddleware(req, res, next);

      expect(req.user.token).toBe('test-token-123');
      expect(next).toHaveBeenCalled();
    });

    it('should use token directly if not Bearer format', () => {
      req.headers.authorization = 'test-token-123';

      authMiddleware(req, res, next);

      expect(req.user.token).toBe('test-token-123');
      expect(next).toHaveBeenCalled();
    });

    it('should attach user object to request', () => {
      req.headers.authorization = 'Bearer valid-token';

      authMiddleware(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBeDefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('errorHandler', () => {
    let req, res;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      process.env.NODE_ENV = 'test';
    });

    it('should handle errors with status code', () => {
      const error = new Error('Test error');
      error.status = 400;

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: 'Test error',
          status: 400,
        },
      });
    });

    it('should return 500 for errors without status code', () => {
      const error = new Error('Internal error');

      errorHandler(error, req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('validateRequest', () => {
    let req, res, next;

    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should pass valid request', () => {
      const schema = {
        email: { required: true, type: 'string' },
        password: { required: true, type: 'string', minLength: 8 },
      };

      req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const validator = validateRequest(schema);
      validator(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject missing required fields', () => {
      const schema = {
        email: { required: true, type: 'string' },
      };

      req = { body: {} };

      const validator = validateRequest(schema);
      validator(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { email: 'email is required' },
      });
    });

    it('should validate field types', () => {
      const schema = {
        age: { required: true, type: 'number' },
      };

      req = { body: { age: 'not-a-number' } };

      const validator = validateRequest(schema);
      validator(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should validate minimum length', () => {
      const schema = {
        password: { required: true, type: 'string', minLength: 8 },
      };

      req = { body: { password: 'short' } };

      const validator = validateRequest(schema);
      validator(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('rateLimit', () => {
    let req, res, next;

    beforeEach(() => {
      req = { ip: '127.0.0.1' };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it('should allow requests within limit', () => {
      const middleware = rateLimit(3, 1000);

      middleware(req, res, next);
      middleware(req, res, next);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(3);
    });

    it('should reject requests exceeding limit', () => {
      const middleware = rateLimit(2, 1000);

      middleware(req, res, next);
      middleware(req, res, next);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({ error: 'Too many requests' });
    });
  });

  describe('corsMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = { method: 'GET' };
      res = {
        header: jest.fn(),
        sendStatus: jest.fn(),
      };
      next = jest.fn();
    });

    it('should set CORS headers', () => {
      corsMiddleware(req, res, next);

      expect(res.header).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        '*'
      );
      expect(next).toHaveBeenCalled();
    });

    it('should handle OPTIONS requests', () => {
      req.method = 'OPTIONS';

      corsMiddleware(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('loggingMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = { method: 'GET', path: '/api/test' };
      res = { on: jest.fn() };
      next = jest.fn();
    });

    it('should call next', () => {
      loggingMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should set up finish listener', () => {
      loggingMiddleware(req, res, next);

      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });
  });
});
