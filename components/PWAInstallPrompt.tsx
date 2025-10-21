'use client';

import { useState, useEffect } from 'react';
import { FiDownload, FiX, FiSmartphone, FiMonitor } from 'react-icons/fi';
import ScrollAnimation from './ScrollAnimation';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(isStandaloneMode);

      // Check if running on iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);

      // Check if already installed (for iOS)
      if (isIOSDevice) {
        const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
        setIsInstalled(isInStandaloneMode);
      }
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || isStandalone || !showInstallPrompt || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <ScrollAnimation animation="slideUp">
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm bg-background-secondary border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                {isIOS ? (
                  <FiSmartphone size={20} className="text-accent" />
                ) : (
                  <FiMonitor size={20} className="text-accent" />
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">Install AuraCase</h3>
                <p className="text-text-secondary text-sm">
                  {isIOS ? 'Add to Home Screen' : 'Install App'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-text-secondary hover:text-white transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            {isIOS 
              ? 'Install AuraCase on your home screen for quick access and a better shopping experience.'
              : 'Install AuraCase as an app for faster access, offline browsing, and push notifications.'
            }
          </p>

          {/* Benefits */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span>Faster loading</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span>Offline browsing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span>Push notifications</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isIOS ? (
              <button
                onClick={handleDismiss}
                className="flex-1 bg-accent text-white py-2.5 px-4 rounded-lg font-medium hover:bg-accent-light transition-colors text-sm"
              >
                Got it!
              </button>
            ) : (
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-accent text-white py-2.5 px-4 rounded-lg font-medium hover:bg-accent-light transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <FiDownload size={16} />
                Install
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 text-text-secondary hover:text-white transition-colors text-sm"
            >
              Later
            </button>
          </div>

          {/* iOS Instructions */}
          {isIOS && (
            <div className="mt-4 p-3 bg-primary/30 rounded-lg border border-gray-700/50">
              <p className="text-xs text-text-secondary">
                <strong>To install:</strong> Tap the Share button <span className="inline-block w-4 h-4 bg-gray-600 rounded mx-1"></span> in Safari, then "Add to Home Screen"
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollAnimation>
  );
}
