/**
 * API utilities for request handling and tracing
 */
import { NextRequest, NextResponse } from 'next/server';
import { createLogger, getRequestId } from './logger';
import { ZodError } from 'zod';

// Response with request ID header
export function jsonResponse(
  data: unknown,
  requestId: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      'x-request-id': requestId,
    },
  });
}

// Error response with consistent structure
export function errorResponse(
  message: string,
  requestId: string,
  status: number = 500,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      requestId,
      ...(process.env.NODE_ENV !== 'production' && details ? { details } : {}),
    },
    {
      status,
      headers: {
        'x-request-id': requestId,
      },
    }
  );
}

// Type for API handler function
type ApiHandler = (
  request: NextRequest,
  context: { params?: Promise<Record<string, string>> },
  logger: ReturnType<typeof createLogger>,
  requestId: string
) => Promise<NextResponse>;

// Wrap API handlers with request tracing
export function withRequestTracing(
  handler: ApiHandler,
  routeName: string
) {
  return async (
    request: NextRequest,
    context: { params?: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    const requestId = getRequestId(request.headers);
    const logger = createLogger(`api:${routeName}`).withRequestId(requestId);
    
    const startTime = Date.now();
    
    logger.info(`${request.method} ${request.nextUrl.pathname}`, {
      query: Object.fromEntries(request.nextUrl.searchParams),
    });
    
    try {
      const response = await handler(request, context, logger, requestId);
      
      const duration = Date.now() - startTime;
      logger.info(`Response ${response.status}`, { duration: `${duration}ms` });
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        logger.warn('Validation error', { 
          errors: error.issues,
          duration: `${duration}ms` 
        });
        return errorResponse(
          'Validation error',
          requestId,
          400,
          error.issues
        );
      }
      
      // Handle known errors with message
      if (error instanceof Error) {
        logger.error(`Error: ${error.message}`, { 
          stack: error.stack,
          duration: `${duration}ms` 
        });
        return errorResponse(error.message, requestId, 500);
      }
      
      // Handle unknown errors
      logger.error('Unknown error', { 
        error,
        duration: `${duration}ms` 
      });
      return errorResponse('Internal server error', requestId, 500);
    }
  };
}

// Extract pagination params from search params
export function getPaginationFromUrl(searchParams: URLSearchParams): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
}

// Build pagination response metadata
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
