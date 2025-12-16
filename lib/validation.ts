import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone validation (Bulgarian format)
export const phoneSchema = z.string()
  .regex(/^(\+359|0)[0-9]{9}$/, 'Invalid phone number format')
  .optional();

// Shipping address validation
export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: emailSchema,
  phone: z.string().min(6, 'Phone number is required').max(20),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200),
  city: z.string().min(2, 'City must be at least 2 characters').max(100),
  postalCode: z.string().min(4, 'Postal code is required').max(10),
  country: z.string().min(2, 'Country is required').max(100).default('България'),
  notes: z.string().max(500).optional(),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// Review validation
export const reviewSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100).optional(),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
});

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  oldPrice: z.number().positive().optional(),
  discount: z.number().min(0).max(100).optional(),
  image: z.string().url('Invalid image URL'),
  images: z.string(),
  categoryId: z.string().cuid('Invalid category ID'),
  colors: z.string(),
  sizes: z.string(),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
});

// Category validation
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  image: z.string().url('Invalid image URL').optional(),
});

// Order status validation
export const orderStatusSchema = z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

// Discount code validation
export const discountCodeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50).regex(/^[A-Z0-9-]+$/, 'Code must be uppercase alphanumeric'),
  percentage: z.number().min(1, 'Percentage must be at least 1').max(100, 'Percentage must be between 1 and 100'),
  active: z.boolean().default(true),
  expiresAt: z.string().nullable().optional(),
  maxUses: z.number().positive().nullable().optional(),
});

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate and sanitize object
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const validated = schema.parse(data);
  
  // Sanitize string fields
  if (typeof validated === 'object' && validated !== null) {
    Object.keys(validated).forEach((key) => {
      const value = (validated as any)[key];
      if (typeof value === 'string') {
        (validated as any)[key] = sanitizeInput(value);
      }
    });
  }
  
  return validated;
}
