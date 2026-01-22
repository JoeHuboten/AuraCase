import { prisma } from '@/lib/prisma';
import { FiPackage, FiGrid, FiShoppingBag, FiUsers, FiTrendingUp, FiDollarSign, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

export default async function AdminDashboard() {
  // Fetch all data
  const [products, categories, orders, users, pendingOrders] = await Promise.all([
    prisma.product.findMany({ include: { category: true } }),
    prisma.category.findMany(),
    prisma.order.findMany(),
    prisma.user.findMany(),
    // Get pending orders
    prisma.order.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  // Filter low stock products after fetching (since we need to compare stock to lowStockThreshold)
  const lowStockProducts = products
    .filter(p => p.stock <= p.lowStockThreshold)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10);

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue,
    monthlyGrowth: 12.5, // Mock growth percentage
    outOfStock: outOfStockCount,
    lowStock: lowStockCount,
    pendingOrders: pendingOrders.length,
  };

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-text-secondary mt-2">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <FiPackage className="h-8 w-8 text-accent" />
          </div>
        </div>

        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Categories</p>
              <p className="text-2xl font-bold text-white">{stats.totalCategories}</p>
            </div>
            <FiGrid className="h-8 w-8 text-accent" />
          </div>
        </div>

        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <FiShoppingBag className="h-8 w-8 text-accent" />
          </div>
        </div>

        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <FiUsers className="h-8 w-8 text-accent" />
          </div>
        </div>
      </div>

      {/* Revenue and Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
            <FiDollarSign className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold text-white">${stats.totalRevenue}</p>
          <p className="text-text-secondary text-sm mt-2">All time revenue</p>
        </div>

        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Monthly Growth</h3>
            <FiTrendingUp className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold text-white">+{stats.monthlyGrowth}%</p>
          <p className="text-text-secondary text-sm mt-2">Compared to last month</p>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-background-secondary rounded-lg border border-gray-800">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiAlertTriangle className={`h-6 w-6 ${lowStockProducts.length > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
              <h3 className="text-lg font-semibold text-white">Stock Alerts</h3>
            </div>
            {(stats.outOfStock > 0 || stats.lowStock > 0) && (
              <div className="flex items-center gap-3 text-sm">
                {stats.outOfStock > 0 && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full font-medium">
                    {stats.outOfStock} out of stock
                  </span>
                )}
                {stats.lowStock > 0 && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full font-medium">
                    {stats.lowStock} low stock
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6">
                <FiPackage className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-400 font-medium">All products are well stocked!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {lowStockProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/admin/products?search=${encodeURIComponent(product.name)}`}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${product.stock === 0 ? 'bg-red-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="text-white font-medium text-sm">{product.name}</p>
                        <p className="text-text-secondary text-xs">{product.category.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${product.stock === 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                        {product.stock} units
                      </p>
                      <p className="text-text-secondary text-xs">
                        Threshold: {product.lowStockThreshold}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-background-secondary rounded-lg border border-gray-800">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiAlertCircle className={`h-6 w-6 ${pendingOrders.length > 0 ? 'text-orange-500' : 'text-green-500'}`} />
              <h3 className="text-lg font-semibold text-white">Pending Orders</h3>
            </div>
            {pendingOrders.length > 0 && (
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full font-medium text-sm">
                {stats.pendingOrders} pending
              </span>
            )}
          </div>
          <div className="p-6">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-6">
                <FiShoppingBag className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-400 font-medium">All orders are processed!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingOrders.map((order) => (
                  <Link 
                    key={order.id}
                    href="/admin/orders?status=PENDING"
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium text-sm">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {order.user.name || order.user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${(order.total ?? 0).toFixed(2)}</p>
                      <p className="text-text-secondary text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-background-secondary rounded-lg border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Recent Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FiPackage className="h-6 w-6 text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-text-secondary text-sm">{product.category.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${product.price}</p>
                  <p className="text-text-secondary text-sm">
                    {product.featured ? 'Featured' : 'Regular'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
