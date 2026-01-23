/**
 * Shared TypeScript interfaces for the Just Cases application
 */

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  image: string;
  images: string;
  categoryId: string;
  colors: string;
  sizes: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  stock: number | null;
  lowStockThreshold: number | null;
  specifications: ProductSpecifications | null;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface ProductSpecifications {
  material?: string;
  protection?: string;
  features?: string[];
  battery?: string;
  capacity?: string;
  output?: string;
  power?: string;
  length?: string;
  thickness?: string;
  compatibility?: string;
  [key: string]: string | string[] | undefined;
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface DiscountCode {
  code: string;
  percentage: number;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
}

// Order types
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'STRIPE' | 'PAYPAL' | 'COD';

export interface OrderItem {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  color: string | null;
  size: string | null;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  discount: number;
  paymentMethod: PaymentMethod;
  paymentId: string | null;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  notes: string | null;
  trackingNumber: string | null;
  estimatedDelivery: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  user?: User;
}

// Shipping address type
export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  createdAt: Date;
  user?: {
    name: string | null;
  };
}

// Contact message type
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: Date;
}

// PayPal types
export interface PayPalOrderDetails {
  orderID: string;
  payerID?: string;
  paymentID?: string;
  facilitatorAccessToken?: string;
}

export interface PayPalCreateOrderData {
  items: CartItem[];
  discountCode?: string;
  shippingAddress: ShippingAddress;
}
