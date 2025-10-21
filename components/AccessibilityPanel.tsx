'use client';

import { useState } from 'react';
import { FiEye, FiType, FiZap, FiVolume2, FiSettings, FiX, FiTerminal } from 'react-icons/fi';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import ScrollAnimation from './ScrollAnimation';

export default function AccessibilityPanel() {
  const {
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
  } = useAccessibility();

  const [isOpen, setIsOpen] = useState(false);

  const fontSizeOptions = [
    { value: 'small', label: 'Малък', size: '14px' },
    { value: 'medium', label: 'Среден', size: '16px' },
    { value: 'large', label: 'Голям', size: '18px' },
    { value: 'extra-large', label: 'Много голям', size: '20px' },
  ];

  return (
    <>
      {/* Accessibility Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full shadow-2xl hover:bg-accent-light transition-all duration-300 z-40 flex items-center justify-center group"
        title="Accessibility Settings / Настройки за достъпност"
        aria-label="Open accessibility settings"
      >
        <FiSettings size={24} className="group-hover:rotate-180 transition-transform duration-300" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ScrollAnimation animation="scaleUp" className="bg-background-secondary border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <FiSettings size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Accessibility Settings</h2>
                  <p className="text-text-secondary">Настройки за достъпност</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-white transition-colors"
                aria-label="Close accessibility panel"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* High Contrast */}
              <div className="flex items-center justify-between p-4 bg-primary/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiEye size={20} className="text-accent" />
                  <div>
                    <h3 className="text-white font-medium">High Contrast</h3>
                    <p className="text-text-secondary text-sm">Висок контраст</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => setHighContrast(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              {/* Font Size */}
              <div className="p-4 bg-primary/30 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <FiType size={20} className="text-accent" />
                  <div>
                    <h3 className="text-white font-medium">Font Size</h3>
                    <p className="text-text-secondary text-sm">Размер на шрифта</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFontSize(option.value as any)}
                      className={`p-3 rounded-lg border transition-all ${
                        fontSize === option.value
                          ? 'border-accent bg-accent/20 text-accent'
                          : 'border-gray-700 text-text-secondary hover:text-white hover:border-gray-600'
                      }`}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs opacity-75" style={{ fontSize: option.size }}>
                        Aa
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-4 bg-primary/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiZap size={20} className="text-accent" />
                  <div>
                    <h3 className="text-white font-medium">Reduce Motion</h3>
                    <p className="text-text-secondary text-sm">Намали анимациите</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              {/* Screen Reader Optimization */}
              <div className="flex items-center justify-between p-4 bg-primary/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiVolume2 size={20} className="text-accent" />
                  <div>
                    <h3 className="text-white font-medium">Screen Reader</h3>
                    <p className="text-text-secondary text-sm">Оптимизация за екранни четци</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={screenReader}
                    onChange={(e) => setScreenReader(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between p-4 bg-primary/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <FiTerminal size={20} className="text-accent" />
                  <div>
                    <h3 className="text-white font-medium">Keyboard Navigation</h3>
                    <p className="text-text-secondary text-sm">Навигация с клавиатура</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keyboardNavigation}
                    onChange={(e) => setKeyboardNavigation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              {/* Keyboard Shortcuts Info */}
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <h4 className="text-white font-medium mb-3">Keyboard Shortcuts / Клавишни комбинации</h4>
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Skip to main content</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Alt + M</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Open search</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle accessibility panel</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Alt + A</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Toggle high contrast</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Alt + H</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700">
              <button
                onClick={resetAccessibility}
                className="text-text-secondary hover:text-white transition-colors"
              >
                Reset to defaults / Върни по подразбиране
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary"
              >
                Done / Готово
              </button>
            </div>
          </ScrollAnimation>
        </div>
      )}
    </>
  );
}
