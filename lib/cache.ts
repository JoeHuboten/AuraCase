/**
 * Simple in-memory cache for API routes
 * Use for data that doesn't change frequently
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize = 100;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000),
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  // Get or set pattern - fetch if not cached
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 60
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    this.set(key, data, ttlSeconds);
    return data;
  }
}

// Export singleton instance
export const apiCache = new SimpleCache();

// Cache key generators
export const cacheKeys = {
  products: (params?: string) => `products:${params || 'all'}`,
  product: (slug: string) => `product:${slug}`,
  categories: () => 'categories:all',
  category: (slug: string) => `category:${slug}`,
  featuredProducts: () => 'products:featured',
  searchProducts: (query: string) => `search:${query}`,
  search: (params: string) => `search:${params}`,
};

// Cache TTLs in seconds
export const cacheTTL = {
  products: 60,       // 1 minute
  product: 120,       // 2 minutes
  categories: 300,    // 5 minutes
  featured: 180,      // 3 minutes
  search: 30,         // 30 seconds
};

export default apiCache;
