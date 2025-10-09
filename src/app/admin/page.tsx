'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  BarChart3
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Зареждане...</div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const stats = [
    {
      title: 'Общи продажби',
      value: '12,543 лв',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Поръчки',
      value: '156',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Продукти',
      value: '234',
      change: '+3',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Клиенти',
      value: '89',
      change: '+15',
      icon: Users,
      color: 'bg-orange-500'
    },
  ]

  const quickActions = [
    {
      title: 'Управление на продукти',
      description: 'Добавяне, редактиране и изтриване на продукти',
      href: '/admin/products',
      icon: Package,
    },
    {
      title: 'Поръчки',
      description: 'Преглед и управление на поръчки',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Категории',
      description: 'Управление на категории',
      href: '/admin/categories',
      icon: BarChart3,
    },
    {
      title: 'Потребители',
      description: 'Управление на потребители',
      href: '/admin/users',
      icon: Users,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Администраторски панел</h1>
        <p className="text-gray-600">Добре дошли, {session.user.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Бързи действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <action.icon className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Последни поръчки</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            Няма поръчки за показване
          </div>
        </div>
      </div>
    </div>
  )
}

