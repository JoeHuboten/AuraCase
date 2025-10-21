'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password, rememberMe);

      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8"
        >
          <FiArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-text-secondary mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
            <div>
              <label htmlFor="email" className="block text-white mb-2 font-medium">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-background/50 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-background/50 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
                  placeholder="Enter your password"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-background/50 border border-gray-700 rounded text-accent focus:ring-accent focus:ring-2"
                />
                <span className="text-text-secondary text-sm">Remember me for 7 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-accent/80 text-white py-3 rounded-lg font-medium hover:from-accent-light hover:to-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Do not have an account?{' '}
              <Link href="/auth/signup" className="text-accent hover:text-accent-light transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
