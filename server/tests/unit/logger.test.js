// logger.test.js - Tests for logging and debugging utilities
import {
  Logger,
  GlobalErrorHandler,
  createErrorHandler,
  requestContext,
  performanceMonitoring,
} from '../utils/logger';

describe('Logger', () => {
  let logger;

  beforeEach(() => {
    logger = Logger.getInstance();
    logger.clearLogs();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create singleton instance', () => {
    const instance1 = Logger.getInstance();
    const instance2 = Logger.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should log messages', () => {
    logger.log('Test message', { data: 'test' });

    const logs = logger.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('INFO');
    expect(logs[0].message).toBe('Test message');
  });

  it('should log errors', () => {
    const error = new Error('Test error');
    logger.error('Error occurred', error);

    const logs = logger.getLogs();
    const errorLog = logs.find(log => log.level === 'ERROR');
    expect(errorLog).toBeDefined();
    expect(errorLog.error.message).toBe('Test error');
  });

  it('should log warnings', () => {
    logger.warn('Warning message', { warning: true });

    const logs = logger.getLogs();
    const warnLog = logs.find(log => log.level === 'WARN');
    expect(warnLog).toBeDefined();
    expect(warnLog.message).toBe('Warning message');
  });

  it('should log debug messages in development', () => {
    process.env.NODE_ENV = 'development';
    logger.debug('Debug message', { debug: true });

    const logs = logger.getLogs();
    expect(logs.some(log => log.level === 'DEBUG')).toBe(true);

    process.env.NODE_ENV = 'test';
  });

  it('should clear logs', () => {
    logger.log('Message 1');
    logger.log('Message 2');

    expect(logger.getLogs().length).toBe(2);

    logger.clearLogs();

    expect(logger.getLogs().length).toBe(0);
  });

  it('should get error logs', () => {
    logger.log('Info message');
    logger.error('Error message', new Error('test'));
    logger.log('Another info');

    const errorLogs = logger.getErrorLogs();
    expect(errorLogs.length).toBe(1);
    expect(errorLogs[0].level).toBe('ERROR');
  });

  it('should include timestamps', () => {
    logger.log('Message with timestamp');

    const logs = logger.getLogs();
    expect(logs[0].timestamp).toBeTruthy();
    expect(new Date(logs[0].timestamp)).toBeInstanceOf(Date);
  });
});

describe('GlobalErrorHandler', () => {
  it('should setup process error handlers', () => {
    const onSpy = jest.spyOn(process, 'on');
    GlobalErrorHandler.setupProcess();

    expect(onSpy).toHaveBeenCalledWith('unhandledRejection', expect.any(Function));
    expect(onSpy).toHaveBeenCalledWith('uncaughtException', expect.any(Function));

    onSpy.mockRestore();
  });
});

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', path: '/api/test' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle errors with status code', () => {
    const errorHandler = createErrorHandler();
    const error = new Error('Test error');
    error.status = 400;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it('should default to 500 status code', () => {
    const errorHandler = createErrorHandler();
    const error = new Error('Server error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should include stack in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const errorHandler = createErrorHandler();
    const error = new Error('Dev error');

    errorHandler(error, req, res, next);

    const callArgs = res.json.mock.calls[0][0];
    expect(callArgs.error.stack).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });
});

describe('Request Context Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', path: '/api/test', ip: '127.0.0.1' };
    res = {};
    next = jest.fn();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add requestId to request', () => {
    requestContext(req, res, next);

    expect(req.requestId).toBeTruthy();
    expect(typeof req.requestId).toBe('string');
  });

  it('should call next middleware', () => {
    requestContext(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('Performance Monitoring Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { method: 'GET', path: '/api/test', requestId: 'test-id' };
    res = {
      statusCode: 200,
      on: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set up finish listener', () => {
    performanceMonitoring(req, res, next);

    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should call next middleware', () => {
    performanceMonitoring(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should log slow requests as warnings', () => {
    performanceMonitoring(req, res, next);

    const finishCallback = res.on.mock.calls[0][1];

    // Simulate slow request (>1000ms)
    jest.useFakeTimers();
    performanceMonitoring(req, res, next);
    jest.advanceTimersByTime(1500);
    finishCallback();

    expect(console.warn).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('should log error responses as warnings', () => {
    res.statusCode = 404;
    performanceMonitoring(req, res, next);

    const finishCallback = res.on.mock.calls[0][1];
    finishCallback();

    expect(console.warn).toHaveBeenCalled();
  });
});
