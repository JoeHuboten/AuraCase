'use client';

import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';

// Skeleton placeholder for loading states
const LoadingFallback = () => (
  <div className="animate-pulse bg-primary-light/50 rounded-2xl min-h-[200px]" />
);

// Lazy load heavy components
export const LazyQuickViewModal = dynamic(
  () => import('@/components/QuickViewModal'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const LazyAdvancedSearch = dynamic(
  () => import('@/components/AdvancedSearch'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const LazyAccessibilityPanel = dynamic(
  () => import('@/components/AccessibilityPanel'),
  { 
    loading: () => null,
    ssr: false 
  }
);

export const LazyProductImageGallery = dynamic(
  () => import('@/components/ProductImageGallery'),
  { 
    loading: () => <LoadingFallback />,
    ssr: false 
  }
);

export const LazyProductReviews = dynamic(
  () => import('@/components/ProductReviews'),
  { 
    loading: () => <LoadingFallback />,
    ssr: false 
  }
);

export const LazyMagicBentoCategory = dynamic(
  () => import('@/components/MagicBentoCategory'),
  { 
    loading: () => <LoadingFallback />,
  }
);

// Utility for wrapping any component with Suspense
export function withSuspense<T extends object>(
  Component: ComponentType<T>,
  fallback: React.ReactNode = <LoadingFallback />
) {
  return function SuspenseWrapper(props: T) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}

export default {
  LazyQuickViewModal,
  LazyAdvancedSearch,
  LazyAccessibilityPanel,
  LazyProductImageGallery,
  LazyProductReviews,
  LazyMagicBentoCategory,
};
