// Server-side test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost/test_db';

// Mock console methods for cleaner test output
const originalLog = console.log;
const originalWarn = console.warn;

beforeAll(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalLog;
  console.warn = originalWarn;
});
