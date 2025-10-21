# Checkout Flow Diagram

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SHOPPING PHASE                              │
└─────────────────────────────────────────────────────────────────────┘

    User browses products (/shop, /product/[slug])
                    ↓
    User clicks "Add to Cart"
                    ↓
    Product added to Cart (localStorage + database if logged in)


┌─────────────────────────────────────────────────────────────────────┐
│                          CART PHASE                                  │
└─────────────────────────────────────────────────────────────────────┘

    User navigates to /cart
                    ↓
    ┌─────────────────────────────────────────────┐
    │           CART PAGE                          │
    │                                              │
    │  • List of cart items                        │
    │  • Quantity controls (+/-)                   │
    │  • Remove item button                        │
    │                                              │
    │  ┌────────────────────────────────────┐    │
    │  │  ORDER SUMMARY                     │    │
    │  │  Subtotal:    $94.99               │    │
    │  │  Discount:    -$0.00               │    │
    │  │  Delivery:    $5.00                │    │
    │  │  ────────────────────────          │    │
    │  │  Total:       $99.99               │    │
    │  └────────────────────────────────────┘    │
    │                                              │
    │  [Enter discount code] [Apply]              │
    │                                              │
    │  [Go to Checkout →]  ← MAIN BUTTON          │
    └─────────────────────────────────────────────┘
                    ↓
    User clicks "Go to Checkout"
                    ↓
    ┌─── Authentication Check ───┐
    │                             │
    │  Logged in?                 │
    │                             │
    └──────────┬──────────────────┘
               │
        ┌──────┴──────┐
        │             │
       NO            YES
        │             │
        ↓             ↓
    Redirect to   Continue
    /auth/signin     ↓


┌─────────────────────────────────────────────────────────────────────┐
│                    ORDER CREATION PHASE                              │
└─────────────────────────────────────────────────────────────────────┘

    POST /api/checkout
                    ↓
    ┌────────────────────────────────────┐
    │  Backend Process:                  │
    │  1. Get user's cart items          │
    │  2. Calculate totals               │
    │  3. Create Order (PENDING)         │
    │  4. Create OrderItems              │
    │  5. Clear cart                     │
    │  6. Return order ID                │
    └────────────────────────────────────┘
                    ↓
    Frontend receives order ID
                    ↓
    Redirect to /payment/[orderId]


┌─────────────────────────────────────────────────────────────────────┐
│                      PAYMENT PHASE                                   │
└─────────────────────────────────────────────────────────────────────┘

    User lands on /payment/[orderId]
                    ↓
    ┌────────────────────────────────────────────────────────────┐
    │                    PAYMENT PAGE                             │
    │                                                             │
    │  ┌─────────────────────┐  ┌──────────────────────────┐   │
    │  │  ORDER SUMMARY      │  │  PAYMENT FORM            │   │
    │  │  ─────────────────  │  │  ──────────────────────  │   │
    │  │                     │  │                          │   │
    │  │  Item 1  x2  $40    │  │  DELIVERY ADDRESS        │   │
    │  │  Item 2  x1  $50    │  │  Street: [__________]    │   │
    │  │                     │  │  City:   [__________]    │   │
    │  │  Subtotal:  $90     │  │  Postal: [____] (4 dig)  │   │
    │  │  Discount:  -$0     │  │  Country: [Bulgaria ▼]   │   │
    │  │  Delivery:  $5      │  │                          │   │
    │  │  ───────────────    │  │  PAYMENT DETAILS         │   │
    │  │  Total:     $95     │  │  [Stripe Card Element]   │   │
    │  │                     │  │  ████████████████████    │   │
    │  │                     │  │                          │   │
    │  │                     │  │  [Pay $95.00]            │   │
    │  └─────────────────────┘  └──────────────────────────┘   │
    └────────────────────────────────────────────────────────────┘
                    ↓
    User fills address and card details
                    ↓
    User clicks "Pay"
                    ↓
    ┌────────────────────────────────────┐
    │  Payment Processing:               │
    │  1. Validate address               │
    │  2. Create payment intent (Stripe) │
    │  3. Confirm card payment           │
    │  4. Create Address record          │
    │  5. Update Order:                  │
    │     - status: PROCESSING           │
    │     - paymentIntentId              │
    │     - shippingAddressId            │
    └────────────────────────────────────┘
                    ↓
    ┌─── Payment Result ───┐
    │                       │
    │  Success?             │
    │                       │
    └───────┬───────────────┘
            │
     ┌──────┴──────┐
     │             │
    YES            NO
     │             │
     ↓             ↓
  Redirect     Show error
  to success   Stay on page
  page         (retry)


┌─────────────────────────────────────────────────────────────────────┐
│                      SUCCESS PHASE                                   │
└─────────────────────────────────────────────────────────────────────┘

    User redirected to /payment/success?order=[orderId]
                    ↓
    ┌─────────────────────────────────────┐
    │  ✅ Payment Successful!              │
    │                                      │
    │  Order #[orderId]                    │
    │  Total: $95.00                       │
    │                                      │
    │  We'll send you tracking info        │
    │  via email soon!                     │
    │                                      │
    │  [View Order Details]                │
    │  [Continue Shopping]                 │
    └─────────────────────────────────────┘
```

## Data Flow

### Cart → Checkout API
```javascript
// Frontend sends
{
  discountCode: "SAVE10"  // optional
}

// Backend returns
{
  order: {
    id: "clx123abc",
    status: "PENDING",
    total: 99.99,
    subtotal: 94.99,
    discount: 0,
    deliveryFee: 5.00,
    items: [...]
  }
}
```

### Payment Page → Order API
```javascript
// Frontend sends
{
  status: "PROCESSING",
  paymentIntentId: "pi_stripe123",
  shippingAddress: {
    street: "123 Main St",
    city: "Sofia",
    postalCode: "1000",
    country: "BG"
  }
}

// Backend creates Address and updates Order
```

## Order Status Lifecycle

```
┌──────────┐
│ PENDING  │  ← Order created, no payment yet
└─────┬────┘
      │
      │ Payment successful
      ↓
┌────────────┐
│ PROCESSING │  ← Payment received, preparing order
└─────┬──────┘
      │
      │ Order shipped
      ↓
┌──────────┐
│ SHIPPED  │  ← On the way to customer
└─────┬────┘
      │
      │ Delivered to customer
      ↓
┌───────────┐
│ DELIVERED │  ← Order complete
└───────────┘

    Any state
       ↓
┌───────────┐
│ CANCELLED │  ← Order cancelled
└───────────┘
```

## Database Relationships

```
User
 ├─ CartItem (many)
 ├─ Order (many)
 └─ Address (many)

Order
 ├─ OrderItem (many)
 │   └─ Product
 ├─ ShippingAddress (one Address)
 └─ User (one)

CartItem
 ├─ User (one)
 └─ Product (one)
```

## Key Points

✅ **Order created BEFORE payment**
- Enables abandoned cart tracking
- Better analytics
- Easier to retry failed payments

✅ **Single payment page**
- Address + Payment on one page
- Simpler user experience
- Fewer steps = higher conversion

✅ **Cart cleared after order creation**
- Clean slate for next purchase
- No duplicate orders
- Items moved to order

✅ **Address saved to user account**
- Reusable for future orders
- Address book ready
- Better UX for returning customers

## Error Handling

### Cart Page Errors
- Empty cart → Show "Continue Shopping"
- Not logged in → Redirect to login
- Network error → Show retry button

### Checkout API Errors
- Invalid cart → 400 error message
- Not authenticated → 401 redirect to login
- Server error → 500 show error, stay on cart

### Payment Page Errors
- Order not found → Show error, link to orders
- Already paid → Show message, link to orders
- Invalid address → Inline validation errors
- Payment failed → Show error, allow retry
- Network error → Show error, allow retry

## Testing Scenarios

1. **Happy Path**: Cart → Checkout → Payment → Success ✅
2. **Empty Cart**: Show empty state message ✅
3. **Not Logged In**: Redirect to login ✅
4. **Invalid Card**: Show error, allow retry ✅
5. **Wrong Postal Code**: Validation error ✅
6. **Already Paid Order**: Show message ✅
7. **Network Error**: Error handling ✅

## Performance Optimizations

- Cart items cached in localStorage
- Server-side cart sync for logged users
- Optimistic UI updates
- Payment intent cached
- Order data prefetched
