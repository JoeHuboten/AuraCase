'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';

export default function CartSync() {
  const { user, loading } = useAuth();
  const syncedRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);
  
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  useEffect(() => {
    // Wait for hydration and auth to be ready
    if (!hasHydrated || loading) return;

    const currentUserId = user?.id || null;
    const previousUserId = previousUserIdRef.current;

    // User just logged in
    if (currentUserId && !previousUserId && !syncedRef.current) {
      syncedRef.current = true;
      
      // Merge local cart with server cart
      const syncCart = async () => {
        try {
          // First, upload local cart items to server (merge mode)
          if (items.length > 0) {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items, merge: true }),
            });
          }

          // Then fetch the merged cart from server
          const response = await fetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
              // Replace local cart with server cart
              useCartStore.setState({ items: data.items });
            }
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        }
      };

      syncCart();
    }

    // User just logged out
    if (!currentUserId && previousUserId) {
      syncedRef.current = false;
      // Optionally clear cart on logout
      // useCartStore.getState().clearCart();
    }

    previousUserIdRef.current = currentUserId;
  }, [user?.id, loading, hasHydrated, items]);

  // Sync cart to server when items change (debounced)
  useEffect(() => {
    if (!user?.id || !hasHydrated || !syncedRef.current) return;

    const debounceTimer = setTimeout(async () => {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, merge: false }),
        });
      } catch (error) {
        console.error('Error saving cart to server:', error);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [items, user?.id, hasHydrated]);

  return null; // This is a logic-only component
}
