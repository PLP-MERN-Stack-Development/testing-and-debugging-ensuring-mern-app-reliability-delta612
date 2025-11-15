// auth.test.js - Unit tests for authentication utilities
import {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateSlug,
  isValidEmail,
  generateId,
  paginate,
  filterData,
} from '../utils/auth';

describe('Authentication Utilities', () => {
  describe('generateToken', () => {
    it('should generate a token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = generateToken(payload);
      
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should generate different tokens for different payloads', () => {
      const token1 = generateToken({ userId: '1' });
      const token2 = generateToken({ userId: '2' });
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded.userId).toBe('123');
      expect(decoded.email).toBe('test@example.com');
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow('Invalid token');
    });

    it('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow('Invalid token');
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', () => {
      const password = 'myPassword123';
      const hash = hashPassword(password);
      
      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);
    });

    it('should generate same hash for same password', () => {
      const password = 'myPassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      expect(hash1).toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', () => {
      const password = 'myPassword123';
      const hash = hashPassword(password);
      
      expect(comparePassword(password, hash)).toBe(true);
    });

    it('should return false for non-matching password and hash', () => {
      const password = 'myPassword123';
      const wrongPassword = 'wrongPassword';
      const hash = hashPassword(password);
      
      expect(comparePassword(wrongPassword, hash)).toBe(false);
    });
  });

  describe('generateSlug', () => {
    it('should generate slug from text', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('My Test Post')).toBe('my-test-post');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello @World!')).toBe('hello-world');
      expect(generateSlug('Test #Post')).toBe('test-post');
    });

    it('should convert to lowercase', () => {
      expect(generateSlug('HELLO WORLD')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('Hello   World')).toBe('hello-world');
    });

    it('should handle empty input', () => {
      expect(generateSlug('')).toBe('');
      expect(generateSlug(null)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should handle non-string input', () => {
      expect(isValidEmail(123)).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate an ID', () => {
      const id = generateId();
      
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('should generate ID with specified length', () => {
      const id = generateId(12);
      
      expect(id.length).toBe(12);
    });

    it('should generate different IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
    });
  });

  describe('paginate', () => {
    const testData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    it('should paginate data correctly', () => {
      const result = paginate(testData, 1, 10);
      
      expect(result.data.length).toBe(10);
      expect(result.data[0].id).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should calculate correct page count', () => {
      const result = paginate(testData, 1, 10);
      
      expect(result.pagination.pages).toBe(3);
      expect(result.pagination.total).toBe(25);
    });

    it('should get correct page 2', () => {
      const result = paginate(testData, 2, 10);
      
      expect(result.data[0].id).toBe(11);
      expect(result.data.length).toBe(10);
    });

    it('should get correct last page', () => {
      const result = paginate(testData, 3, 10);
      
      expect(result.data[0].id).toBe(21);
      expect(result.data.length).toBe(5);
    });
  });

  describe('filterData', () => {
    const testData = [
      { id: 1, name: 'John', role: 'admin' },
      { id: 2, name: 'Jane', role: 'user' },
      { id: 3, name: 'Bob', role: 'user' },
    ];

    it('should filter data by single criteria', () => {
      const result = filterData(testData, { role: 'user' });
      
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Jane');
    });

    it('should filter data by multiple criteria', () => {
      const result = filterData(testData, { name: 'John', role: 'admin' });
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(1);
    });

    it('should return all data when no filter applied', () => {
      const result = filterData(testData, {});
      
      expect(result.length).toBe(3);
    });

    it('should return empty array when no match', () => {
      const result = filterData(testData, { role: 'admin', name: 'Jane' });
      
      expect(result.length).toBe(0);
    });
  });
});
