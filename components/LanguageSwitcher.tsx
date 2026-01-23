'use client';

import { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, currency, setLanguage, setCurrency } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);
  const currentCurrency = currencies.find(curr => curr.code === currency);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    console.log('Changing language to:', langCode);
    setLanguage(langCode as 'bg' | 'en');
    setIsOpen(false);
  };

  const handleCurrencyChange = (currCode: string) => {
    console.log('Changing currency to:', currCode);
    setCurrency(currCode as 'BGN' | 'USD' | 'EUR');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-accent transition-colors"
        title="Language & Currency"
      >
        <FiGlobe size={18} />
        <span className="hidden md:block text-sm">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
        <span className="hidden lg:block text-sm ml-2">
          {currentCurrency?.symbol}
        </span>
        <FiChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Language Section */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="text-white font-medium mb-3 text-sm">Language / Език</h4>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                    language === lang.code
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium text-sm">{lang.name}</span>
                  {language === lang.code && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Section */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="text-white font-medium mb-3 text-sm">Currency / Валута</h4>
            <div className="space-y-2">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                    currency === curr.code
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="font-bold text-lg">{curr.symbol}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{curr.code}</div>
                    <div className="text-xs opacity-75">{curr.name}</div>
                  </div>
                  {currency === curr.code && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Info */}
          <div className="p-4">
            <div className="text-xs text-gray-400 bg-gray-700/50 rounded-lg p-3">
              <div className="font-medium mb-1">Exchange Rates / Валутни курсове:</div>
              <div className="space-y-1">
                <div>1 EUR = $1.08 USD</div>
                <div className="text-xs opacity-75 mt-2">
                  * Rates are approximate / Курсовете са приблизителни
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
