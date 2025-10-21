'use client';

import { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp, FiPackage, FiGrid } from 'react-icons/fi';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all data
      const [ordersRes, usersRes, productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/users'),
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ]);

      const [ordersData, usersData, productsData, categoriesData] = await Promise.all([
        ordersRes.json(),
        usersRes.json(),
        productsRes.json(),
        categoriesRes.json(),
      ]);

      const orders = ordersData.orders || [];
      const users = usersData.users || [];
      const products = productsData.products || [];
      const categories = categoriesData.categories || [];

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);

      // Calculate growth (mock data for now)
      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        totalCategories: categories.length,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        usersGrowth: 15.2,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-text-secondary mt-2">Track your store performance</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-6 rounded-lg border border-accent/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-accent/20 p-3 rounded-lg">
              <FiDollarSign className="h-8 w-8 text-accent" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiTrendingUp className="text-green-500" />
            <span className="text-green-500">+{stats.revenueGrowth}%</span>
            <span className="text-text-secondary">vs last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-6 rounded-lg border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <FiShoppingBag className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiTrendingUp className="text-green-500" />
            <span className="text-green-500">+{stats.ordersGrowth}%</span>
            <span className="text-text-secondary">vs last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-6 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-text-secondary text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <FiUsers className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiTrendingUp className="text-green-500" />
            <span className="text-green-500">+{stats.usersGrowth}%</span>
            <span className="text-text-secondary">vs last month</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Products</h3>
            <FiPackage className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{stats.totalProducts}</p>
          <p className="text-text-secondary text-sm">Total products in catalog</p>
        </div>

        <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <FiGrid className="h-6 w-6 text-accent" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{stats.totalCategories}</p>
          <p className="text-text-secondary text-sm">Active categories</p>
        </div>
      </div>

      {/* Average Order Value */}
      <div className="bg-background-secondary p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-text-secondary text-sm mb-2">Average Order Value</p>
            <p className="text-2xl font-bold text-white">
              ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-sm mb-2">Orders per User</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalUsers > 0 ? (stats.totalOrders / stats.totalUsers).toFixed(2) : '0.00'}
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-sm mb-2">Products per Category</p>
            <p className="text-2xl font-bold text-white">
              {stats.totalCategories > 0 ? (stats.totalProducts / stats.totalCategories).toFixed(1) : '0.0'}
            </p>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <p className="text-blue-400 text-sm">
          <strong>Note:</strong> Growth percentages are currently mock data. In a production environment, 
          these would be calculated based on historical data comparison.
        </p>
      </div>
    </div>
  );
}

