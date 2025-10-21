# 🎛️ AuraCase Admin Panel Documentation

## Overview

The AuraCase Admin Panel is a comprehensive dashboard for managing your e-commerce store. It provides full control over products, categories, orders, users, and store settings.

## Access

**URL:** `http://localhost:3000/admin`

**Authentication:** You must be logged in to access the admin panel. The system will redirect you to the sign-in page if you're not authenticated.

## Features

### 📊 Dashboard
- **Real-time Statistics:** View total products, categories, orders, and users
- **Revenue Tracking:** Monitor total revenue and growth metrics
- **Recent Products:** Quick view of the latest products added to your catalog
- **Growth Indicators:** Track monthly growth percentages

### 📦 Products Management
**Path:** `/admin/products`

**Features:**
- **List All Products:** View all products in a searchable table
- **Add New Product:** Create new products with:
  - Name, slug, description
  - Price, old price, discount
  - Category assignment
  - Image URL
  - Colors and sizes (JSON format)
  - Stock status
  - Featured status
- **Edit Product:** Update any product information
- **Delete Product:** Remove products from catalog
- **Search:** Find products by name or category

**Usage:**
1. Click "Add Product" button
2. Fill in the required fields (marked with *)
3. Set colors as JSON array: `["Black", "White", "Blue"]`
4. Set sizes as JSON array: `["S", "M", "L", "XL"]`
5. Toggle "In Stock" and "Featured" checkboxes
6. Click "Create Product" to save

### 🗂️ Categories Management
**Path:** `/admin/categories`

**Features:**
- **Grid View:** Visual display of all categories
- **Add New Category:** Create categories with:
  - Name and slug
  - Description
  - Image URL
- **Edit Category:** Update category information
- **Delete Category:** Remove categories (only if no products are assigned)
- **Product Count:** See how many products are in each category

**Usage:**
1. Click "Add Category" button
2. Enter category name and slug
3. Add optional description and image URL
4. Click "Create Category" to save

### 📋 Orders Management
**Path:** `/admin/orders`

**Features:**
- **Order List:** View all customer orders
- **Status Filter:** Filter by order status (Pending, Processing, Shipped, Delivered, Cancelled)
- **Search:** Find orders by ID, customer name, or email
- **Order Details:** View complete order information including:
  - Customer details
  - Order items with images
  - Order summary (subtotal, discount, delivery fee, total)
- **Status Management:** Update order status in real-time
- **Tracking Numbers:** Add and update shipping tracking numbers
- **Status Indicators:** Color-coded status badges with icons

**Order Statuses:**
- 🕐 **PENDING** - Order placed, awaiting processing
- 📦 **PROCESSING** - Order is being prepared
- 🚚 **SHIPPED** - Order has been shipped
- ✅ **DELIVERED** - Order delivered to customer
- ❌ **CANCELLED** - Order cancelled

**Usage:**
1. Click the eye icon to view order details
2. Change status in the dropdown menu
3. Add tracking number in the input field
4. Changes are saved automatically

### 👥 Users Management
**Path:** `/admin/users`

**Features:**
- **User List:** View all registered users
- **User Statistics:** See total users, orders, and active carts
- **Search:** Find users by name or email
- **User Details:** View:
  - Contact information (email, phone)
  - Order count
  - Cart items count
  - Join date

**Usage:**
- Use the search bar to find specific users
- View user statistics in the cards at the top
- Monitor user activity and engagement

### 📈 Analytics
**Path:** `/admin/analytics`

**Features:**
- **Revenue Analytics:** Total revenue with growth percentage
- **Order Analytics:** Total orders with growth trends
- **User Analytics:** Total users with growth metrics
- **Key Metrics:**
  - Average order value
  - Orders per user
  - Products per category
- **Visual Indicators:** Color-coded cards with trend icons

**Usage:**
- View real-time analytics data
- Monitor store performance
- Track growth trends
- Identify key performance indicators

### ⚙️ Settings
**Path:** `/admin/settings`

**Features:**
- **General Settings:**
  - Site name and description
  - Site URL
  - Contact email
- **Currency Settings:**
  - Currency selection (USD, EUR, GBP, BGN)
  - Currency symbol
- **Shipping Settings:**
  - Free shipping threshold
  - Standard shipping fee
  - Express shipping fee
- **Tax Settings:**
  - Enable/disable tax calculation
  - Tax rate percentage
- **Email Notifications:**
  - Enable/disable email notifications
  - Order confirmation emails
  - Shipping update emails

**Usage:**
1. Update any settings as needed
2. Click "Save Settings" to apply changes
3. Settings will be applied across the entire site

## Navigation

The admin panel features a fixed sidebar with the following sections:

1. **Dashboard** - Overview and statistics
2. **Products** - Product catalog management
3. **Categories** - Category management
4. **Orders** - Order processing and tracking
5. **Users** - Customer management
6. **Analytics** - Performance metrics
7. **Settings** - Store configuration
8. **Back to Site** - Return to the main website

## Tips & Best Practices

### Products
- Use descriptive slugs (e.g., `wireless-earbuds-pro`)
- Provide high-quality image URLs
- Set realistic prices and discounts
- Use JSON format for colors and sizes: `["Option1", "Option2"]`
- Mark popular products as "Featured"

### Categories
- Keep category names concise
- Use clear, descriptive slugs
- Add category images for better visual appeal
- Organize products logically

### Orders
- Process orders promptly
- Update status as orders progress
- Add tracking numbers for shipped orders
- Monitor pending orders regularly

### Users
- Review user activity regularly
- Monitor cart abandonment
- Track customer engagement

### Analytics
- Check analytics daily
- Monitor growth trends
- Identify best-selling products
- Track average order value

## API Endpoints

### Products
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Categories
- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

### Orders
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/[id]` - Update order
- `DELETE /api/admin/orders/[id]` - Delete order

### Users
- `GET /api/admin/users` - List all users

## Security

- All admin routes require authentication
- Unauthorized access is automatically redirected to sign-in
- API endpoints validate user authentication
- Sensitive operations require confirmation

## Technical Details

**Built With:**
- Next.js 15.5.4
- React 19
- Prisma ORM
- SQLite Database
- Tailwind CSS
- TypeScript

**Features:**
- Server-side rendering
- Real-time data updates
- Responsive design
- Modern UI/UX
- Type-safe API routes

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Test in development environment first
4. Contact the development team

## Future Enhancements

Planned features:
- Advanced analytics with charts
- Bulk product operations
- Export functionality
- Email template customization
- Role-based access control
- Activity logs
- Automated reports

---

**Last Updated:** October 2025  
**Version:** 1.0.0

