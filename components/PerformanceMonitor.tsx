'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    // Only run in development or when explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !localStorage.getItem('enable-performance-monitor')) {
      return;
    }

    const measurePerformance = () => {
      const newMetrics: PerformanceMetrics = {
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
      };

      // Measure FCP (First Contentful Paint)
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        newMetrics.fcp = Math.round(fcpEntry.startTime);
      }

      // Measure TTFB (Time to First Byte)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        newMetrics.ttfb = Math.round(navigationEntry.responseStart - navigationEntry.requestStart);
      }

      // Use Performance Observer for LCP, FID, and CLS
      if ('PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          newMetrics.lcp = Math.round(lastEntry.startTime);
          setMetrics(prev => ({ ...prev, lcp: newMetrics.lcp }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            newMetrics.fid = Math.round(entry.processingStart - entry.startTime);
            setMetrics(prev => ({ ...prev, fid: newMetrics.fid }));
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          newMetrics.cls = Math.round(clsValue * 1000) / 1000;
          setMetrics(prev => ({ ...prev, cls: newMetrics.cls }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Cleanup observers
        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      }

      // Set initial metrics
      setMetrics(newMetrics);
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Log metrics to console in development
    if (process.env.NODE_ENV === 'development') {
      const logMetrics = () => {
        console.group('🚀 Performance Metrics');
        console.log('FCP (First Contentful Paint):', metrics.fcp ? `${metrics.fcp}ms` : 'Not available');
        console.log('LCP (Largest Contentful Paint):', metrics.lcp ? `${metrics.lcp}ms` : 'Not available');
        console.log('FID (First Input Delay):', metrics.fid ? `${metrics.fid}ms` : 'Not available');
        console.log('CLS (Cumulative Layout Shift):', metrics.cls !== null ? metrics.cls : 'Not available');
        console.log('TTFB (Time to First Byte):', metrics.ttfb ? `${metrics.ttfb}ms` : 'Not available');
        console.groupEnd();
      };

      // Log metrics when they change
      const interval = setInterval(logMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [metrics]);

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development' && !localStorage.getItem('enable-performance-monitor')) {
    return null;
  }

  // Also don't render if we're not in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">Performance Metrics</div>
      <div className="space-y-1">
        <div>FCP: {metrics.fcp ? `${metrics.fcp}ms` : '...'}</div>
        <div>LCP: {metrics.lcp ? `${metrics.lcp}ms` : '...'}</div>
        <div>FID: {metrics.fid ? `${metrics.fid}ms` : '...'}</div>
        <div>CLS: {metrics.cls !== null ? metrics.cls : '...'}</div>
        <div>TTFB: {metrics.ttfb ? `${metrics.ttfb}ms` : '...'}</div>
      </div>
    </div>
  );
}
