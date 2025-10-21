'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUser, FiMail, FiShield, FiLogOut, FiPackage, FiHeart, FiSettings } from 'react-icons/fi';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/auth/signin');
    }
  }, [user, loading, router, mounted]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
          <p className="text-text-secondary">Manage your account settings and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Info Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center mb-4">
                <FiUser size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name || 'User'}</h2>
              <p className="text-text-secondary text-sm mb-2">{user.email}</p>
              {user.role === 'ADMIN' && (
                <div className="flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                  <FiShield size={14} />
                  <span>Admin</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Link
                href="/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-white"
              >
                <FiPackage size={20} />
                <span>My Orders</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-white"
              >
                <FiHeart size={20} />
                <span>Wishlist</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-white"
                >
                  <FiSettings size={20} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 transition-colors text-red-400"
              >
                <FiLogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Account Details</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Full Name</label>
                  <div className="bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                    {user.name || 'Not set'}
                  </div>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Email Address</label>
                  <div className="bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                    {user.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-text-secondary text-sm mb-2">Account Type</label>
                <div className="bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                  {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-700">
                <h4 className="text-xl font-bold text-white mb-4">Quick Stats</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-background/50 border border-gray-700 rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent mb-1">0</div>
                    <div className="text-text-secondary text-sm">Total Orders</div>
                  </div>
                  <div className="bg-background/50 border border-gray-700 rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent mb-1">0</div>
                    <div className="text-text-secondary text-sm">Wishlist Items</div>
                  </div>
                  <div className="bg-background/50 border border-gray-700 rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent mb-1">$0</div>
                    <div className="text-text-secondary text-sm">Total Spent</div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <p className="text-text-secondary text-sm">
                  Need to update your information? Contact our support team for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
