'use client';

import { useEffect } from 'react';
import { registerServiceWorker, requestNotificationPermission } from '@/lib/sw-register';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Request notification permission after a delay
    setTimeout(() => {
      requestNotificationPermission();
    }, 5000);
  }, []);

  return null; // This component doesn't render anything
}
