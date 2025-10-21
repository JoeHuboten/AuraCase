'use client';

import { useEffect, useState } from 'react';
import { FiWifi, FiWifiOff, FiRefreshCw, FiHome } from 'react-icons/fi';
import Link from 'next/link';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center p-4">
      <ScrollAnimation animation="fadeIn" className="text-center max-w-md w-full">
        <div className="bg-background-secondary border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="w-24 h-24 bg-primary/50 rounded-full flex items-center justify-center mx-auto mb-6">
            {isOnline ? (
              <FiWifi size={32} className="text-accent" />
            ) : (
              <FiWifiOff size={32} className="text-red-400" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
          </h1>

          {/* Description */}
          <p className="text-text-secondary mb-8 leading-relaxed">
            {isOnline 
              ? 'Great! Your internet connection is back. You can now continue browsing AuraCase.'
              : 'It looks like you\'re not connected to the internet. Some features may not be available, but you can still browse cached content.'
            }
          </p>

          {/* Status Indicator */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            isOnline 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {isOnline ? (
              <>
                <FiWifi size={16} />
                Online
              </>
            ) : (
              <>
                <FiWifiOff size={16} />
                Offline
              </>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {!isOnline && (
              <button
                onClick={handleRetry}
                className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent-light transition-colors flex items-center justify-center gap-2"
              >
                <FiRefreshCw size={18} className={retryCount > 0 ? 'animate-spin' : ''} />
                Try Again {retryCount > 0 && `(${retryCount})`}
              </button>
            )}

            <Link
              href="/"
              className="w-full bg-primary/50 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/70 transition-colors flex items-center justify-center gap-2 border border-gray-700"
            >
              <FiHome size={18} />
              Go to Homepage
            </Link>
          </div>

          {/* Offline Features */}
          {!isOnline && (
            <div className="mt-8 p-4 bg-primary/30 rounded-lg border border-gray-700/50">
              <h3 className="text-white font-medium mb-3">Available Offline:</h3>
              <ul className="text-text-secondary text-sm space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Browse cached products
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  View product details
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Access your wishlist
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Cart (will sync when online)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  New purchases
                </li>
              </ul>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 text-xs text-text-secondary">
            <p>
              {isOnline 
                ? 'Your data will sync automatically in the background.'
                : 'Check your internet connection and try again. Your progress is saved locally.'
              }
            </p>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
