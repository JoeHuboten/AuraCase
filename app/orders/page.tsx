'use client';

import { useEffect, useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiCreditCard } from 'react-icons/fi';
import Link from 'next/link';

interface Order {
  id: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
    product: {
      id: string;
      name: string;
      image: string;
      category?: {
        id: string;
        name: string;
      };
    };
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FiPackage className="text-yellow-400" />;
      case 'PROCESSING':
        return <FiTruck className="text-blue-400" />;
      case 'SHIPPED':
        return <FiTruck className="text-purple-400" />;
      case 'DELIVERED':
        return <FiCheckCircle className="text-green-400" />;
      case 'CANCELLED':
        return <FiXCircle className="text-red-400" />;
      default:
        return <FiPackage className="text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'PROCESSING':
        return 'Processing';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'PROCESSING':
        return 'text-blue-400 bg-blue-400/20';
      case 'SHIPPED':
        return 'text-purple-400 bg-purple-400/20';
      case 'DELIVERED':
        return 'text-green-400 bg-green-400/20';
      case 'CANCELLED':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <Link
            href="/shop"
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-light transition"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage className="mx-auto h-24 w-24 text-text-secondary mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No orders yet</h2>
            <p className="text-text-secondary mb-8">You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-background-secondary rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold text-lg">
                      ${order.total.toFixed(2)}
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{getStatusText(order.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-text-secondary text-xs">
                            {item.product.category?.name || 'Unknown Category'}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-text-secondary">
                            <span>Qty: {item.quantity}</span>
                            {item.color && <span>• {item.color}</span>}
                            {item.size && <span>• {item.size}</span>}
                          </div>
                        </div>
                        <div className="text-white font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                      <span className="ml-4">Delivery: {order.deliveryFee === 0 ? 'Free' : `$${order.deliveryFee.toFixed(2)}`}</span>
                    </div>
                    {order.status === 'PENDING' && (
                      <Link
                        href={`/payment/${order.id}`}
                        className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-light transition-colors"
                      >
                        <FiCreditCard size={16} />
                        Pay Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
