/**
 * Image optimization utilities for Just Cases
 */

// Generate optimized image URL with Next.js Image Optimization API
export const getOptimizedImageUrl = (
  src: string,
  width: number,
  height?: number,
  quality: number = 85
): string => {
  // If it's already a Next.js optimized URL, return as is
  if (src.includes('/_next/image')) {
    return src;
  }

  // For external images, use Next.js Image Optimization API
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
  });

  if (height) {
    params.set('h', height.toString());
  }

  return `/_next/image?${params.toString()}`;
};

// Generate responsive image sizes for different breakpoints
export const getResponsiveSizes = (breakpoint: 'mobile' | 'tablet' | 'desktop' | 'all' = 'all'): string => {
  const sizes = {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw',
    desktop: '(max-width: 1200px) 50vw, 33vw',
    all: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  };

  return sizes[breakpoint];
};

// Generate blur placeholder for images
export const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  // Return a static blur placeholder to avoid server-side issues
  return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";
};

// Preload critical images
export const preloadImage = (src: string, priority: boolean = false): void => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (priority) {
    link.setAttribute('fetchpriority', 'high');
  }
  
  document.head.appendChild(link);
};

// Image quality presets
export const IMAGE_QUALITY = {
  LOW: 60,
  MEDIUM: 75,
  HIGH: 85,
  MAXIMUM: 95,
} as const;

// Common image dimensions
export const IMAGE_DIMENSIONS = {
  THUMBNAIL: { width: 150, height: 150 },
  CARD: { width: 300, height: 300 },
  HERO: { width: 800, height: 600 },
  PRODUCT: { width: 600, height: 600 },
  CATEGORY: { width: 400, height: 300 },
} as const;

// Generate alt text for different image types
export const generateAltText = (
  type: 'product' | 'category' | 'brand' | 'hero',
  name: string,
  additionalInfo?: string
): string => {
  const baseText = `${name} - Just Cases`;
  
  switch (type) {
    case 'product':
      return `${name} - Премиум мобилен аксесоар от Just Cases${additionalInfo ? ` - ${additionalInfo}` : ''}`;
    case 'category':
      return `${name} - Категория мобилни аксесоари от Just Cases`;
    case 'brand':
      return `Лого на ${name} - Партньор на Just Cases`;
    case 'hero':
      return `${name} - Премиум мобилни аксесоари от Just Cases`;
    default:
      return baseText;
  }
};

// Check if image is external
export const isExternalImage = (src: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const url = new URL(src);
    return url.hostname !== window.location.hostname;
  } catch {
    return false;
  }
};

// Get image format based on browser support
export const getOptimalImageFormat = (): 'webp' | 'avif' | 'jpeg' => {
  if (typeof window === 'undefined') return 'jpeg';
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  // Check AVIF support
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }
  
  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  
  return 'jpeg';
};
