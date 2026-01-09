import Link from 'next/link';
import { FiHome, FiSearch, FiShoppingBag } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-[180px] font-bold text-gray-800/50 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-accent-light/20 rounded-full animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-text-secondary text-lg mb-8">
          Oops! The page you&apos;re looking for seems to have wandered off. 
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-accent/20"
          >
            <FiHome size={20} />
            Go Home
          </Link>
          
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-medium transition-colors"
          >
            <FiShoppingBag size={20} />
            Browse Shop
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-text-secondary text-sm mb-4">
            Looking for something specific?
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors"
          >
            <FiSearch size={16} />
            Search our products
          </Link>
        </div>
      </div>
    </div>
  );
}
