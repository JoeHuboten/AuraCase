'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Невалиден линк за нулиране на парола');
    }
  }, [token]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Паролата трябва да бъде поне 8 символа';
    if (!/[A-Z]/.test(pwd)) return 'Паролата трябва да съдържа поне една главна буква';
    if (!/[a-z]/.test(pwd)) return 'Паролата трябва да съдържа поне една малка буква';
    if (!/[0-9]/.test(pwd)) return 'Паролата трябва да съдържа поне една цифра';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат');
      return;
    }

    if (!token) {
      setError('Невалиден токен за нулиране');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setError(data.error || 'Неуспешно нулиране на парола');
      }
    } catch (err) {
      setError('Възникна грешка. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-primary border border-gray-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-green-400 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Паролата е променена успешно!</h1>
            <p className="text-text-secondary mb-6">
              Вашата парола беше нулирана успешно. Пренасочване към вход...
            </p>
            <Link href="/auth/signin" className="btn-primary inline-block">
              Влез сега
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-primary border border-gray-800 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="text-accent text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Нулиране на парола</h1>
            <p className="text-text-secondary">
              Въведете вашата нова парола
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                Нова парола
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Минимум 8 символа, с поне една главна буква, малка буква и цифра
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                Потвърдете паролата
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className={`w-full btn-primary py-3 ${loading || !token ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Нулиране...' : 'Нулирай паролата'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              Назад към вход
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
