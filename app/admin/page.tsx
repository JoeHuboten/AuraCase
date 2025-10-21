import { prisma } from '@/lib/prisma';
import { FiPackage, FiGrid, FiShoppingBag, FiUsers, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

export default async function AdminDashboard() {
  // Fetch all data
  const [products, categories, orders, users] = await Promise.all([
    prisma.product.findMany({ include: { category: true } }),
    prisma.category.findMany(),
    prisma.order.findMany(),
    prisma.user.findMany(),
  ]);

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue,
    monthlyGrowth: 12.5, // Mock growth percentage
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
