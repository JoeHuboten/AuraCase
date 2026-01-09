'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
    
    // TODO: Send to error tracking service (Sentry, etc.)
    // if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-red-500/30 animate-ping" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Something Went Wrong
        </h1>
        
        <p className="text-text-secondary text-lg mb-4">
          We apologize for the inconvenience. An unexpected error occurred.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-left">
            <p className="text-red-400 font-mono text-sm break-all mb-2">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-red-400/50 text-xs">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Production Error Message */}
        {process.env.NODE_ENV === 'production' && error.digest && (
          <p className="text-text-secondary text-sm mb-8">
            Error ID: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-accent/20"
          >
            <FiRefreshCw size={20} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-medium transition-colors"
          >
            <FiHome size={20} />
            Go Home
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-text-secondary text-sm">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-accent hover:text-accent-light transition-colors">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
