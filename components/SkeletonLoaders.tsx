'use client';

/**
 * Skeleton loader components for improved perceived performance
 */

// Base skeleton with animation
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-700/50 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-background-secondary rounded-2xl overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <Skeleton className="h-3 w-20" />
        
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        
        {/* Button */}
        <Skeleton className="h-10 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Category filter skeleton
export function CategoryFilterSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-24 mb-4" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

// Price filter skeleton
export function PriceFilterSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

// Sidebar skeleton
export function ShopSidebarSkeleton() {
  return (
    <div className="space-y-8 p-4 bg-background-secondary rounded-xl">
      <CategoryFilterSkeleton />
      <div className="border-t border-gray-700 pt-6">
        <PriceFilterSkeleton />
      </div>
    </div>
  );
}

// Order card skeleton
export function OrderCardSkeleton() {
  return (
    <div className="bg-background-secondary rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Items */}
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-16 rounded-lg" />
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

// Order list skeleton
export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Order detail skeleton
export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-background-secondary rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        
        {/* Timeline */}
        <div className="flex justify-between">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Items */}
      <div className="bg-background-secondary rounded-xl p-6 space-y-4">
        <Skeleton className="h-6 w-32 mb-4" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-4 border-b border-gray-700 last:border-0">
            <Skeleton className="h-20 w-20 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="bg-background-secondary rounded-xl p-6 space-y-3">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-700">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

// Search result skeleton
export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// Cart item skeleton
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-background-secondary rounded-xl">
      <Skeleton className="h-24 w-24 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}
