# Cart Authentication Fix

## Problem

When clicking "Go to Checkout" on the cart page, the user was being redirected to the sign-in page **even though they were already logged in**.

## Root Cause

The cart page (`app/cart/page.tsx`) was manually fetching user authentication status with a separate API call:

```tsx
const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    }
  };
  fetchUser();
}, []);
```

**Issues**:
1. Race condition - button could be clicked before fetch completes
2. Not using the centralized `AuthContext`
3. Duplicate auth logic across pages
4. No loading state while checking auth

## Solution

Use the **AuthContext** which already manages authentication state globally:

```tsx
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { user, loading } = useAuth();  // ✅ Use context
  // Removed: const [user, setUser] = useState(null);
  
  const handleCheckout = async () => {
    if (loading) return;  // ✅ Wait for auth to load
    
    if (!user) {
      alert('Please log in to complete your order.');
      window.location.href = '/auth/signin?redirect=/cart';
      return;
    }
    
    // ✅ Create order and redirect to payment
    const response = await fetch('/api/checkout', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ discountCode })
    });
    
    if (response.ok) {
      const { order } = await response.json();
      window.location.href = `/payment/${order.id}`;  // ✅ Goes to payment
    }
  };
}
```

## Changes Made

### File: `app/cart/page.tsx`

**Before**:
```tsx
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Manual auth fetch
    fetchUser();
  }, []);
  
  const handleCheckout = async () => {
    if (!user) {
      // Redirect to signin
    }
    // ...
  };
}
```

**After**:
```tsx
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';  // ✅ Added

export default function CartPage() {
  const { user, loading } = useAuth();  // ✅ Use context
  // Removed manual state and useEffect for auth
  
  const handleCheckout = async () => {
    if (loading) return;  // ✅ Wait for auth check
    
    if (!user) {
      // Redirect to signin
      return;
    }
    
    // ✅ Create order in backend
    const response = await fetch('/api/checkout', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ discountCode })
    });
    
    if (response.ok) {
      const { order } = await response.json();
      // ✅ Redirect to payment page (NOT signin)
      window.location.href = `/payment/${order.id}`;
    }
  };
}
```

### Button State Update:
```tsx
<button
  onClick={handleCheckout}
  disabled={isCheckingOut || loading}  // ✅ Disable while loading
  className={`btn-primary ${isCheckingOut || loading ? 'opacity-50' : ''}`}
>
  {loading ? 'Loading...' : 
   isCheckingOut ? 'Creating Order...' : 
   'Go to Checkout →'}
</button>
```

## Benefits

1. ✅ **Uses centralized auth state** - AuthContext manages all auth
2. ✅ **No race conditions** - Waits for `loading` to complete
3. ✅ **Consistent auth behavior** - Same as other pages
4. ✅ **Better UX** - Shows loading state while checking
5. ✅ **Direct to payment** - When logged in, goes straight to payment page

## Flow Now Working

```
User logged in → Cart page → Click "Go to Checkout"
                                      ↓
                            Check auth (from context)
                                      ↓
                              User authenticated?
                                      ↓
                                     YES
                                      ↓
                            POST /api/checkout
                            (Create order)
                                      ↓
                            Get order ID
                                      ↓
                    Redirect to /payment/[orderId]  ✅
                                      ↓
                            Payment page loads
                            (Address + Card form)
```

## Testing

1. **Make sure you're signed in**: `admin@auracase.com` / `admin123`
2. **Add items to cart**: Go to `/shop`, add products
3. **Go to cart**: `/cart`
4. **Click "Go to Checkout →"**
5. **Expected**: Redirect to `/payment/[orderId]` ✅
6. **Not expected**: Redirect to `/auth/signin` ❌

## Why This Works

### AuthContext Benefits:
- Global auth state shared across all pages
- Automatic refresh on login/logout
- Loading state during auth checks
- Consistent behavior everywhere

### Previous Problem:
```tsx
// Race condition - might check before fetch completes
const [user, setUser] = useState(null);  // Initially null
useEffect(() => {
  fetchUser();  // Takes time
}, []);

// Button clicked too early
if (!user) {  // Still null!
  redirect to signin  // Wrong!
}
```

### Fixed Solution:
```tsx
const { user, loading } = useAuth();  // Already loaded by app

if (loading) return;  // Wait if still checking
if (!user) {  // Only redirect if actually not logged in
  redirect to signin;
}
```

## Server Status

✅ **Running on**: `http://localhost:3000`  
✅ **No errors**  
✅ **Ready to test**

## Files Modified

- ✅ `app/cart/page.tsx` - Uses AuthContext, removed manual auth fetch

## Related Context

- `contexts/AuthContext.tsx` - Provides global auth state
- `app/api/checkout/route.ts` - Creates order from cart
- `app/payment/[orderId]/page.tsx` - Payment page with address form

---

**Status**: ✅ FIXED
**Test URL**: http://localhost:3000/cart
**Expected Behavior**: When logged in, "Go to Checkout" creates order and goes to payment page
