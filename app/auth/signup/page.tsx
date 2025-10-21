﻿'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Sign up failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8">
          <FiArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-text-secondary mb-8">Sign up to get started</p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2 font-medium">Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-background/50 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors" placeholder="Your name" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-white mb-2 font-medium">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background/50 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2 font-medium">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-background/50 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors" placeholder="" />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="w-full bg-background/50 border border-gray-700 rounded-lg px-12 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent transition-colors" placeholder="" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-accent to-accent/80 text-white py-3 rounded-lg font-medium hover:from-accent-light hover:to-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-accent hover:text-accent-light transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
