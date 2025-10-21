# Checkout Flow Documentation

## Overview
The checkout process has been redesigned to follow a streamlined flow:
**Cart → Create Order → Payment Page (Address + Card)**

## Flow Steps

### 1. Shopping Cart (`/cart`)
**Location**: `app/cart/page.tsx`

**Features**:
- Display cart items with quantities
- Show price breakdown (subtotal, discount, delivery fee, total)
- Discount code input field (functional UI, backend validation coming soon)
- "Go to Checkout" button

**Process**:
1. User adds products to cart from shop pages
2. User navigates to `/cart`
3. User can optionally enter a discount code
4. User clicks "Go to Checkout" button

**Authentication Check**:
- If user is NOT logged in → Redirect to `/auth/signin?redirect=/cart`
- If user IS logged in → Proceed to create order

### 2. Create Order (Backend API)
**Location**: `app/api/checkout/route.ts`

**When Triggered**: When user clicks "Go to Checkout" button in cart

**Process**:
1. Verify user authentication
2. Fetch all cart items from database
3. Calculate order totals:
   - **Subtotal**: Sum of all product prices × quantities
   - **Discount**: Product-level discounts (oldPrice - price)
   - **Additional Discount**: From discount code (coming soon)
   - **Delivery Fee**: $5.99 if subtotal < $50, otherwise FREE
   - **Total**: subtotal - discount + deliveryFee
4. Create Order in database with:
   - Status: `PENDING`
   - Payment Type: `CARD` (default)
   - All order items from cart
   - No address yet (added on payment page)
5. Clear user's cart items
6. Return order ID to frontend

**Response**:
```json
{
  "order": {
    "id": "clx...",
    "total": 99.99,
    "subtotal": 94.99,
    "discount": 0,
    "deliveryFee": 5.00,
    "status": "PENDING",
    "items": [...]
  }
}
```

### 3. Redirect to Payment Page
**Automatic**: After order creation, frontend redirects to `/payment/[orderId]`

### 4. Payment Page (`/payment/[orderId]`)
**Location**: `app/payment/[orderId]/page.tsx`

**Left Column - Order Summary**:
- List of ordered items with images
- Quantity and price per item
- Subtotal, discount, delivery fee breakdown
- **Total amount to pay**

**Right Column - Payment Form**:
1. **Delivery Address Section**:
   - Street Address (required)
   - City (required)
   - Postal Code (required, 4 digits for Bulgaria)
   - Country (dropdown: BG, US, GB, DE, FR)

2. **Payment Details Section**:
   - Stripe CardElement (card number, expiry, CVC)
   - Powered by Stripe badge

**Validation**:
- All address fields are required
- Bulgarian postal codes must be exactly 4 digits (e.g., 1000 for Sofia)
- Card validation handled by Stripe

**Process**:
1. User fills in delivery address
2. User enters card details
3. User clicks "Pay $XX.XX" button
4. Frontend creates payment intent via `/api/payment/create-payment-intent`
5. Stripe confirms card payment
6. On success:
   - Update order status to `PROCESSING`
   - Save `paymentIntentId` to order
   - Save shipping address to database
   - Link address to order
7. Redirect to success page

### 5. Order Update (Backend API)
**Location**: `app/api/orders/[id]/route.ts`

**When Triggered**: After successful payment

**Process**:
1. Create Address record in database:
   ```typescript
   {
     userId, firstName, lastName,
     address1: street,
     city, state, postalCode, country,
     phone, isDefault: false
   }
   ```
2. Update Order record:
   - Set `status` to `PROCESSING`
   - Set `paymentIntentId` from Stripe
   - Link `shippingAddressId` to created address
3. Return updated order with full details

### 6. Success Page
**Location**: `app/payment/success/page.tsx`

**Display**:
- Order confirmation message
- Order number
- Order details
- Link to view order in account

## Database Schema

### Order Model
```prisma
model Order {
  id                String      @id @default(cuid())
  userId            String
  total             Float
  subtotal          Float
  discount          Float       @default(0)
  deliveryFee       Float       @default(0)
  status            OrderStatus @default(PENDING)
  paymentType       PaymentType @default(CARD)
  paymentIntentId   String?
  shippingAddressId String?
  
  user              User              @relation(...)
  items             OrderItem[]
  shippingAddress   Address?          @relation(...)
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

enum OrderStatus {
  PENDING      // Order created, awaiting payment
  PROCESSING   // Payment successful, order being prepared
  SHIPPED      // Order shipped to customer
  DELIVERED    // Order delivered
  CANCELLED    // Order cancelled
}
```

### Address Model
```prisma
model Address {
  id         String   @id @default(cuid())
  userId     String
  firstName  String
  lastName   String
  address1   String
  address2   String?
  city       String
  state      String
  postalCode String
  country    String
  phone      String?
  isDefault  Boolean  @default(false)
  
  user       User     @relation(...)
  orders     Order[]
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## API Endpoints

### POST `/api/checkout`
**Purpose**: Create order from cart items
**Auth**: Required
**Body**:
```json
{
  "discountCode": "SAVE10" // optional
}
```
**Response**:
```json
{
  "order": {
    "id": "clx123...",
    "total": 99.99,
    "status": "PENDING",
    "items": [...]
  }
}
```

### POST `/api/payment/create-payment-intent`
**Purpose**: Create Stripe payment intent
**Auth**: Required
**Body**:
```json
{
  "orderId": "clx123...",
  "items": [...],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Sofia",
    "postalCode": "1000",
    "country": "BG"
  }
}
```

### PUT `/api/orders/[id]`
**Purpose**: Update order (status, payment, address)
**Auth**: Required (must be order owner)
**Body**:
```json
{
  "status": "PROCESSING",
  "paymentIntentId": "pi_123...",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Sofia",
    "postalCode": "1000",
    "country": "BG",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### GET `/api/orders/[id]`
**Purpose**: Fetch order details
**Auth**: Required (must be order owner)
**Response**: Full order with items and address

## Order Status Flow

```
PENDING → PROCESSING → SHIPPED → DELIVERED
   ↓
CANCELLED (can be cancelled while PENDING or PROCESSING)
```

- **PENDING**: Order created, payment not completed
- **PROCESSING**: Payment successful, order being prepared
- **SHIPPED**: Order dispatched with tracking number
- **DELIVERED**: Order received by customer
- **CANCELLED**: Order cancelled by user or admin

## User Experience

### Happy Path:
1. ✅ User browses products
2. ✅ User adds items to cart
3. ✅ User goes to cart page
4. ✅ User enters discount code (optional)
5. ✅ User clicks "Go to Checkout"
6. ✅ System creates order and redirects to payment page
7. ✅ User enters delivery address
8. ✅ User enters card details
9. ✅ User clicks "Pay"
10. ✅ Payment processes successfully
11. ✅ Order status updates to PROCESSING
12. ✅ User redirected to success page

### Error Handling:

**Cart Empty**:
- Display "Your cart is empty" message
- Show "Continue Shopping" button

**Not Logged In**:
- Redirect to sign-in page with return URL
- After login, return to cart page

**Payment Failed**:
- Display error message on payment page
- User can retry payment
- Order remains in PENDING status

**Order Not Found**:
- Display "Order not found" error
- Link to orders page

**Already Paid**:
- Detect order status !== PENDING
- Show "Payment Already Processed" message
- Link to orders page

## Future Enhancements

1. **Discount Code System**:
   - Create DiscountCode model
   - Validate codes in checkout API
   - Support percentage and fixed discounts
   - Track usage limits and expiration

2. **Multiple Payment Methods**:
   - PayPal integration
   - Bank transfer
   - Cash on delivery
   - Crypto payments

3. **Guest Checkout**:
   - Allow checkout without account
   - Email order confirmation
   - Option to create account after purchase

4. **Address Book**:
   - Save multiple addresses
   - Select from saved addresses
   - Set default address

5. **Order Tracking**:
   - Add tracking number
   - Email notifications
   - Real-time status updates

## Testing Checklist

- [ ] Cart displays correctly with items
- [ ] Discount code field is functional
- [ ] "Go to Checkout" requires authentication
- [ ] Order is created with correct totals
- [ ] Cart is cleared after order creation
- [ ] Payment page loads with order details
- [ ] Address form validates properly
- [ ] Stripe payment processes successfully
- [ ] Order status updates to PROCESSING
- [ ] Address is saved and linked to order
- [ ] Success page displays correctly
- [ ] Order appears in user's order history

## Stripe Test Cards

For testing payment functionality:

**Success**: `4242 4242 4242 4242`
**Decline**: `4000 0000 0000 0002`
**Authentication Required**: `4000 0025 0000 3155`

- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any 5-digit ZIP code (e.g., 12345)

## Environment Variables

Required for payment processing:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Get these from: https://dashboard.stripe.com/test/apikeys
