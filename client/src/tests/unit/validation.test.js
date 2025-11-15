// validation.test.js - Unit tests for validation utilities
import {
  validateEmail,
  validatePassword,
  validateUsername,
  formatDate,
  truncateText,
  formatFileSize,
  capitalize,
  isEmpty,
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate a correct email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });

    it('should handle emails with whitespace', () => {
      expect(validateEmail('  user@example.com  ')).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords with at least 8 characters', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('P@ssw0rd!')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('should reject short passwords', () => {
      expect(validatePassword('pass')).toBe(false);
      expect(validatePassword('1234567')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should validate usernames between 3-20 characters', () => {
      expect(validateUsername('user')).toBe(true);
      expect(validateUsername('john_doe')).toBe(true);
      expect(validateUsername('user_with_long_name_123')).toBe(false); // Too long
    });

    it('should reject short usernames', () => {
      expect(validateUsername('ab')).toBe(false);
      expect(validateUsername('')).toBe(false);
      expect(validateUsername(null)).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format a date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toContain('January');
      expect(formatDate(date)).toContain('15');
    });

    it('should return empty string for invalid input', () => {
      expect(formatDate('2024-01-15')).toBe('');
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 10);
      expect(result).toBe('This is a ...');
      expect(result.length).toBeLessThanOrEqual(13);
    });

    it('should not truncate text shorter than max length', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('should use default max length of 50', () => {
      const text = 'a'.repeat(55);
      expect(truncateText(text)).toBe('a'.repeat(50) + '...');
    });

    it('should handle invalid input', () => {
      expect(truncateText(null)).toBe('');
      expect(truncateText(undefined)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle zero and invalid input', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(-100)).toBe('0 B');
      expect(formatFileSize(null)).toBe('0 B');
    });
  });

  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('javaScript')).toBe('Javascript');
    });

    it('should handle invalid input', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });

  describe('isEmpty', () => {
    it('should detect empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should detect non-empty values', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });
});
