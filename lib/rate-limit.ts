import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  interval: number; // in milliseconds
  maxRequests: number;
}

export function rateLimit(options: RateLimitOptions) {
  return async (request: NextRequest): Promise<{ success: boolean; remaining?: number; reset?: number }> => {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const key = `${ip}:${request.url}`;
    const now = Date.now();
    
    // Clean up expired entries
    if (store[key] && now > store[key].resetTime) {
      delete store[key];
    }
    
    // Initialize or increment
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + options.interval,
      };
      return { 
        success: true, 
        remaining: options.maxRequests - 1,
        reset: store[key].resetTime 
      };
    }
    
    if (store[key].count >= options.maxRequests) {
      return { 
        success: false, 
        remaining: 0,
        reset: store[key].resetTime 
      };
    }
    
    store[key].count++;
    return { 
      success: true, 
      remaining: options.maxRequests - store[key].count,
      reset: store[key].resetTime 
    };
  };
}

// Predefined rate limiters
export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
});

export const strictRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
});
