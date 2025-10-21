'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void;
  setReducedMotion: (enabled: boolean) => void;
  setScreenReader: (enabled: boolean) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedHighContrast = localStorage.getItem('accessibility-highContrast') === 'true';
    const savedFontSize = localStorage.getItem('accessibility-fontSize') as 'small' | 'medium' | 'large' | 'extra-large' || 'medium';
    const savedReducedMotion = localStorage.getItem('accessibility-reducedMotion') === 'true';
    const savedScreenReader = localStorage.getItem('accessibility-screenReader') === 'true';
    const savedKeyboardNavigation = localStorage.getItem('accessibility-keyboardNavigation') === 'true';

    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
    setReducedMotion(savedReducedMotion);
    setScreenReader(savedScreenReader);
    setKeyboardNavigation(savedKeyboardNavigation);
  }, []);

  useEffect(() => {
    // Save preferences
    localStorage.setItem('accessibility-highContrast', highContrast.toString());
    localStorage.setItem('accessibility-fontSize', fontSize);
    localStorage.setItem('accessibility-reducedMotion', reducedMotion.toString());
    localStorage.setItem('accessibility-screenReader', screenReader.toString());
    localStorage.setItem('accessibility-keyboardNavigation', keyboardNavigation.toString());

    // Apply accessibility settings to document
    const root = document.documentElement;
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${fontSize}`);

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Screen reader
    if (screenReader) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Keyboard navigation
    if (keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }, [highContrast, fontSize, reducedMotion, screenReader, keyboardNavigation]);

  const resetAccessibility = () => {
    setHighContrast(false);
    setFontSize('medium');
    setReducedMotion(false);
    setScreenReader(false);
    setKeyboardNavigation(false);
  };

  const value: AccessibilityContextType = {
    highContrast,
    fontSize,
    reducedMotion,
    screenReader,
    keyboardNavigation,
    setHighContrast,
    setFontSize,
    setReducedMotion,
    setScreenReader,
    setKeyboardNavigation,
    resetAccessibility,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
