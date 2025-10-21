'use client';

import { useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function useKeyboardShortcuts() {
  const { 
    highContrast, 
    setHighContrast, 
    keyboardNavigation, 
    setKeyboardNavigation 
  } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + M: Skip to main content
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Ctrl + K: Open search (if available)
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        const searchButton = document.querySelector('[title*="Търсене"], [title*="Search"]') as HTMLButtonElement;
        if (searchButton) {
          searchButton.click();
        }
      }

      // Alt + A: Toggle accessibility panel
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        const accessibilityButton = document.querySelector('[title*="Accessibility"], [title*="достъпност"]') as HTMLButtonElement;
        if (accessibilityButton) {
          accessibilityButton.click();
        }
      }

      // Alt + H: Toggle high contrast
      if (event.altKey && event.key === 'h') {
        event.preventDefault();
        setHighContrast(!highContrast);
      }

      // Alt + K: Toggle keyboard navigation
      if (event.altKey && event.key === 'k') {
        event.preventDefault();
        setKeyboardNavigation(!keyboardNavigation);
      }

      // Escape: Close any open modals/panels
      if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('[data-modal-open="true"]');
        openModals.forEach(modal => {
          const closeButton = modal.querySelector('[data-modal-close]') as HTMLButtonElement;
          if (closeButton) {
            closeButton.click();
          }
        });
      }

      // Tab: Enhanced tab navigation when keyboard navigation is enabled
      if (keyboardNavigation && event.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element);
        
        if (event.shiftKey) {
          // Shift + Tab: Go backwards
          if (currentIndex <= 0) {
            event.preventDefault();
            (focusableElements[focusableElements.length - 1] as HTMLElement)?.focus();
          }
        } else {
          // Tab: Go forwards
          if (currentIndex >= focusableElements.length - 1) {
            event.preventDefault();
            (focusableElements[0] as HTMLElement)?.focus();
          }
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [highContrast, setHighContrast, keyboardNavigation, setKeyboardNavigation]);

  // Announce keyboard shortcuts to screen readers
  useEffect(() => {
    if (keyboardNavigation) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Keyboard navigation enabled. Use Tab to navigate, Enter to activate, and Escape to close modals.';
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 3000);
    }
  }, [keyboardNavigation]);
}
