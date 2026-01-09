import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Validation Utils', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('user.name@domain.co.uk')).toBe(true);
      expect(emailRegex.test('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      expect(emailRegex.test('invalid')).toBe(false);
      expect(emailRegex.test('missing@domain')).toBe(false);
      expect(emailRegex.test('@nodomain.com')).toBe(false);
      expect(emailRegex.test('spaces in@email.com')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should require minimum 8 characters', () => {
      const isValidLength = (password: string) => password.length >= 8;
      
      expect(isValidLength('short')).toBe(false);
      expect(isValidLength('longenough')).toBe(true);
    });

    it('should require uppercase letter', () => {
      const hasUppercase = (password: string) => /[A-Z]/.test(password);
      
      expect(hasUppercase('alllowercase')).toBe(false);
      expect(hasUppercase('hasUppercase')).toBe(true);
    });

    it('should require lowercase letter', () => {
      const hasLowercase = (password: string) => /[a-z]/.test(password);
      
      expect(hasLowercase('ALLUPPERCASE')).toBe(false);
      expect(hasLowercase('HasLowercase')).toBe(true);
    });

    it('should require number', () => {
      const hasNumber = (password: string) => /[0-9]/.test(password);
      
      expect(hasNumber('NoNumbers')).toBe(false);
      expect(hasNumber('Has1Number')).toBe(true);
    });
  });

  describe('Price Validation', () => {
    it('should validate positive prices', () => {
      const isValidPrice = (price: number) => price > 0 && isFinite(price);
      
      expect(isValidPrice(10.99)).toBe(true);
      expect(isValidPrice(0)).toBe(false);
      expect(isValidPrice(-5)).toBe(false);
      expect(isValidPrice(Infinity)).toBe(false);
    });

    it('should handle decimal precision', () => {
      const formatPrice = (price: number) => Math.round(price * 100) / 100;
      
      expect(formatPrice(10.999)).toBe(11);
      expect(formatPrice(10.994)).toBe(10.99);
      expect(formatPrice(10.995)).toBe(11);
    });
  });

  describe('Quantity Validation', () => {
    it('should validate positive integers', () => {
      const isValidQuantity = (qty: number) => Number.isInteger(qty) && qty > 0;
      
      expect(isValidQuantity(1)).toBe(true);
      expect(isValidQuantity(100)).toBe(true);
      expect(isValidQuantity(0)).toBe(false);
      expect(isValidQuantity(-1)).toBe(false);
      expect(isValidQuantity(1.5)).toBe(false);
    });

    it('should respect maximum quantity limits', () => {
      const MAX_QUANTITY = 99;
      const isWithinLimit = (qty: number) => qty <= MAX_QUANTITY;
      
      expect(isWithinLimit(50)).toBe(true);
      expect(isWithinLimit(99)).toBe(true);
      expect(isWithinLimit(100)).toBe(false);
    });
  });

  describe('Input Sanitization', () => {
    it('should escape HTML special characters', () => {
      const sanitizeHtml = (input: string) => {
        return input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
      };

      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should trim whitespace', () => {
      const sanitize = (input: string) => input.trim();
      
      expect(sanitize('  hello  ')).toBe('hello');
      expect(sanitize('\n\ttest\n')).toBe('test');
    });
  });
});
